import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics, fetchComicsData } from "@/lib/comics-store";
import { Clock } from "lucide-react";
import { useMemo } from "react";
import { SITE_URL, SITE_NAME, SITE_BRAND_FULL } from "@/lib/seo";
import { driveImageUrl } from "@/lib/drive";
import { buildSlugId } from "@/lib/slug";
import { useI18n } from "@/lib/i18n/context";

export const Route = createFileRoute("/latest")({
  loader: async () => {
    const comics = await fetchComicsData();
    return { comics };
  },
  head: () => ({
    meta: [
      { title: "Latest Updates — GravureHub" },
      {
        name: "description",
        content:
          "Browse the latest updated gravure photo albums and new model photobooks on GravureHub (duahaumanga.com).",
      },
      { property: "og:title", content: "Latest Updates — GravureHub" },
      {
        property: "og:description",
        content:
          "Browse the latest updated gravure photo albums and new model photobooks on GravureHub (duahaumanga.com).",
      },
      { property: "og:url", content: `${SITE_URL}/latest` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/latest` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/latest` },
      { rel: "alternate", hrefLang: "vi", href: `${SITE_URL}/latest` },
      { rel: "alternate", hrefLang: "ja", href: `${SITE_URL}/latest` },
      { rel: "alternate", hrefLang: "zh", href: `${SITE_URL}/latest` },
      { rel: "alternate", hrefLang: "ko", href: `${SITE_URL}/latest` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/latest` },
    ],
  }),
  component: LatestPage,
});

function LatestPage() {
  const loaderData = Route.useLoaderData();
  const comics = useComics(loaderData?.comics);
  const { t } = useI18n();
  const latest = useMemo(
    () =>
      [...comics]
        .map((c) => ({
          c,
          ts: c.chapters.reduce((m, ch) => Math.max(m, ch.createdAt), 0) || c.createdAt,
        }))
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 60)
        .map((x) => x.c),
    [comics],
  );

  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Latest Updates", item: `${SITE_URL}/latest` },
    ],
  };

  const ldItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest Updates",
    description: "Newly updated gravure photo albums on GravureHub",
    url: `${SITE_URL}/latest`,
    numberOfItems: latest.length,
    itemListElement: latest.slice(0, 24).map((c, i) => ({
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
          <span className="font-medium text-foreground">Latest Updates</span>
        </nav>

        <header className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Clock className="h-6 w-6 text-primary" /> Latest Updates
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {latest.length} models with recently added albums and photo sets.
          </p>
        </header>

        {latest.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No albums yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {latest.map((c) => (
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
                  {c.chapters.length === 0 ? (
                    <span className="absolute bottom-2 left-2 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur">
                      {t("card.comingSoon")}
                    </span>
                  ) : (
                    <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                      {c.chapters.length} {t("card.albums")}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                    {c.title}
                  </h2>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {c.chapters.length > 0 ? (
                      `${c.chapters.length} ${c.chapters.length === 1 ? "album" : "albums"}`
                    ) : (
                      <span className="font-semibold text-amber-500">{t("card.comingSoon")}</span>
                    )}
                    {" · "}
                    {c.author || "Anonymous"}
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
