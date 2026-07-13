import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics } from "@/lib/comics-store";
import { useI18n } from "@/lib/i18n/context";
import { BookOpen, ChevronLeft, ChevronRight, Library, Sparkles, Star } from "lucide-react";
import gravureLogo from "@/assets/gravure-logo.png";
import { SITE_URL } from "@/lib/seo";
import { buildSlugId } from "@/lib/slug";
import { driveImageUrl } from "@/lib/drive";
import { getLatestAlbums } from "@/lib/featured";
import { FeaturedMarquee } from "@/components/FeaturedMarquee";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
    page:
      typeof s.page === "string" || typeof s.page === "number"
        ? Math.max(1, Number(s.page) || 1)
        : undefined,
  }),
  head: () => {
    const title = "GravureHub — Free gravure photo library";
    const desc =
      "Discover the best gravure photo albums from Korean, Japanese and Vietnamese models. Free to browse, updated continuously.";
    const url = `${SITE_URL}/`;
    const img = `${SITE_URL}/og-default.jpg`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: img },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: img },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function Index() {
  const comics = useComics();
  const { t } = useI18n();
  const { q, page: rawPage } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const term = (q ?? "").trim().toLowerCase();
  const filtered = term
    ? comics.filter((c) =>
        [c.title, c.author, ...(c.genres ?? [])].join(" ").toLowerCase().includes(term),
      )
    : comics;
  const page = Math.max(1, Number(rawPage) || 1);
  const PAGE_SIZE = 20; // 4 rows x 5 cols on desktop
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featured = getLatestAlbums(comics, 12);
  const totalChapters = comics.reduce((s, c) => s + c.chapters.length, 0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GravureHub library",
    url: `${SITE_URL}/`,
    numberOfItems: filtered.length,
    itemListElement: filtered.slice(0, 30).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `${SITE_URL}/comic/${buildSlugId(c.title, c.id)}`,
      image: c.coverId ? driveImageUrl(c.coverId, 600) : undefined,
    })),
  };
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-secondary to-card px-6 py-9 sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-pulse-glow" />
          <div
            className="pointer-events-none absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1.5s" }}
          />
          <img
            src={gravureLogo}
            alt=""
            aria-hidden
            width={112}
            height={112}
            fetchPriority="high"
            decoding="async"
            className="pointer-events-none absolute right-6 top-6 hidden h-28 w-28 opacity-90 animate-float-slow md:block"
          />
          <div className="relative max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Gravure — endless vertical scroll
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              GravureHub — <span className="text-gradient-brand">Free vertical-scroll gravure albums</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Discover the best gravure photo albums from Korean, Japanese and Vietnamese models. Free to browse, updated continuously.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#library"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:scale-105 active:scale-95"
              >
                <Library className="h-4 w-4" /> {t("hero.cta.library")}
              </a>
              <Link
                to="/featured"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-5 py-2.5 text-sm backdrop-blur transition hover:border-primary/60 hover:bg-secondary"
              >
                <Star className="h-4 w-4 text-primary" /> {t("hero.cta.featured")}
              </Link>
            </div>
            <dl className="mt-5 grid max-w-md grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-background/40 px-3 py-2 backdrop-blur">
                <dt className="text-xs text-muted-foreground">{t("stats.models")}</dt>
                <dd className="mt-0.5 text-lg font-bold text-foreground tabular-nums">
                  {comics.length}
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-background/40 px-3 py-2 backdrop-blur">
                <dt className="text-xs text-muted-foreground">{t("stats.albums")}</dt>
                <dd className="mt-0.5 text-lg font-bold text-foreground tabular-nums">
                  {totalChapters}
                </dd>
              </div>
              <div className="rounded-xl border border-border bg-background/40 px-3 py-2 backdrop-blur">
                <dt className="text-xs text-muted-foreground">{t("stats.featured")}</dt>
                <dd className="mt-0.5 text-lg font-bold text-primary tabular-nums">
                  {featured.length}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="mt-14 animate-fade-in-up">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                <Star className="h-5 w-5 fill-primary text-primary" /> {t("section.featured")}
              </h2>
              <Link to="/featured" className="text-sm font-medium text-primary">
                {t("section.viewAll")} ({featured.length}) →
              </Link>
            </div>
            <FeaturedMarquee items={featured} />
          </section>
        )}

        <section id="library" className="mt-14 scroll-mt-24">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Library className="h-5 w-5 text-primary" />
              {term ? `${t("section.results")} "${q}"` : t("section.library")}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filtered.length}/{comics.length}
            </span>
          </div>
          {comics.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
              <BookOpen className="h-10 w-10 text-primary/60" />
              <p>{t("empty.noModels")}</p>
              <Link to="/admin" className="text-primary hover:underline">
                {t("empty.goAdmin")}
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
              {t("empty.noResults")} "{q}".
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {paginated.map((c) => (
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
                      <h3 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                        {c.title}
                      </h3>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {c.chapters.length} {t("card.albums")} · {c.author || t("card.anonymous")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <nav role="navigation" aria-label="Pagination" className="mt-8 flex justify-center">
                  <ul className="flex flex-row items-center gap-1">
                    <li>
                      <Link
                        to="/"
                        search={{ q, page: Math.max(1, page - 1) }}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "default" }),
                          "gap-1 pl-2.5",
                          page <= 1 && "pointer-events-none opacity-50",
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" /> Prev
                      </Link>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <li key={p}>
                        <Link
                          to="/"
                          search={{ q, page: p }}
                          aria-current={p === page ? "page" : undefined}
                          className={cn(
                            buttonVariants({
                              variant: p === page ? "outline" : "ghost",
                              size: "icon",
                            }),
                          )}
                        >
                          {p}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        to="/"
                        search={{ q, page: Math.min(totalPages, page + 1) }}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "default" }),
                          "gap-1 pr-2.5",
                          page >= totalPages && "pointer-events-none opacity-50",
                        )}
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </Link>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
