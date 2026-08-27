import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import { useComics, fetchComicsData, type Comic } from "@/lib/comics-store";
import { useI18n } from "@/lib/i18n/context";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Flame,
  Library,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import gravureLogo from "@/assets/gravure-logo.png";
import { SITE_NAME, SITE_URL, SITE_BRAND_FULL } from "@/lib/seo";
import { buildSlugId } from "@/lib/slug";
import { driveImageUrl } from "@/lib/drive";
import { getLatestAlbums } from "@/lib/featured";
import { FeaturedMarquee } from "@/components/FeaturedMarquee";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async () => {
    const comics = await fetchComicsData();
    return { comics };
  },
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" && s.q.trim() ? s.q.trim() : undefined,
    page:
      (typeof s.page === "string" || typeof s.page === "number") && Number(s.page) > 1
        ? Number(s.page)
        : undefined,
  }),
  head: () => {
    const title = "GravureHub — Free Vertical-Scroll Gravure Photo Library";
    const desc =
      "Discover HD vertical-scroll gravure photobooks from Korean, Japanese, and Asian models on GravureHub (duahaumanga.com). Free, updated daily.";
    const url = `${SITE_URL}/`;
    const img = `${SITE_URL}/og-default.jpg`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", url },
        { property: "og:type", content: "website" },
        { property: "og:image", content: img },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: img },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "vi", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
    };
  },
  component: Index,
});

