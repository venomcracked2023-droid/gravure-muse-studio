import { useEffect, useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { createPlisioInvoice } from "@/lib/plisio.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";

type Props = {
  chapterId: string;
  chapterTitle: string;
  priceUsdt: number;
  onUnlocked?: () => void;
};

export function PremiumGate({ chapterId, chapterTitle, priceUsdt, onUnlocked }: Props) {
  const { user } = useAuth();
  const [checking, setChecking] = useState(true);
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createInvoice = useServerFn(createPlisioInvoice);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!user) {
        setChecking(false);
        return;
      }
      const { data } = await supabase
        .from("album_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("chapter_id", chapterId)
        .eq("status", "completed")
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setOwned(true);
        onUnlocked?.();
      }
      setChecking(false);
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [user, chapterId, onUnlocked]);

  // Return early after paid=1 redirect: poll once for webhook completion.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!new URLSearchParams(window.location.search).has("paid")) return;
    const iv = setInterval(async () => {
      if (!user) return;
      const { data } = await supabase
        .from("album_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("chapter_id", chapterId)
        .eq("status", "completed")
        .maybeSingle();
      if (data) {
        setOwned(true);
        onUnlocked?.();
        clearInterval(iv);
      }
    }, 4000);
    const stop = setTimeout(() => clearInterval(iv), 120000);
    return () => {
      clearInterval(iv);
      clearTimeout(stop);
    };
  }, [user, chapterId, onUnlocked]);

  if (checking || owned) return null;

  async function handleUnlock() {
    setError(null);
    setLoading(true);
    try {
      const res = await createInvoice({ data: { chapterId } });
      if (res.alreadyOwned) {
        setOwned(true);
        onUnlocked?.();
        return;
      }
      window.location.href = res.invoiceUrl;
    } catch (e: any) {
      setError(e?.message ?? "Could not generate payment invoice");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-primary/40 bg-card/95 p-4 text-center shadow-glow backdrop-blur-md">
      <div className="flex items-center justify-center gap-2">
        <Lock className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold">Premium Album</h2>
      </div>
      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{chapterTitle}</p>
      <div className="mt-2 text-2xl font-bold text-gradient-brand">{priceUsdt} USDT</div>
      <p className="mt-0.5 text-[10px] text-muted-foreground">USDT-TRC20 · BTC · ETH</p>
      {!user ? (
        <Link
          to="/login"
          className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground"
        >
          Sign in to unlock
        </Link>
      ) : (
        <button
          disabled={loading}
          onClick={handleUnlock}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:scale-[1.02] disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating invoice…
            </>
          ) : (
            <>Unlock with crypto</>
          )}
        </button>
      )}
      {error && <p className="mt-2 text-[10px] text-destructive">{error}</p>}
    </div>
  );
}
