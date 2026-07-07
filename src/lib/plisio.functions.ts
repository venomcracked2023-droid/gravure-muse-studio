import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PLISIO_API = "https://api.plisio.net/api/v1";
const ALLOWED_COINS = "USDT_TRX,BTC,ETH";

export const createPlisioInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { chapterId: string }) => {
    if (!input?.chapterId || typeof input.chapterId !== "string") {
      throw new Error("chapterId required");
    }
    return { chapterId: input.chapterId };
  })
  .handler(async ({ data, context }) => {
    const secret = process.env.PLISIO_SECRET_KEY;
    if (!secret) throw new Error("PLISIO_SECRET_KEY not configured");

    const { supabase, userId } = context;

    // Load album (chapter) with premium info + comic title for order name.
    const { data: chapter, error: chErr } = await supabase
      .from("chapters")
      .select("id, title, comic_id, is_premium, price_usdt, comics(title)")
      .eq("id", data.chapterId)
      .maybeSingle();
    if (chErr || !chapter) throw new Error("Album not found");
    if (!(chapter as any).is_premium) throw new Error("Album is not premium");

    const price = Number((chapter as any).price_usdt ?? 2);
    const comicTitle = (chapter as any).comics?.title ?? "";
    const orderName = `${comicTitle} — ${chapter.title}`.slice(0, 100);

    // Already completed purchase? Return early.
    const { data: owned } = await supabase
      .from("album_purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("chapter_id", data.chapterId)
      .eq("status", "completed")
      .maybeSingle();
    if (owned) {
      return { alreadyOwned: true as const };
    }

    // Build absolute URLs from the current request host so preview + prod both work.
    const host = getRequestHost();
    const origin = `https://${host}`;
    const orderNumber = `${data.chapterId}:${userId}:${Date.now()}`;

    const params = new URLSearchParams({
      source_currency: "USDT",
      source_amount: price.toFixed(2),
      order_number: orderNumber,
      order_name: orderName,
      allowed_psys_cids: ALLOWED_COINS,
      callback_url: `${origin}/api/public/plisio/callback?json=true`,
      success_callback_url: `${origin}/read/${chapter.comic_id}/${data.chapterId}?paid=1`,
      fail_callback_url: `${origin}/read/${chapter.comic_id}/${data.chapterId}?paid=0`,
      expire_min: "30",
      email: (context.claims as any)?.email ?? "",
      api_key: secret,
    });

    const res = await fetch(`${PLISIO_API}/invoices/new?${params.toString()}`);
    const json: any = await res.json();
    if (json?.status !== "success" || !json?.data?.invoice_url) {
      console.error("Plisio invoice error", json);
      throw new Error(json?.data?.message || "Failed to create Plisio invoice");
    }

    // Record pending purchase (RLS allows: own user_id, status=new|pending).
    await supabase.from("album_purchases").insert({
      user_id: userId,
      chapter_id: data.chapterId,
      txn_id: json.data.txn_id,
      invoice_url: json.data.invoice_url,
      source_amount: price,
      source_currency: "USDT",
      status: "new",
    });

    return {
      alreadyOwned: false as const,
      invoiceUrl: json.data.invoice_url as string,
      txnId: json.data.txn_id as string,
    };
  });

export const listMyPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("album_purchases")
      .select("chapter_id, status")
      .eq("user_id", context.userId)
      .eq("status", "completed");
    return (data ?? []).map((r) => r.chapter_id);
  });