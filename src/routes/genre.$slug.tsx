import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics } from "@/lib/comics-store";
import { Tag } from "lucide-react";
import { useMemo } from "react";
import { SITE_URL } from "@/lib/seo";
import { slugifyGenre } from "@/lib/slug";

export const Route = createFileRoute("/genre/$slug")({
  component: GenrePage,
  head: ({ params }) => ({
    meta: [
      { title: `Thể loại "${params.slug}" — GravureHub` },
      { name: "description", content: `Tổng hợp người mẫu gravure theo thể loại ${params.slug} tại GravureHub.` },
      { property: "og:title", content: `Thể loại "${params.slug}" — GravureHub` },
      { property: "og:description", content: `Tổng hợp người mẫu gravure theo thể loại ${params.slug}.` },
      { property: "og:url", content: `${SITE_URL}/genre/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/genre/${params.slug}` }],
  }),
});

function GenrePage() {
  const { slug } = Route.useParams();
  const comics = useComics();
  const { matched, displayName } = useMemo(() => {
    const list = comics.filter((c) => (c.genres ?? []).some((g) => slugifyGenre(g) === slug));
    const display = list.flatMap((c) => c.genres ?? []).find((g) => slugifyGenre(g) === slug) ?? slug;
    return { matched: list, displayName: display };
  }, [comics, slug]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        <header className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Tag className="h-6 w-6 text-primary" /> Thể loại: <span className="text-gradient-brand">{displayName}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{matched.length} kết quả.</p>
        </header>
        {matched.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Chưa có nội dung. <Link to="/" className="text-primary underline">Về thư viện</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {matched.map((c) => (
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