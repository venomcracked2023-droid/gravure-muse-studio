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
    q: typeof s.q === "string" && s.q.trim() ? s.q.trim() : undefined,
    page:
      (typeof s.page === "string" || typeof s.page === "number") && Number(s.page) > 1
        ? Number(s.page)
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
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
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
              GravureHub —{" "}
              <span className="text-gradient-brand">Free vertical-scroll gravure albums</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Discover the best gravure photo albums from Korean, Japanese and Vietnamese models.
              Free to browse, updated continuously.
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

        {/* Rich SEO Content Block (Task 13) */}
        <section className="mt-8 rounded-2xl border border-border/80 bg-card/40 p-6 backdrop-blur sm:p-8">
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Welcome to GravureHub — Free Vertical-Scroll Gravure Photo Library
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            GravureHub is a free, high-definition vertical-scroll gravure photo library featuring
            top Korean, Japanese, and Vietnamese models. We update new albums and photobooks daily
            with crystal-clear image quality and optimized mobile performance. Whether you love
            classic Japanese gravure idols, trendy Korean visual models, or contemporary Vietnamese
            photobooks, our curated collections offer an effortless, distraction-free reading
            experience without watermarks or intrusive interruptions. Browse our featured
            collections above or explore the complete model library below to discover stunning free
            visual sets.
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

        <section id="library" className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{t("section.library")}</h2>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {term
                  ? `${t("section.found")} ${filtered.length} ${t("section.modelsMatching")} "${q}"`
                  : `${t("section.total")} ${comics.length} ${t("section.modelsCount")}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {["Korean", "Japanese", "Vietnamese"].map((tag) => (
                <Link
                  key={tag}
                  to="/genre/$slug"
                  params={{ slug: tag.toLowerCase() }}
                  className="rounded-full border border-border bg-card/60 px-3 py-1 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                >
                  {tag}
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
                {term ? `${t("empty.noResults")} "${q}"` : "Thư viện đang cập nhật album mới"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {term
                  ? "Vui lòng thử tìm kiếm với từ khoá khác hoặc xem các thể loại gợi ý."
                  : "Các bộ ảnh chất lượng cao đang được tuyển chọn và tải lên hàng ngày. Tham gia cộng đồng Telegram để nhận thông báo sớm nhất!"}
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
                  Tham gia Telegram GravureHub
                </a>
                {term && (
                  <Link
                    to="/"
                    search={{}}
                    className="inline-flex items-center rounded-full border border-border bg-background/50 px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary"
                  >
                    Xem tất cả người mẫu
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {paginated.map((c, i) => (
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
                        priority={i < 4}
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
