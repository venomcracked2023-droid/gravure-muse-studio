import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Comic,
  Chapter,
  deleteComic,
  uid,
  upsertComic,
  useComics,
  setFeatured,
} from "@/lib/comics-store";
import { extractDriveId, parseDriveIds } from "@/lib/drive";
import { ChevronDown, ChevronUp, Plus, Save, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/seo";
import { buildSlugId } from "@/lib/slug";
import { MarkdownEditor } from "@/components/MarkdownEditor";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => {
    const title = "Content Management Dashboard — GravureHub";
    const desc =
      "Contributor dashboard on GravureHub: create, edit, and manage photo sets, albums, and models.";
    const url = `${SITE_URL}/admin`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "noindex,nofollow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function emptyComic(): Comic {
  return {
    id: uid(),
    title: "",
    author: "",
    description: "",
    coverId: "",
    genres: [],
    chapters: [],
    createdAt: Date.now(),
    featured: false,
    bookingUrl: "",
    orderUrl: "",
  };
}

function AdminPage() {
  const comics = useComics();
  const [editing, setEditing] = useState<Comic | null>(null);
  const { user, isContributor, loading } = useAuth();

  const knownAuthors = Array.from(
    new Set(comics.map((c) => c.author?.trim()).filter(Boolean) as string[]),
  ).sort();
  const knownGenres = Array.from(
    new Set(
      comics
        .flatMap((c) => c.genres)
        .map((g) => g.trim())
        .filter(Boolean),
    ),
  ).sort();

  if (loading)
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="p-20 text-center text-muted-foreground">Loading…</main>
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h1 className="text-2xl font-bold tracking-tight">Sign-in Required</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You must be logged in as an authorized contributor to access the content management
              dashboard.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  if (!isContributor)
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-md px-4 py-20 text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h1 className="text-2xl font-bold tracking-tight">Contributor Access Required</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account does not have contributor permissions yet. Submit an application to begin
              publishing albums.
            </p>
            <Link
              to="/apply"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Apply as Contributor
            </Link>
          </div>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Model Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Images embedded directly from Google Drive.
            </p>
          </div>
          <button
            onClick={() => setEditing(emptyComic())}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Add New Model
          </button>
        </div>

        <div className="mt-8 grid gap-3">
          {comics.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <Link
                  to="/comic/$comicId"
                  params={{ comicId: buildSlugId(c.title, c.id) }}
                  className="truncate font-semibold hover:text-primary"
                >
                  {c.title || "(Untitled)"}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {c.chapters.length} {c.chapters.length === 1 ? "album" : "albums"} ·{" "}
                  {c.author || "Anonymous"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setFeatured(c.id, !c.featured)
                      .then(() =>
                        toast.success(c.featured ? "Removed from featured" : "Marked as featured"),
                      )
                      .catch((e) => toast.error(e.message))
                  }
                  className={
                    "inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs " +
                    (c.featured
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border hover:bg-secondary")
                  }
                >
                  <Star className={"h-3.5 w-3.5 " + (c.featured ? "fill-current" : "")} />
                  {c.featured ? "Featured" : "Feature"}
                </button>
                <button
                  onClick={() => setEditing(JSON.parse(JSON.stringify(c)))}
                  className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${c.title}"?`))
                      deleteComic(c.id)
                        .then(() => toast.success("Deleted"))
                        .catch((e) => toast.error(e.message));
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {editing && (
        <ComicEditor
          comic={editing}
          knownAuthors={knownAuthors}
          knownGenres={knownGenres}
          onClose={() => setEditing(null)}
          onSave={async (c) => {
            try {
              await upsertComic(c);
              toast.success("Saved");
              setEditing(null);
            } catch (e: any) {
              toast.error(e.message ?? "Error");
            }
          }}
        />
      )}
    </div>
  );
}

function ComicEditor({
  comic,
  knownAuthors,
  knownGenres,
  onClose,
  onSave,
}: {
  comic: Comic;
  knownAuthors: string[];
  knownGenres: string[];
  onClose: () => void;
  onSave: (c: Comic) => void;
}) {
  const [draft, setDraft] = useState<Comic>(comic);
  function patch(p: Partial<Comic>) {
    setDraft((d) => ({ ...d, ...p }));
  }
  function toggleGenre(g: string) {
    patch({
      genres: draft.genres.includes(g) ? draft.genres.filter((x) => x !== g) : [...draft.genres, g],
    });
  }
  function addChapter() {
    const ch: Chapter = {
      id: uid(),
      title: `Album ${draft.chapters.length + 1}`,
      pages: [],
      createdAt: Date.now(),
    };
    patch({ chapters: [...draft.chapters, ch] });
  }
  function updateChapter(id: string, p: Partial<Chapter>) {
    patch({ chapters: draft.chapters.map((c) => (c.id === id ? { ...c, ...p } : c)) });
  }
  function removeChapter(id: string) {
    patch({ chapters: draft.chapters.filter((c) => c.id !== id) });
  }
  function moveChapter(id: string, dir: -1 | 1) {
    const arr = [...draft.chapters];
    const i = arr.findIndex((c) => c.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    patch({ chapters: arr });
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="font-semibold">
            {comic.title ? `Edit: ${comic.title}` : "Add New Model"}
          </h2>
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">
            Close
          </button>
        </header>
        <div className="space-y-5 overflow-y-auto p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Model Name
              </span>
              <input
                value={draft.title}
                onChange={(e) => patch({ title: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Studio / Pen Name
              </span>
              <input
                value={draft.author}
                onChange={(e) => patch({ author: e.target.value })}
                className={inputClass}
                list="known-authors"
              />
              <datalist id="known-authors">
                {knownAuthors.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </label>
          </div>
          <div className="block">
            <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Description
            </span>
            <MarkdownEditor
              value={draft.description}
              onChange={(v) => patch({ description: v })}
              placeholder="Model biography and description… Markdown supported."
              minRows={5}
              maxLength={5000}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Genres (comma-separated)
              </span>
              <input
                value={draft.genres.join(", ")}
                onChange={(e) =>
                  patch({
                    genres: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className={inputClass}
              />
              {knownGenres.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {knownGenres.map((g) => {
                    const active = draft.genres.includes(g);
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGenre(g)}
                        className={
                          "rounded-full border px-2.5 py-0.5 text-xs " +
                          (active
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border text-muted-foreground hover:text-foreground")
                        }
                      >
                        {active ? "✓ " : "+ "}
                        {g}
                      </button>
                    );
                  })}
                </div>
              )}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Cover Photo (Drive ID / link)
              </span>
              <input
                value={draft.coverId}
                onChange={(e) =>
                  patch({ coverId: extractDriveId(e.target.value) ?? e.target.value })
                }
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Booking URL
              </span>
              <input
                value={draft.bookingUrl ?? ""}
                onChange={(e) => patch({ bookingUrl: e.target.value })}
                placeholder="https://…"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Order New Album URL
              </span>
              <input
                value={draft.orderUrl ?? ""}
                onChange={(e) => patch({ orderUrl: e.target.value })}
                placeholder="https://…"
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Photo Albums</h3>
              <button
                onClick={addChapter}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-secondary"
              >
                <Plus className="h-3.5 w-3.5" /> Add Album
              </button>
            </div>
            <div className="space-y-3">
              {draft.chapters.map((ch, i) => (
                <div key={ch.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">#{i + 1}</span>
                    <input
                      value={ch.title}
                      onChange={(e) => updateChapter(ch.id, { title: e.target.value })}
                      className={inputClass + " flex-1"}
                    />
                    <button
                      onClick={() => moveChapter(ch.id, -1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveChapter(ch.id, 1)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeChapter(ch.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={ch.pages.join("\n")}
                    onChange={(e) => updateChapter(ch.id, { pages: parseDriveIds(e.target.value) })}
                    rows={4}
                    placeholder="One File ID or Drive link per line"
                    className={inputClass + " mt-2 font-mono text-xs"}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={ch.coverId ?? ""}
                      onChange={(e) =>
                        updateChapter(ch.id, {
                          coverId: extractDriveId(e.target.value) ?? e.target.value,
                        })
                      }
                      placeholder="Album cover image (Drive ID/link) — leave empty for 1st photo"
                      className={inputClass + " flex-1 text-xs"}
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      value={ch.videoUrl ?? ""}
                      onChange={(e) => updateChapter(ch.id, { videoUrl: e.target.value })}
                      placeholder="Embed video URL (YouTube, Vimeo, Drive…) — optional"
                      className={inputClass + " text-xs"}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={ch.isPremium ?? false}
                        onChange={(e) => updateChapter(ch.id, { isPremium: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <span>Premium</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Price</span>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={ch.priceUsdt ?? 2}
                        disabled={!ch.isPremium}
                        onChange={(e) =>
                          updateChapter(ch.id, {
                            priceUsdt: Math.max(0.1, Number(e.target.value) || 0),
                          })
                        }
                        className={inputClass + " w-20 text-xs disabled:opacity-40"}
                      />
                      <span className="text-xs text-muted-foreground">USDT</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ch.pages.length} {ch.pages.length === 1 ? "photo" : "photos"}
                  </p>
                </div>
              ))}
              {draft.chapters.length === 0 && (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No albums added yet.
                </div>
              )}
            </div>
          </div>
        </div>
        <footer className="flex justify-end gap-2 border-t border-border bg-background/40 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(draft)}
            disabled={!draft.title.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40 hover:opacity-90"
          >
            <Save className="h-4 w-4" /> Save
          </button>
        </footer>
      </div>
    </div>
  );
}
