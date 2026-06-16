import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics } from "@/lib/comics-store";
import { Star } from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { driveImageUrl } from "@/lib/drive";
import { buildSlugId } from "@/lib/slug";
import { getLatestChapters } from "@/lib/featured";
import { FeaturedMarquee } from "@/components/FeaturedMarquee";

export const Route = createFileRoute("/featured")({
  component: FeaturedPage,
  head: () => {
    const title = "Nổi bật — GravureHub";
    const desc = "Danh sách album gravure mới nhất được cập nhật liên tục.";
    const url = `${SITE_URL}/featured`;
    return {
      meta: [{ title }, { name: "description", content: desc },
        { property: "og:title", content: title }, { property: "og:description", content: desc },
        { property: "og:url", content: url }],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function FeaturedPage() {
  const comics = useComics();
  const latest = getLatestChapters(comics, 24);
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Album mới nhất",
    url: `${SITE_URL}/featured`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: latest.slice(0, 30).map((c, i) => ({
        "@type": "ListItem", position: i + 1,
        url: `${SITE_URL}/read/${c.comicSlug}/${buildSlugId(c.chapterTitle, c.chapterId)}`,
        name: c.chapterTitle,
        image: c.chapterCoverId ? driveImageUrl(c.chapterCoverId, 600) : undefined,
      })),
    },
  };
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Star className="h-6 w-6 fill-primary text-primary" /> Nổi bật
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{latest.length} album mới nhất, tự động cập nhật.</p>
        </header>
        {latest.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Chưa có album nào. <Link to="/admin" className="text-primary underline">Vào Quản lý</Link>
          </div>
        ) : (
          <>
          <div className="mb-10">
            <FeaturedMarquee items={latest.slice(0, 12)} />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {latest.map((c) => (
              <Link key={c.chapterId} to="/read/$comicId/$chapterId" params={{ comicId: c.comicSlug, chapterId: buildSlugId(c.chapterTitle, c.chapterId) }} className="group flex flex-col gap-2">
                <div className="hover-lift relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/40 bg-card">
                  <ComicCover id={c.chapterCoverId} title={c.chapterTitle} className="transition duration-500 group-hover:scale-110" />
                </div>
                <div>
                  <h2 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">{c.chapterTitle}</h2>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{c.comicTitle}</p>
                </div>
              </Link>
            ))}
          </div>
          </>
        )}
      </main>
    </div>
  );
}
