import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics, fetchComicsData } from "@/lib/comics-store";
import { Tag, Sparkles, Image as ImageIcon } from "lucide-react";
import { useMemo } from "react";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { slugifyGenre, buildSlugId } from "@/lib/slug";
import { driveImageUrl } from "@/lib/drive";

const GENRE_DESCRIPTIONS: Record<string, { title: string; desc: string; tag: string }> = {
  japanese: {
    title: "Japanese Gravure Models & Photobooks",
    desc: "Explore premier Japanese gravure idols, cover stars from Weekly Playboy & Young Magazine, and acclaimed solo photobooks.",
    tag: "Japan · Top Idols",
  },
  korean: {
    title: "Korean Glamour & Visual Models",
    desc: "Discover stunning Korean models, fitness pictorials, digital art lookbooks, and high-fashion studio collections.",
    tag: "Korea · Visual & Fitness",
  },
  vietnamese: {
    title: "Vietnamese Photobook Collections",
    desc: "Browse charismatic Vietnamese models and fashion pictorials showcasing radiant natural charm and elegant portraits.",
    tag: "Vietnam · Modern Portraiture",
  },
  cosplay: {
    title: "Cosplay & Character Photobooks",
    desc: "High-production cosplay photo sets bringing beloved anime, manga, and video game heroines to life with exquisite detail.",
    tag: "Cosplay · Anime & Game",
  },
  bikini: {
    title: "Bikini & Resort Swimwear Spreads",
    desc: "Sun-drenched tropical beach and luxury poolside photobooks captured in exotic locations from Okinawa to Hawaii.",
    tag: "Swimwear · Beach & Summer",
  },
  swimwear: {
    title: "Bikini & Resort Swimwear Spreads",
    desc: "Sun-drenched tropical beach and luxury poolside photobooks captured in exotic locations from Okinawa to Hawaii.",
    tag: "Swimwear · Beach & Summer",
  },
  lingerie: {
    title: "Sensual Lingerie & Studio Glamour",
    desc: "Intimate and sophisticated studio portraiture emphasizing delicate styling, soft natural lighting, and timeless elegance.",
    tag: "Lingerie · Fine-Art Glamour",
  },
  idol: {
    title: "J-Pop & K-Pop Idol Solo Photobooks",
    desc: "Exclusive pictorials and commemorative solo visual books from active music idol group members across Asia.",
    tag: "Idol · Solo Special",
  },
  beach: {
    title: "Tropical Beach & Seaside Photobooks",
    desc: "Golden-hour ocean horizons, refreshing coastal breezes, and sun-kissed natural aesthetic photography.",
    tag: "Beach · Seaside Horizon",
  },
  studio: {
    title: "High-Fashion Studio Portraiture",
    desc: "Masterfully lighted indoor studio editorial shoots with rich contrasts, contemporary fashion, and cinematic tones.",
    tag: "Studio · Contemporary Editorial",
  },
};

export const Route = createFileRoute("/genre/$slug")({
  loader: async () => {
    const comics = await fetchComicsData();
    return { comics };
  },
  head: ({ params }) => {
    const s = params.slug.toLowerCase();
    const info = GENRE_DESCRIPTIONS[s] || {
      title: `${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} Gravure Photobooks`,
      desc: `Explore high-definition ${params.slug} gravure models and vertical-scroll photobook albums on GravureHub.`,
    };
    const title = `${info.title} — GravureHub`;
    const canonical = `${SITE_URL}/genre/${params.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: info.desc },
        { property: "og:title", content: title },
        { property: "og:description", content: info.desc },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: info.desc },
      ],
      links: [
        { rel: "canonical", href: canonical },
        { rel: "alternate", hrefLang: "en", href: canonical },
        { rel: "alternate", hrefLang: "vi", href: canonical },
        { rel: "alternate", hrefLang: "ja", href: canonical },
        { rel: "alternate", hrefLang: "zh", href: canonical },
        { rel: "alternate", hrefLang: "ko", href: canonical },
        { rel: "alternate", hrefLang: "x-default", href: canonical },
      ],
    };
  },
  component: GenrePage,
});

function GenrePage() {
  const { slug } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const comics = useComics(loaderData?.comics);

  const { matched, displayName } = useMemo(() => {
    const s = slug.toLowerCase();
    const list = comics.filter((c) =>
      (c.genres ?? []).some((g) => slugifyGenre(g) === s || g.toLowerCase() === s)
    );
    const display =
      list.flatMap((c) => c.genres ?? []).find((g) => slugifyGenre(g) === s) ??
      slug.charAt(0).toUpperCase() + slug.slice(1);
    return { matched: list, displayName: display };
  }, [comics, slug]);

  const s = slug.toLowerCase();
  const genreMeta = GENRE_DESCRIPTIONS[s] || {
    title: `${displayName} Models & Photobooks`,
    desc: `Browse the finest high-definition ${displayName} gravure photo sets, photobooks, and model profiles curated on GravureHub.`,
    tag: `Category · ${displayName}`,
  };

  const totalAlbums = matched.reduce((acc, c) => acc + (c.chapters?.length || 0), 0);

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
    description: genreMeta.desc,
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
        {/* Visual Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-muted-foreground">Categories</span>
          <span>&gt;</span>
          <span className="font-medium text-foreground">{displayName}</span>
        </nav>

        {/* Category Hero Header */}
        <header className="mb-10 rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 via-card/40 to-primary/5 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Tag className="h-3.5 w-3.5" /> {genreMeta.tag}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> {matched.length} Models · {totalAlbums} Albums
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Category: <span className="text-gradient-brand">{displayName}</span>
          </h1>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {genreMeta.desc}
          </p>
        </header>

        {matched.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="font-medium">No models found in this category yet.</p>
            <Link to="/" className="mt-3 inline-block text-xs text-primary underline">
              Browse All Models in Library →
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
