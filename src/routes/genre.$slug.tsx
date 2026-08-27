import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics, fetchComicsData } from "@/lib/comics-store";
import { Tag } from "lucide-react";
import { useMemo } from "react";
import { SITE_URL, SITE_NAME, SITE_BRAND_FULL } from "@/lib/seo";
import { slugifyGenre, buildSlugId } from "@/lib/slug";
import { driveImageUrl } from "@/lib/drive";

export const Route = createFileRoute("/genre/$slug")({
  loader: async () => {
    const comics = await fetchComicsData();
    return { comics };
  },
  head: ({ params }) => ({
    meta: [
      { title: `Category: ${params.slug} — GravureHub` },
      {
        name: "description",
        content: `Explore gravure models and photobooks in category ${params.slug} on GravureHub (duahaumanga.com).`,
      },
      { property: "og:title", content: `Category: ${params.slug} — GravureHub` },
      {
        property: "og:description",
        content: `Explore gravure models and photobooks in category ${params.slug} on GravureHub (duahaumanga.com).`,
      },
      { property: "og:url", content: `${SITE_URL}/genre/${params.slug}` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/genre/${params.slug}` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/genre/${params.slug}` },
      { rel: "alternate", hrefLang: "vi", href: `${SITE_URL}/genre/${params.slug}` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/genre/${params.slug}` },
    ],
  }),
  component: GenrePage,
});

function GenrePage() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const comics = useComics(loaderData?.comics);
  const { matched, displayName } = useMemo(() => {
    const list = comics.filter((c) => (c.genres ?? []).some((g) => slugifyGenre(g) === slug));
    const display =
      list.flatMap((c) => c.genres ?? []).find((g) => slugifyGenre(g) === slug) ?? slug;
    return { matched: list, displayName: display };
  }, [comics, slug]);

  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: `Category: ${displayName}`,
        item: `${SITE_URL}/genre/${slug}`,
      },
    ],
  };

  const ldItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Category: ${displayName}`,
    description: `Gravure models in ${displayName} on GravureHub`,
    url: `${SITE_URL}/genre/${slug}`,
    numberOfItems: matched.length,
    itemListElement: matched.slice(0, 30).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/comic/${buildSlugId(c.title, c.id)}`,
      name: c.title,
      image: c.coverId ? driveImageUrl(c.coverId, 600) : undefined,
    })),
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldItemList) }}
      />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        {/* Visual Breadcrumb (Task 16) */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-foreground">Category: {displayName}</span>
        </nav>

        <header className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Tag className="h-6 w-6 text-primary" /> Category:{" "}
            <span className="text-gradient-brand">{displayName}</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{matched.length} models found.</p>
        </header>

        {matched.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No models found in this category.{" "}
            <Link to="/" className="text-primary underline">
              Back to Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {matched.map((c) => (
              <Link
                key={c.id}
                to="/comic/$comicId"
                params={{ comicId: buildSlugId(c.title, c.id) }}
                className="group flex flex-col gap-2"
              >
                <div className="hover-lift relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card group-hover:border-primary/60">
                  <ComicCover
                    id={c.coverId}
                    title={c.title}
                    className="transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div>
                  <h2 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                    {c.title}
                  </h2>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {c.chapters.length} {c.chapters.length === 1 ? "album" : "albums"} · {c.author || "Anonymous"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
