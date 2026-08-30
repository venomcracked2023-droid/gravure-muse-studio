import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics, fetchComicsData } from "@/lib/comics-store";
import {
  Tag,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  Layers,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useMemo } from "react";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { slugifyGenre, buildSlugId } from "@/lib/slug";
import { driveImageUrl } from "@/lib/drive";
import { useI18n } from "@/lib/i18n/context";

type GenreInfo = {
  title: string;
  desc: string;
  tag: string;
  extendedText: string[];
  highlights: string[];
};

const GENRE_DESCRIPTIONS: Record<string, GenreInfo> = {
  japanese: {
    title: "Japanese Gravure Models & Photobooks",
    desc: "Explore premier Japanese gravure idols, cover stars from Weekly Playboy & Young Magazine, and acclaimed solo photobooks.",
    tag: "Japan · Top Idols & Magazines",
    extendedText: [
      "Japanese gravure photography represents a world-renowned genre of sensual fine-art portraiture and idol culture. Featured models include beloved magazine cover stars, celebrated actresses, and top visual idols whose photobooks capture sunlit coastal escapes, traditional ryokan retreats, and elegant urban styling.",
      "Every album on GravureHub is curated in high definition with a seamless vertical-scroll reading format, allowing you to immerse yourself in the natural charisma, radiant smiles, and artistic expressions of Japan's most popular gravure icons without intrusive interruptions.",
    ],
    highlights: [
      "Weekly Shonen & Playboy Stars",
      "4K Ultra-HD Scans",
      "Vertical Scroll Optimization",
    ],
  },
  korean: {
    title: "Korean Glamour & Visual Models",
    desc: "Discover stunning Korean models, fitness pictorials, digital art lookbooks, and high-fashion studio collections.",
    tag: "Korea · Visual & Fitness Lookbooks",
    extendedText: [
      "Korean visual and glamour photography is celebrated for its sleek modern aesthetics, immaculate styling, and trendsetting studio lighting. From popular SNS fitness influencers and freelance pictorial models to renowned web photobook creators, Korean albums deliver a unique blend of elegance and alluring confidence.",
      "Browse our comprehensive collection of Korean model galleries, updated regularly with full vertical-scroll photobook releases capturing pristine aesthetics and vibrant fashion concepts.",
    ],
    highlights: [
      "Trendsetting K-Visuals",
      "Fitness & Lookbook Concepts",
      "Crystal Clear HD Resolution",
    ],
  },
  vietnamese: {
    title: "Vietnamese Photobook Collections",
    desc: "Browse charismatic Vietnamese models and fashion pictorials showcasing radiant natural charm and elegant portraits.",
    tag: "Vietnam · Modern Portraiture & Charm",
    extendedText: [
      "Vietnamese glamour portraiture brings together youthful vibrancy, tropical warmth, and graceful natural aesthetics. Featuring charismatic local models, fashion creators, and rising visual stars, each collection showcases creative studio compositions alongside breathtaking Vietnamese landscapes.",
      "Experience dedicated vertical photobooks highlighting the captivating beauty and expressive artistry of Vietnamese model albums on GravureHub.",
    ],
    highlights: ["Natural Charm & Elegance", "Exotic Tropical Locales", "Mobile-Optimized Viewing"],
  },
  cosplay: {
    title: "Cosplay & Character Photobooks",
    desc: "High-production cosplay photo sets bringing beloved anime, manga, and video game heroines to life with exquisite detail.",
    tag: "Cosplay · Anime, Game & Fantasy",
    extendedText: [
      "Cosplay photobooks merge meticulous costume craftsmanship, professional character portrayal, and cinematic photography. Top cosplayers across Asia embody iconic heroines from anime, manga, and gaming masterpieces with authentic wigs, bespoke outfits, and tailored thematic atmospheres.",
      "Dive into our rich cosplay catalog featuring dramatic lighting, fantasy effects, and alluring artistic interpretations that elevate costume play into a true visual art form.",
    ],
    highlights: [
      "Iconic Anime & Game Characters",
      "Cinema-Grade Costume Detail",
      "Thematic Staging & FX",
    ],
  },
  bikini: {
    title: "Bikini & Resort Swimwear Spreads",
    desc: "Sun-drenched tropical beach and luxury poolside photobooks captured in exotic locations from Okinawa to Hawaii.",
    tag: "Swimwear · Beach & Tropical Summer",
    extendedText: [
      "The quintessential gravure aesthetic comes alive in sun-drenched bikini and resort swimwear spreads. Shot across crystal-clear waters in Okinawa, Bali, Hawaii, and Mediterranean coasts, these photobooks celebrate summer energy, golden hour lighting, and radiant athletic charm.",
      "Enjoy uninterrupted vertical-scrolling through vibrant swimwear pictorials designed to give you a front-row seat to world-class resort photography.",
    ],
    highlights: [
      "Tropical Beach Destinations",
      "Golden Hour Sunlit Lighting",
      "Vibrant Resort Fashion",
    ],
  },
  swimwear: {
    title: "Bikini & Resort Swimwear Spreads",
    desc: "Sun-drenched tropical beach and luxury poolside photobooks captured in exotic locations from Okinawa to Hawaii.",
    tag: "Swimwear · Beach & Tropical Summer",
    extendedText: [
      "The quintessential gravure aesthetic comes alive in sun-drenched bikini and resort swimwear spreads. Shot across crystal-clear waters in Okinawa, Bali, Hawaii, and Mediterranean coasts, these photobooks celebrate summer energy, golden hour lighting, and radiant athletic charm.",
      "Enjoy uninterrupted vertical-scrolling through vibrant swimwear pictorials designed to give you a front-row seat to world-class resort photography.",
    ],
    highlights: [
      "Tropical Beach Destinations",
      "Golden Hour Sunlit Lighting",
      "Vibrant Resort Fashion",
    ],
  },
  lingerie: {
    title: "Sensual Lingerie & Studio Glamour",
    desc: "Intimate and sophisticated studio portraiture emphasizing delicate styling, soft natural lighting, and timeless elegance.",
    tag: "Lingerie · Fine-Art Glamour",
    extendedText: [
      "Lingerie and boudoir collections focus on soft natural daylight, delicate fabrics, and artistic intimacy. Photographed in luxury boutique suites and minimalist studios, these photobooks capture understated glamour, graceful curves, and tender emotional nuance.",
      "Our curated lingerie galleries provide an aesthetically refined reading experience with seamless edge-to-edge vertical presentation.",
    ],
    highlights: [
      "Intimate Ambient Lighting",
      "Delicate Fine-Art Aesthetics",
      "High-End Studio Ambiance",
    ],
  },
  idol: {
    title: "J-Pop & K-Pop Idol Solo Photobooks",
    desc: "Exclusive pictorials and commemorative solo visual books from active music idol group members across Asia.",
    tag: "Idol · Solo Special Editions",
    extendedText: [
      "Solo idol photobooks offer fans an intimate glimpse into the personal charisma and evolving artistry of top music group members. Commemorating milestones, graduations, and international tours, these albums capture candid off-stage moments, high-fashion styling, and radiant smiles.",
      "Explore comprehensive solo idol collections available for free vertical reading on GravureHub.",
    ],
    highlights: [
      "Top J-Pop & K-Pop Stars",
      "Commemorative Solo Releases",
      "Exclusive Candid Pictorials",
    ],
  },
  beach: {
    title: "Tropical Beach & Seaside Photobooks",
    desc: "Golden-hour ocean horizons, refreshing coastal breezes, and sun-kissed natural aesthetic photography.",
    tag: "Beach · Seaside Horizons",
    extendedText: [
      "Seaside photo albums capture the timeless allure of ocean waves, white sands, and breathtaking sunset horizons. Each spread emphasizes refreshing natural light and the carefree spirit of coastal retreats.",
      "Immerse yourself in endless summer visuals optimized for quick and smooth scrolling across mobile and desktop devices.",
    ],
    highlights: ["Coastal Horizons", "Sun-Kissed Aesthetics", "Pure Vacation Vibes"],
  },
  studio: {
    title: "High-Fashion Studio Portraiture",
    desc: "Masterfully lighted indoor studio editorial shoots with rich contrasts, contemporary fashion, and cinematic tones.",
    tag: "Studio · Contemporary Editorial",
    extendedText: [
      "Studio photography showcases precision lighting, inventive backdrops, and editorial fashion concepts. With stark contrasts, dramatic chiaroscuro, and creative color palettes, these albums emphasize the model's expressive range and artistic versatility.",
      "Discover the finest indoor glamour portraiture in high resolution on GravureHub.",
    ],
    highlights: ["Precision Studio Lighting", "High-Fashion Styling", "Rich Cinematic Contrasts"],
  },
};

