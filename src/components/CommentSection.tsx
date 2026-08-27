import { useEffect, useState } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

type CommentRow = { id: string; user_id: string; content: string; created_at: string };
type ProfileRow = { id: string; display_name: string | null; avatar_url: string | null };

const MAX = 2000;

export function CommentSection({ comicId, chapterId }: { comicId: string; chapterId?: string }) {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<CommentRow[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileRow>>({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  async function load() {
    setLoading(true);
    let q = supabase
      .from("comments")
      .select("id,user_id,content,created_at")
      .eq("comic_id", comicId)
      .order("created_at", { ascending: false })
      .limit(200);
    q = chapterId ? q.eq("chapter_id", chapterId) : q.is("chapter_id", null);
    const { data, error } = await q;
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const rows = (data ?? []) as CommentRow[];
    setItems(rows);
    const ids = Array.from(new Set(rows.map((r) => r.user_id)));
    if (ids.length) {
      const { data: pr } = await supabase
        .from("profiles")
        .select("id,display_name,avatar_url")
        .in("id", ids);
      setProfiles(Object.fromEntries((pr ?? []).map((p) => [p.id, p as ProfileRow])));
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [comicId, chapterId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }
    const content = text.trim();
    if (!content) return;
    if (content.length > MAX) {
      toast.error(`Maximum ${MAX} characters`);
      return;
    }
    setPosting(true);
    const { error } = await supabase.from("comments").insert({
      comic_id: comicId,
      chapter_id: chapterId ?? null,
      user_id: user.id,
      content,
    });
    setPosting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setText("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return;
    if (!user) {
      toast.error("You need to sign in again");
      return;
    }
    const { data, error } = await supabase.from("comments").delete().eq("id", id).select("id");
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data || data.length === 0) {
      toast.error("Permission denied");
      return;
    }
    setItems((arr) => arr.filter((x) => x.id !== id));
    toast.success("Comment deleted");
  }

  return (
    <section className="mt-10" aria-label="Comments">
      <header className="mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">
          Comments{chapterId ? " (Album)" : ""} ({items.length})
        </h2>
      </header>

      {user ? (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            rows={3}
            placeholder="Share your thoughts on this album…"
            className="w-full resize-y rounded-lg border border-border bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary/60"
            maxLength={MAX}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {text.length}/{MAX}
            </span>
            <button
              type="submit"
              disabled={posting || !text.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              {posting ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/30 p-4 text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>{" "}
          to join the discussion and post comments.
        </div>
      )}

      <ul className="mt-5 space-y-3">
        {loading && (
          <li className="rounded-xl border border-border bg-card/30 p-4 text-sm text-muted-foreground">
            Loading comments…
          </li>
        )}
        {!loading && items.length === 0 && (
          <li className="rounded-xl border border-dashed border-border bg-card/20 p-6 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </li>
        )}
        {items.map((c) => {
          const p = profiles[c.user_id];
          const name = p?.display_name ?? "Anonymous Viewer";
          const canDelete = !!user && (user.id === c.user_id || isAdmin);
          return (
            <li key={c.id} className="rounded-xl border border-border bg-card/40 p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-secondary text-xs font-semibold">
                  {p?.avatar_url ? (
                    <img
                      src={p.avatar_url}
                      alt={`Avatar of ${name}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    name.slice(0, 1).toUpperCase()
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm">
                      <span className="font-semibold">{name}</span>
                      <time className="ml-2 text-xs text-muted-foreground" dateTime={c.created_at}>
                        {new Date(c.created_at).toLocaleString("en-US")}
                      </time>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => remove(c.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground/90">
                    {c.content}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
