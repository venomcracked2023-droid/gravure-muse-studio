import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { serialize } from "php-serialize";

// Plisio webhook: HMAC SHA1 over PHP-serialize(sorted params without verify_hash).
// Reference: https://plisio.net/documentation/endpoints/callback

const TERMINAL = new Set(["completed", "expired", "cancelled", "mismatch", "error"]);

function verifyHash(payload: Record<string, unknown>, secret: string): boolean {
  const { verify_hash, ...rest } = payload as Record<string, string>;
  if (!verify_hash || typeof verify_hash !== "string") return false;
  const sortedKeys = Object.keys(rest).sort();
  const ordered: Record<string, unknown> = {};
  for (const k of sortedKeys) {
    // Plisio signs parameter strings
    ordered[k] = typeof rest[k] === "string" ? rest[k] : String(rest[k]);
  }
  const serialized = serialize(ordered);
  const expected = createHmac("sha1", secret).update(serialized).digest("hex");
  try {
    const a = Buffer.from(verify_hash, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function parseBody(req: Request): Promise<Record<string, string>> {
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    return (await req.json()) as Record<string, string>;
  }
  const form = await req.formData();
  const out: Record<string, string> = {};
  form.forEach((v, k) => {
    out[k] = typeof v === "string" ? v : String(v);
  });
  return out;
}

export const Route = createFileRoute("/api/public/plisio/callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PLISIO_SECRET_KEY || process.env.PLISIO_API_KEY;
        if (!secret) return new Response("Missing secret", { status: 500 });

        let payload: Record<string, string>;
        try {
          payload = await parseBody(request);
        } catch {
          return new Response("Bad body", { status: 400 });
        }

        if (!verifyHash(payload, secret)) {
          console.warn("Plisio callback: invalid verify_hash");
          return new Response("Invalid signature", { status: 401 });
        }

        const txnId = String(payload.txn_id ?? "");
        const status = String(payload.status ?? "").toLowerCase();
        if (!txnId || !status) return new Response("Missing fields", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Only accept updates for existing pending purchases; ignore stray callbacks.
        let { data: purchase } = await supabaseAdmin
          .from("album_purchases")
          .select("id, status")
          .eq("txn_id", txnId)
          .maybeSingle();

        // Fallback: match by order_number if txn_id wasn't matched yet
        if (!purchase && payload.order_number) {
          const parts = String(payload.order_number).split(":");
          if (parts.length >= 2) {
            const [chapterId, userId] = parts;
            const { data: pByOrder } = await supabaseAdmin
              .from("album_purchases")
              .select("id, status")
              .eq("chapter_id", chapterId)
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            purchase = pByOrder;
          }
        }

        if (!purchase) return new Response("Unknown txn", { status: 404 });

        // Idempotent: if already terminal, ack without change.
        if (TERMINAL.has(purchase.status)) return new Response("ok");

        const patch: {
          status: string;
          raw: Record<string, string>;
          amount?: number;
          currency?: string;
        } = { status, raw: payload };
        if (payload.amount) patch.amount = Number(payload.amount);
        if (payload.currency) patch.currency = String(payload.currency);

        const { error } = await supabaseAdmin
          .from("album_purchases")
          .update(patch)
          .eq("id", purchase.id);
        if (error) {
          console.error("Plisio callback DB update error", error);
          return new Response("DB error", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});

export {};