function getGenreDetails(slug: string, displayName: string): GenreInfo {
  const s = slug.toLowerCase();
  if (GENRE_DESCRIPTIONS[s]) return GENRE_DESCRIPTIONS[s];

  return {
    title: `${displayName} Models & Photobooks`,
    desc: `Browse the finest high-definition ${displayName} gravure photo sets, photobooks, and model profiles curated on GravureHub.`,
    tag: `Category · ${displayName}`,
    extendedText: [
      `Explore high-definition ${displayName} gravure albums and photobook collections featuring acclaimed models from across Asia. Each photo set offers an artistic combination of visual storytelling, captivating styling, and high-resolution photography.`,
      `GravureHub brings you an uninterrupted vertical-scroll reading format designed for smartphones, tablets, and desktop displays, updated regularly with new album releases.`,
    ],
    highlights: [
      `Curated ${displayName} Albums`,
      "HD Vertical-Scroll Reader",
      "Free Daily Updates",
    ],
  };
}

export const Route = createFileRoute("/genre/$slug")({
  loader: async () => {
    const comics = await fetchComicsData();
    return { comics };
  },
  head: ({ params }) => {
    const s = params.slug.toLowerCase();
    const displayName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
    const info = getGenreDetails(s, displayName);
    const title = `${info.title} — GravureHub`;
    const canonical = `${SITE_URL}/genre/${params.slug}`;

    return {
      meta: [
        { title },
        {
          name: "description",
          content: `${info.desc} Free vertical-scroll gravure library on duahaumanga.com.`,
        },
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
  const { t } = useI18n();

  const { matched, displayName } = useMemo(() => {
    const s = slug.toLowerCase();
    const list = comics.filter((c) =>
      (c.genres ?? []).some((g) => slugifyGenre(g) === s || g.toLowerCase() === s),
    );
    const display =
      list.flatMap((c) => c.genres ?? []).find((g) => slugifyGenre(g) === s) ??
      slug.charAt(0).toUpperCase() + slug.slice(1);
    return { matched: list, displayName: display };
  }, [comics, slug]);

  const genreMeta = useMemo(() => getGenreDetails(slug, displayName), [slug, displayName]);
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
        {/* Breadcrumb */}
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

        {/* Enhanced Category Hero Header (Solves Thin Page) */}
        <header className="mb-10 rounded-3xl border border-border/60 bg-gradient-to-br from-card/90 via-card/50 to-primary/10 p-6 sm:p-10 backdrop-blur-xl shadow-lg relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Tag className="h-3.5 w-3.5" /> {genreMeta.tag}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> {matched.length} Models ·{" "}
                {totalAlbums} Albums
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              <span className="text-gradient-brand">{displayName}</span> Photobooks & Models
            </h1>

            <div className="mt-4 space-y-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {genreMeta.extendedText.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Category Highlight Badges */}
            <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-border/40">
              {genreMeta.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/50 px-2.5 py-1 text-xs font-medium text-foreground/90"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> {h}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Model Gallery Grid */}
        <section className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Featured {displayName} Models
              </h2>
              <p className="text-xs text-muted-foreground">
                Showing all {matched.length} model collections in this category
              </p>
            </div>
          </div>

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
                    <h3 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                      {c.title}
                    </h3>
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
        </section>

        {/* SEO Category Guide & Information Section */}
        <section className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8 backdrop-blur">
          <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-3">
            <BookOpen className="h-4 w-4" /> Category Viewing Guide
          </div>
          <h2 className="text-lg font-bold text-foreground mb-3">
            About {displayName} Gravure Photobooks on GravureHub
          </h2>
          <div className="space-y-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            <p>
              GravureHub (<strong>duahaumanga.com</strong>) provides an extensive collection of{" "}
              <strong>{displayName}</strong> photo albums available for free online reading. Our
              reader uses advanced vertical-scrolling optimization so you can explore hundreds of
              high-definition pages effortlessly on any modern smartphone or desktop browser.
            </p>
            <p>
              All albums in the <strong>{displayName}</strong> section are updated frequently with
              new model pictorials, studio lookbooks, and commemorative photobook releases. You can
              easily bookmark favorite models, track new chapter updates, or explore related
              categories.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-primary" /> Explore other categories:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Japanese",
                "Korean",
                "Vietnamese",
                "Cosplay",
                "Bikini",
                "Lingerie",
                "Studio",
                "Idol",
              ].map((cat) => (
                <Link
                  key={cat}
                  to="/genre/$slug"
                  params={{ slug: cat.toLowerCase() }}
                  className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