function Index() {
  const loaderData = Route.useLoaderData();
  const comics = useComics(loaderData?.comics);
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
  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Model Library", item: `${SITE_URL}/#library` },
    ],
  };

  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "GravureHub Library",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }} />
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
            alt="GravureHub Logo"
            aria-hidden
            width={112}
            height={112}
            fetchPriority="high"
            decoding="async"
            className="pointer-events-none absolute right-6 top-6 hidden h-28 w-28 opacity-90 animate-float-slow md:block"
          />
          <div className="relative max-w-2xl animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> duahaumanga.com — Vertical-scroll gravure library
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              GravureHub —{" "}
              <span className="text-gradient-brand">Vertical-Scroll Gravure Photo Library</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Explore fine-art gravure albums and photobooks featuring Japanese, Korean, and Asian
              models. Enjoy an uninterrupted, smooth vertical-scrolling experience on mobile and desktop.
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
              <Link
                to="/latest"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-5 py-2.5 text-sm backdrop-blur transition hover:border-primary/60 hover:bg-secondary"
              >
                <Clock className="h-4 w-4 text-primary" /> Latest Updates
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

        {/* Quick Portal Navigation */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            to="/featured"
            className="group flex items-center gap-3 rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur transition hover:border-primary/60 hover:bg-card/70"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-brand group-hover:text-primary-foreground transition">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-foreground group-hover:text-primary">
                Featured Albums
              </div>
              <div className="text-xs text-muted-foreground truncate">{featured.length} curated albums</div>
            </div>
          </Link>

          <Link
            to="/latest"
            className="group flex items-center gap-3 rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur transition hover:border-primary/60 hover:bg-card/70"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-brand group-hover:text-primary-foreground transition">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-foreground group-hover:text-primary">
                Latest Updates
              </div>
              <div className="text-xs text-muted-foreground truncate">Daily updated photo sets</div>
            </div>
          </Link>

          <Link
            to="/genre/$slug"
            params={{ slug: "japanese" }}
            className="group flex items-center gap-3 rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur transition hover:border-primary/60 hover:bg-card/70"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-brand group-hover:text-primary-foreground transition">
              <Tag className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-foreground group-hover:text-primary">
                Japanese Idols
              </div>
              <div className="text-xs text-muted-foreground truncate">Classic gravure photobooks</div>
            </div>
          </Link>

          <Link
            to="/pricing"
            className="group flex items-center gap-3 rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur transition hover:border-primary/60 hover:bg-card/70"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-brand group-hover:text-primary-foreground transition">
              <Flame className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-foreground group-hover:text-primary">
                VIP Access
              </div>
              <div className="text-xs text-muted-foreground truncate">Unlock exclusive albums</div>
            </div>
          </Link>
        </section>

        {/* Rich SEO Content Block */}
        <section className="mt-8 rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Welcome to GravureHub (duahaumanga.com) — Vertical-Scroll Gravure Photo Library
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <strong>GravureHub</strong> (hosted at <strong>duahaumanga.com</strong>) is an online platform
            dedicated to curating high-definition gravure albums, fashion portraits, and artistic model
            photobooks from top Japanese, Korean, and Asian models. With our seamless vertical-scroll
            reading interface, you can effortlessly browse each vibrant photo set without distracting
            intrusions.
          </p>
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

        {/* Blog & Editorial Articles Spotlight */}
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <FileText className="h-5 w-5 text-primary" /> Guides &amp; Featured Articles
            </h2>
            <Link to="/about" className="text-sm font-medium text-primary hover:underline">
              About Us →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/blog/gravure-idol-la-gi"
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur transition hover:border-primary/60 hover:bg-card/70"
            >
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Gravure Culture
                </span>
                <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  What is a Gravure Idol? Artistic Charm &amp; Japanese Photobook Culture
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Discover the origins, historical evolution, and aesthetic allure of gravure idol photography from Japan to modern digital formats.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center text-xs font-medium text-primary">
                Read article →
              </span>
            </Link>

            <Link
              to="/blog/top-10-gravure-idols-2024"
              className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur transition hover:border-primary/60 hover:bg-card/70"
            >
              <div>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Rankings
                </span>
                <h3 className="mt-3 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  Top 10 Most Popular Japanese Gravure Idols in 2024
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  A curated list of the most celebrated gravure models across Asia with stunning visual charisma and bestselling photobooks.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center text-xs font-medium text-primary">
                Read article →
              </span>
            </Link>
          </div>
        </section>

        <section id="library" className="mt-14 scroll-mt-20">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Library className="h-4 w-4" />
                </span>
                <h2 className="text-2xl font-bold tracking-tight">{t("section.library")}</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {term
                  ? `${t("section.found")} ${filtered.length} ${t("section.modelsMatching")} "${q}"`
                  : `${t("section.total")} ${comics.length} ${t("section.modelsCount")} — Browse by model and explore HD photobooks`}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <Link
                to="/"
                search={{}}
                className={cn(
                  "rounded-full border px-3 py-1.5 font-medium transition",
                  !term ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card/60 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                )}
              >
                All
              </Link>
              {[
                { tag: "Japanese", label: "Japanese", slug: "japanese" },
                { tag: "Korean", label: "Korean", slug: "korean" },
                { tag: "Vietnamese", label: "Vietnamese", slug: "vietnamese" },
                { tag: "Bikini", label: "Bikini", slug: "bikini" },
                { tag: "Cosplay", label: "Cosplay", slug: "cosplay" },
              ].map(({ label, slug }) => (
                <Link
                  key={slug}
                  to="/genre/$slug"
                  params={{ slug }}
                  className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-muted-foreground hover:border-primary/60 hover:text-foreground transition"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {term && filtered.length > 0 ? (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs">
              <span>
                {t("section.showingResults")} <strong>"{q}"</strong> ({filtered.length})
              </span>
              <Link to="/" search={{}} className="font-medium text-primary hover:underline">
                {t("search.clear")}
              </Link>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center backdrop-blur">
              <Sparkles className="mx-auto h-8 w-8 text-primary/80 animate-pulse-glow" />
              <h3 className="mt-3 text-lg font-bold text-foreground">
                {term ? `${t("empty.noResults")} "${q}"` : "Library is updating with new albums"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {term
                  ? "Please try searching with different keywords or explore suggested categories."
                  : "High-definition photo sets are curated and uploaded regularly. Join our Telegram community for the latest updates!"}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://t.me/+8xnMvFtjulkyNzE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#29A9EA] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-[#29A9EA]/30 transition hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M21.6 4.8c-.5-.4-1.1-.4-1.6-.2L2.8 11.3c-.9.3-1.1 1.1-.5 1.6l3.4 2.6 2.3 7.1c.2.6.8.9 1.4.5l3-2.3 3.8 3.1c.6.5 1.5.3 1.8-.5l4.5-13.2c.3-.9-.2-1.5-1.1-1.8-.1-.1-.2-.1-.3-.1-.2-.1-.3-.2-.5-.3zM9.8 17.2l.6-4.1 6.5-5.8-8.5 7.5 1.4 2.4z" />
                  </svg>
                  Join GravureHub Telegram
                </a>
                {term && (
                  <Link
                    to="/"
                    search={{}}
                    className="inline-flex items-center rounded-full border border-border bg-background/50 px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary"
                  >
                    View all models
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {paginated.map((c, i) => {
                  const firstChapter = c.chapters[0];
                  const comicSlug = buildSlugId(c.title, c.id);
                  const firstChapterSlug = firstChapter ? buildSlugId(firstChapter.title, firstChapter.id) : "";
                  return (
                    <div
                      key={c.id}
                      className="card-grid-item group flex flex-col justify-between rounded-xl border border-border bg-card/50 p-2.5 transition hover:border-primary/60 hover:bg-card/90"
                    >
                      <Link
                        to="/comic/$comicId"
                        params={{ comicId: comicSlug }}
                        preload="intent"
                        className="flex flex-col gap-2"
                      >
                        <div className="hover-lift relative aspect-[3/4] overflow-hidden rounded-lg border border-border/80 bg-background/60">
                          <ComicCover
                            id={c.coverId}
                            title={c.title}
                            priority={i < 4}
                            className="transition duration-500 group-hover:scale-105"
                          />
                          <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                            {c.chapters.length} {t("card.albums")}
                          </span>
                        </div>
                        <div>
                          <h3 className="line-clamp-1 text-sm font-semibold group-hover:text-primary transition-colors">
                            {c.title}
                          </h3>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {c.author || t("card.anonymous")}
                          </p>
                        </div>
                      </Link>
                      {firstChapter && (
                        <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
                          <Link
                            to="/read/$comicId/$chapterId"
                            params={{ comicId: comicSlug, chapterId: firstChapterSlug }}
                            preload="intent"
                            className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
                          >
                            Read album 1 →
                          </Link>
                          <Link
                            to="/comic/$comicId"
                            params={{ comicId: comicSlug }}
                            preload="intent"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Profile
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {totalPages > 1 && (
                <nav role="navigation" aria-label="Pagination" className="mt-8 flex justify-center">
                  <ul className="flex flex-row items-center gap-1">
                    <li>
                      <Link
                        to="/"
                        search={{ q, page: page - 1 > 1 ? page - 1 : undefined }}
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
                          search={{ q, page: p > 1 ? p : undefined }}
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
                        search={{
                          q,
                          page:
                            Math.min(totalPages, page + 1) > 1
                              ? Math.min(totalPages, page + 1)
                              : undefined,
                        }}
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
