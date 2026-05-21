import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics } from "@/lib/comics-store";
import { Star } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/featured")({
  component: FeaturedPage,
  head: () => {
    const title = "Nổi bật — GravureHub";
    const desc = "Danh sách người mẫu gravure nổi bật được GravureHub tuyển chọn.";
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
  const featured = comics.filter((c) => c.featured);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        <header className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Star className="h-6 w-6 fill-primary text-primary" /> Nổi bật
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{featured.length} người mẫu tuyển chọn.</p>
        </header>
        {featured.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Chưa có ai được đánh dấu nổi bật. <Link to="/admin" className="text-primary underline">Vào Quản lý</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {featured.map((c) => (
              <Link key={c.id} to="/comic/$comicId" params={{ comicId: c.id }} className="group flex flex-col gap-2">
                <div className="hover-lift relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/40 bg-card">
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