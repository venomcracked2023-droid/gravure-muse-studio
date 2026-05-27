import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics } from "@/lib/comics-store";
import { Clock } from "lucide-react";
import { useMemo } from "react";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/latest")({
  component: LatestPage,
  head: () => ({
    meta: [
      { title: "Mới cập nhật — GravureHub" },
      { name: "description", content: "Album ảnh gravure vừa cập nhật mới nhất tại GravureHub." },
      { property: "og:title", content: "Mới cập nhật — GravureHub" },
      { property: "og:description", content: "Album ảnh gravure vừa cập nhật mới nhất tại GravureHub." },
      { property: "og:url", content: `${SITE_URL}/latest` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/latest` }],
  }),
});

function LatestPage() {
  const comics = useComics();
  const latest = useMemo(() => [...comics]
    .map((c) => ({ c, ts: c.chapters.reduce((m, ch) => Math.max(m, ch.createdAt), 0) || c.createdAt }))
    .sort((a, b) => b.ts - a.ts).slice(0, 60).map((x) => x.c), [comics]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        <header className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight"><Clock className="h-6 w-6 text-primary" /> Mới cập nhật</h1>
          <p className="mt-2 text-sm text-muted-foreground">{latest.length} người mẫu vừa có album mới.</p>
        </header>
        {latest.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">Chưa có gì.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {latest.map((c) => (
              <Link key={c.id} to="/comic/$comicId" params={{ comicId: c.id }} className="group flex flex-col gap-2">
                <div className="hover-lift relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card group-hover:border-primary/60">
                  <ComicCover id={c.coverId} title={c.title} className="transition duration-500 group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">{c.title}</h3>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{c.chapters.length} album · {c.author || "Ẩn danh"}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}