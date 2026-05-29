import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics, useComicsLoaded } from "@/lib/comics-store";
import { driveImageUrl, extractDriveId } from "@/lib/drive";
import { BookOpen, ChevronRight, Layers, User } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";
import { RatingWidget } from "@/components/RatingWidget";
import { SITE_URL } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/comic/$comicId")({
  component: ComicPage,
  loader: async ({ params }) => {
    const { data } = await supabase.from("comics").select("title,author,description,cover_id,genres").eq("id", params.comicId).maybeSingle();
    return { meta: data };
  },
  head: ({ loaderData, params }) => {
    const m = loaderData?.meta;
    if (!m) return { meta: [{ title: "Người mẫu — GravureHub" }] };
    const title = `${m.title}${m.author ? ` — ${m.author}` : ""} | GravureHub`;
    const fallback = `Khám phá bộ sưu tập ảnh gravure chất lượng cao của ${m.title} trên GravureHub — ngắm album cuộn dọc mượt mà, cập nhật liên tục.`;
    const desc = (m.description && m.description.length >= 50 ? m.description : fallback).slice(0, 160);
    const img = m.cover_id ? driveImageUrl(m.cover_id, 1200) : `${SITE_URL}/og-default.jpg`;
    const url = `${SITE_URL}/comic/${params.comicId}`;
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title }, { property: "og:description", content: desc },
        { property: "og:image", content: img }, { property: "og:url", content: url },
        { property: "og:type", content: "profile" },
        { name: "twitter:image", content: img },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: m.title, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: m.title,
            description: desc,
            image: img,
            url,
            ...(m.author ? { alternateName: m.author } : {}),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => <div className="min-h-screen"><SiteHeader /><div className="p-20 text-center"><h1 className="text-2xl font-bold">Không tìm thấy</h1><Link to="/" className="mt-4 inline-block text-primary underline">Về trang chủ</Link></div></div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
});

function ComicPage() {
  const { comicId } = Route.useParams();
  const comics = useComics();
  const loaded = useComicsLoaded();
  const comic = comics.find((c) => c.id === comicId);

  if (!loaded) return <div className="min-h-screen"><SiteHeader /><div className="p-20 text-center text-muted-foreground">Đang tải…</div></div>;
  if (!comic) throw notFound();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="relative isolate overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 scale-110 opacity-30 blur-2xl"
          style={{ backgroundImage: `url(${driveImageUrl(comic.coverId, 800)})`, backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/85 to-background" aria-hidden />
        <main className="mx-auto max-w-5xl px-4 pb-10 pt-10 sm:pt-14">
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            <div className="hover-lift mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-glow">
              <ComicCover id={comic.coverId} title={comic.title} />
            </div>
            <div className="animate-fade-in-up">
              <div className="flex flex-wrap gap-2">
                {comic.genres.map((g) => (
                  <Link key={g} to="/genre/$slug" params={{ slug: g }} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{g}</Link>
                ))}
              </div>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">{comic.title}</h1>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" /> {comic.author || "Ẩn danh"}
                <span className="mx-2 text-border">·</span>
                <BookOpen className="h-3.5 w-3.5" /> {comic.chapters.length} album
              </p>
              <p className="mt-5 leading-relaxed text-foreground/90">{comic.description}</p>
              <RatingWidget comicId={comic.id} />
              {comic.chapters.length > 0 && (
                <Link to="/read/$comicId/$chapterId" params={{ comicId: comic.id, chapterId: comic.chapters[0].id }}
                  className="group mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-105 active:scale-95">
                  Xem album đầu <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="mt-10 rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-secondary/40 p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
              <Layers className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <h2 className="text-2xl font-extrabold tracking-tight">Danh sách album</h2>
              <span className="text-xs text-muted-foreground">{comic.chapters.length} album</span>
            </div>
          </div>
          {comic.chapters.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">Chưa có album.</div>
          ) : (
            <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-background/40">
              {comic.chapters.map((ch, i) => (
                <li key={ch.id} className="group">
                  <Link to="/read/$comicId/$chapterId" params={{ comicId: comic.id, chapterId: ch.id }}
                    className="relative flex items-center justify-between gap-3 px-5 py-6 transition hover:bg-primary/5">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-muted-foreground tabular-nums group-hover:border-primary group-hover:bg-gradient-brand group-hover:text-primary-foreground">{i + 1}</span>
                      {(() => {
                        const thumb = ch.coverId || (ch.pages[0] ? (extractDriveId(ch.pages[0]) ?? ch.pages[0]) : "");
                        return thumb ? (
                          <img src={driveImageUrl(thumb, 400)} alt={ch.title} loading="lazy"
                            className="h-36 w-36 shrink-0 rounded-xl border border-border object-cover" />
                        ) : (
                          <div className="h-36 w-36 shrink-0 rounded-xl border border-dashed border-border bg-secondary/40" />
                        );
                      })()}
                      <span className="text-lg font-semibold tracking-tight group-hover:text-primary">{ch.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{ch.pages.length} ảnh</span>
                      <ChevronRight className="h-4 w-4 group-hover:text-primary" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <CommentSection comicId={comic.id} />
      </main>
    </div>
  );
}