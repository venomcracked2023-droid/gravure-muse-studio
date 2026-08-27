import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/apply")({
  component: ApplyPage,
  head: () => {
    const title = "Contributor Application — GravureHub";
    const desc =
      "Apply to become a GravureHub contributor to publish and manage high-definition gravure photo albums.";
    const url = `${SITE_URL}/apply`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "noindex,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

type Application = {
  id: string;
  status: string;
  pen_name: string;
  reason: string;
  sample_link: string | null;
  created_at: string;
};

function ApplyPage() {
  const { user, loading, isContributor, refresh } = useAuth();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);
  const [fetching, setFetching] = useState(true);
  const [penName, setPenName] = useState("");
  const [reason, setReason] = useState("");
  const [sample, setSample] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);
  useEffect(() => {
    if (!user) return;
    supabase
      .from("contributor_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setApp(data as Application | null);
        setFetching(false);
      });
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const { data, error } = await supabase
        .from("contributor_applications")
        .insert({ user_id: user.id, pen_name: penName, reason, sample_link: sample || null })
        .select("*")
        .single();
      if (error) throw error;
      setApp(data as Application);
      toast.success("Application submitted. Awaiting admin review.");
      await refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  if (loading || fetching)
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="p-20 text-center text-muted-foreground">Loading…</main>
      </div>
    );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">Contributor Application</h1>
        <p className="mt-2 text-muted-foreground">
          Become a contributor to publish and share photo albums on GravureHub.
        </p>

        {isContributor && (
          <div className="mt-6 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm">
            ✅ You are already an approved contributor.{" "}
            <Link to="/admin" className="text-primary underline">
              Go to Management Dashboard
            </Link>
          </div>
        )}

        {app && (
          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">Latest Application</div>
            <div className="mt-1 font-semibold">{app.pen_name}</div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs">
              Status:{" "}
              <span
                className={
                  app.status === "approved"
                    ? "text-primary"
                    : app.status === "rejected"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }
              >
                {app.status === "pending"
                  ? "Pending Review"
                  : app.status === "approved"
                    ? "Approved"
                    : "Rejected"}
              </span>
            </div>
          </div>
        )}

        {!isContributor && (!app || app.status === "rejected") && (
          <form
            onSubmit={submit}
            className="mt-6 space-y-3 rounded-2xl border border-border bg-card p-5"
          >
            <div>
              <label className="text-sm font-medium">Pen Name / Handle</label>
              <input
                required
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                placeholder="e.g. MuseCurator"
                className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Reason for Joining</label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Tell us what albums or models you plan to share..."
                className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sample Portfolio Link (Optional)</label>
              <input
                value={sample}
                onChange={(e) => setSample(e.target.value)}
                placeholder="https://..."
                className="mt-1 w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Submit Application
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
