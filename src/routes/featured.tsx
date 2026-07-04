import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics } from "@/lib/comics-store";
import { Star } from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { driveImageUrl } from "@/lib/drive";
import { buildSlugId } from "@/lib/slug";
import { getLatestAlbums } from "@/lib/featured";
import { FeaturedMarquee } from "@/components/FeaturedMarquee";

export const Route = createFileRoute("/featured")({
  component: FeaturedPage,
  head: () => {
    const title = "Album mới — GravureHub";
    const desc =
      "Những album gravure mới đăng gần đây trên GravureHub, cập nhật liên tục mỗi ngày.";
    const url = `${SITE_URL}/featured`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function FeaturedPage() {
  const comics = useComics();
  const featured = getLatestAlbums(comics, 24);
  const ld = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Album mới",
    url: `${SITE_URL}/featured`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: featured.slice(0, 30).map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/read/${buildSlugId(a.comic.title, a.comic.id)}/${buildSlugId(a.chapter.title, a.chapter.id)}`,
        name: a.chapter.title,
        image:
          a.chapter.coverId || a.chapter.pages[0] || a.comic.coverId
            ? driveImageUrl(a.chapter.coverId || a.chapter.pages[0] || a.comic.coverId, 600)
            : undefined,
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
            <Star className="h-6 w-6 fill-primary text-primary" /> Album mới đăng
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {featured.length} album mới nhất, tự động cập nhật.
          </p>
        </header>
        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Chưa có album nào.{" "}
            <Link to="/admin" className="text-primary underline">
              Vào Quản lý
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <FeaturedMarquee items={featured.slice(0, 12)} />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {featured.map((a) => (
                <Link
                  key={a.chapter.id}
                  to="/read/$comicId/$chapterId"
                  params={{
                    comicId: buildSlugId(a.comic.title, a.comic.id),
                    chapterId: buildSlugId(a.chapter.title, a.chapter.id),
                  }}
                  className="group flex flex-col gap-2"
                >
                  <div className="hover-lift relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/40 bg-card">
                    <ComicCover
                      id={a.chapter.coverId || a.chapter.pages[0] || a.comic.coverId}
                      title={a.chapter.title}
                      className="transition duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h2 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                      {a.chapter.title}
                    </h2>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {a.comic.title} · {a.comic.chapters.length} album
                    </p>
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
