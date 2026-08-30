import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ComicCover } from "@/components/ComicCover";
import {
  useComics,
  useComicsLoaded,
  upsertComic,
  uid,
  type Chapter,
  type Comic,
} from "@/lib/comics-store";
import { driveImageUrl, extractDriveId, parseDriveIds } from "@/lib/drive";
import {
  BookOpen,
  CalendarCheck,
  ChevronRight,
  Layers,
  ShoppingBag,
  User,
  Pencil,
  Home,
  Sparkles,
} from "lucide-react";
import { CommentSection } from "@/components/CommentSection";
import { RatingWidget } from "@/components/RatingWidget";
import {
  SITE_URL,
  DEFAULT_CTA_URL,
  TELEGRAM_GROUP_URL,
  generateModelDescription,
  generateModelMetaDescription,
  getModelCountry,
} from "@/lib/seo";
import { useI18n } from "@/lib/i18n/context";
import { supabase } from "@/integrations/supabase/client";
import { buildSlugId, extractId, isUUID, slugifyGenre } from "@/lib/slug";
import { renderMarkdown } from "@/lib/markdown";
import { useAuth } from "@/lib/auth";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { trackModelView } from "@/lib/analytics";

export const Route = createFileRoute("/comic/$comicId")({
  component: ComicPage,
  loader: async ({ params }) => {
    const rawParam = params.comicId;
    const id = extractId(rawParam);
    let data: {
      id: string;
      title: string;
      author: string | null;
      description: string | null;
      cover_id: string | null;
      genres: string[] | null;
      booking_url: string | null;
      order_url: string | null;
      featured: boolean | null;
      created_at: string;
    } | null = null;

    if (isUUID(id)) {
      const res = await supabase
        .from("comics")
        .select(
          "id,title,author,description,cover_id,genres,booking_url,order_url,featured,created_at",
        )
        .eq("id", id)
        .maybeSingle();
      data = res.data;
    }

    if (!data) {
      const { data: allComics } = await supabase
        .from("comics")
        .select(
          "id,title,author,description,cover_id,genres,booking_url,order_url,featured,created_at",
        );

      const targetSlug = slugifyGenre(rawParam);
      data =
        (allComics ?? []).find((c) => {
          const titleSlug = slugifyGenre(c.title);
          return (
            titleSlug === targetSlug ||
            targetSlug.startsWith(titleSlug) ||
            titleSlug.startsWith(targetSlug) ||
            c.id === id
          );
        }) ?? null;
    }

    if (!data) throw notFound();

    const { data: chapters } = await supabase
      .from("chapters")
      .select("*")
      .eq("comic_id", data.id)
      .order("order_index", { ascending: true });

    const comic: Comic = {
      id: data.id,
      title: data.title,
      author: data.author ?? "",
      description: data.description ?? "",
      coverId: data.cover_id ?? "",
      genres: data.genres ?? [],
      chapters: (chapters ?? []).map((ch) => ({
        id: ch.id,
        title: ch.title,
        pages: ch.pages ?? [],
        createdAt: new Date(ch.created_at).getTime(),
        coverId: ch.cover_id ?? "",
        videoUrl: ch.video_url ?? "",
        isPremium: ch.is_premium ?? false,
        priceUsdt: Number(ch.price_usdt ?? 2),
      })),
      createdAt: new Date(data.created_at).getTime(),
      featured: data.featured ?? false,
      bookingUrl: data.booking_url ?? "",
      orderUrl: data.order_url ?? "",
    };

    return { meta: data, id: data.id, comic, chapterCount: comic.chapters.length };
  },
  head: ({ loaderData, params }) => {
    const m = loaderData?.meta;
    if (!m) {
      const fallbackUrl = `${SITE_URL}/comic/${params.comicId}`;
      return {
        meta: [{ title: "Model Profile — GravureHub" }],
        links: [
          { rel: "canonical", href: fallbackUrl },
          { rel: "alternate", hrefLang: "en", href: fallbackUrl },
          { rel: "alternate", hrefLang: "vi", href: fallbackUrl },
          { rel: "alternate", hrefLang: "ja", href: fallbackUrl },
          { rel: "alternate", hrefLang: "zh", href: fallbackUrl },
          { rel: "alternate", hrefLang: "ko", href: fallbackUrl },
          { rel: "alternate", hrefLang: "x-default", href: fallbackUrl },
        ],
      };
    }

    const count = loaderData?.chapterCount || (loaderData?.comic?.chapters?.length ?? 1);
    const title = `${m.title} — Gravure Albums | GravureHub`;
    const desc = generateModelMetaDescription(m, count);
    const uniqueDescription = generateModelDescription(m, count);
    const img = m.cover_id ? driveImageUrl(m.cover_id, 1200) : `${SITE_URL}/og-default.jpg`;
    const slug = buildSlugId(m.title, loaderData!.id);
    const url = `${SITE_URL}/comic/${slug}`;
    const country = getModelCountry(m);

    const chapters = loaderData?.comic?.chapters ?? [];
    const ldItemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Albums by ${m.title}`,
      url,
      numberOfItems: chapters.length,
      itemListElement: chapters.map((ch, idx) => {
        const chSlug = buildSlugId(ch.title, ch.id);
        const chThumb =
          ch.coverId || (ch.pages[0] ? (extractDriveId(ch.pages[0]) ?? ch.pages[0]) : "");
        return {
          "@type": "ListItem",
          position: idx + 1,
          name: `${ch.title} — ${m.title}`,
          url: `${SITE_URL}/read/${slug}/${chSlug}`,
          image: chThumb ? driveImageUrl(chThumb, 600) : img,
        };
      }),
    };

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: `${m.title} — Gravure Albums | duahaumanga.com` },
        {
          property: "og:description",
          content: `Explore free vertical-scroll gravure photo sets of ${m.title} on GravureHub.`,
        },
        { property: "og:image", content: img },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:url", content: url },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${m.title} — Gravure Albums` },
        {
          name: "twitter:description",
          content: `Explore free vertical-scroll gravure photo sets of ${m.title} on GravureHub.`,
        },
        { name: "twitter:image", content: img },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "vi", href: url },
        { rel: "alternate", hrefLang: "ja", href: url },
        { rel: "alternate", hrefLang: "zh", href: url },
        { rel: "alternate", hrefLang: "ko", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
        ...(m.cover_id
          ? [{ rel: "preload", as: "image", href: driveImageUrl(m.cover_id, 600) }]
          : []),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Model Library",
                item: `${SITE_URL}/#library`,
              },
              { "@type": "ListItem", position: 3, name: m.title, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: m.title,
            description: uniqueDescription,
            url,
            numberOfItems: count,
            mainEntity: {
              "@type": "Person",
              name: m.title,
              nationality: country,
              ...(m.author ? { alternateName: m.author } : {}),
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(ldItemList),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="p-20 text-center">
        <h1 className="text-2xl font-bold">404 - Model Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The model you are looking for does not exist or has been removed.
        </p>
        <Link to="/" className="mt-4 inline-block text-primary underline">
          Back to Home
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-destructive">{error.message}</div>
  ),
});

function ComicPage() {
  const { comicId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const comics = useComics();
  const loaded = useComicsLoaded();
  const realId = extractId(comicId);

  const comic: Comic | undefined =
    comics.find(
      (c) =>
        c.id === loaderData?.id ||
        c.id === realId ||
        slugifyGenre(c.title) === slugifyGenre(comicId),
    ) ?? loaderData?.comic;

  const { isAdmin } = useAuth();
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);

  if (!comic) {
    if (!loaded)
      return (
        <div className="min-h-screen">
          <SiteHeader />
          <div className="p-20 text-center text-muted-foreground">Loading…</div>
        </div>
      );
    throw notFound();
  }

  const relatedModels = useMemo(() => {
    if (!comic) return [];
    const others = comics.filter((c) => c.id !== comic.id);
    const genreSet = new Set(comic.genres);
    const scored = others.map((c) => {
      const common = (c.genres || []).filter((g) => genreSet.has(g)).length;
      return { comic: c, score: common };
    });
    scored.sort((a, b) => b.score - a.score || b.comic.createdAt - a.comic.createdAt);
    return scored.slice(0, 4).map((s) => s.comic);
  }, [comics, comic]);

  const uniqueDescription = generateModelDescription(comic, comic.chapters.length);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="relative isolate overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-10 scale-110 opacity-30 blur-2xl"
          style={{
            backgroundImage: `url(${driveImageUrl(comic.coverId, 800)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-background/80 backdrop-blur-md" />

        <div className="mx-auto max-w-5xl px-4 pt-4">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="inline-flex items-center gap-1 transition hover:text-foreground">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <Link to="/" hash="library" className="transition hover:text-foreground">
              Library
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-border" />
            <span className="truncate font-medium text-foreground">{comic.title}</span>
          </nav>
        </div>

        <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          {isAdmin && (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur hover:bg-secondary"
              >
                <Pencil className="h-3.5 w-3.5" /> {editing ? "Close Editor" : "Edit Profile"}
              </button>
            </div>
          )}
          {isAdmin && editing ? (
            <EditProfile comic={comic} onDone={() => setEditing(false)} />
          ) : (
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              <div className="hover-lift mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl border border-primary/30 bg-card shadow-glow">
                <ComicCover
                  id={comic.coverId}
                  title={comic.title}
                  alt={`Gravure model ${comic.title} — profile photo`}
                />
              </div>
              <div className="animate-fade-in-up">
                <div className="flex flex-wrap gap-2">
                  {comic.genres.map((g) => (
                    <Link
                      key={g}
                      to="/genre/$slug"
                      params={{ slug: g }}
                      className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
                <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                  {comic.title}
                </h1>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
                  <User className="h-3.5 w-3.5" /> {comic.author || "Gravure Model"}
                  <span className="mx-1 text-border">·</span>
                  {comic.chapters.length > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> {comic.chapters.length}{" "}
                      {comic.chapters.length === 1 ? "album" : "albums"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
                      <Sparkles className="h-3 w-3" /> {t("card.comingSoon")}
                    </span>
                  )}
                </p>

                <div className="mt-4 rounded-2xl border border-primary/20 bg-card/60 p-4 text-sm leading-relaxed text-foreground/90 shadow-sm backdrop-blur">
                  <p className="whitespace-pre-line">{uniqueDescription}</p>
                </div>

                <div className="mt-4">
                  <RatingWidget comicId={comic.id} />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={comic.bookingUrl || DEFAULT_CTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20"
                  >
                    <CalendarCheck className="h-4 w-4" /> Booking
                  </a>
                  <a
                    href={comic.orderUrl || DEFAULT_CTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/20"
                  >
                    <ShoppingBag className="h-4 w-4" /> Order New Album
                  </a>
                </div>
                {comic.chapters.length > 0 && (
                  <Link
                    to="/read/$comicId/$chapterId"
                    params={{
                      comicId: buildSlugId(comic.title, comic.id),
                      chapterId: buildSlugId(comic.chapters[0].title, comic.chapters[0].id),
                    }}
                    className="group mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-105 active:scale-95"
                  >
                    Read First Album{" "}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Album Collection ({comic.chapters.length})
            </h2>
            {isAdmin && <QuickAddChapter comic={comic} />}
          </div>

          {comic.chapters.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-amber-500/40 bg-gradient-to-b from-amber-500/5 via-card/50 to-card/70 p-8 sm:p-12 text-center backdrop-blur shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500 shadow-glow">
                  <Sparkles className="h-7 w-7 animate-pulse-glow" />
                </div>
                <span className="mt-4 inline-block rounded-full border border-amber-500/30 bg-amber-500/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-500">
                  {t("card.comingSoon")}
                </span>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {t("model.comingSoonTitle")}
                </h3>
                <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {t("model.comingSoonDesc")}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={TELEGRAM_GROUP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#29A9EA] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#29A9EA]/30 transition hover:scale-105"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M21.6 4.8c-.5-.4-1.1-.4-1.6-.2L2.8 11.3c-.9.3-1.1 1.1-.5 1.6l3.4 2.6 2.3 7.1c.2.6.8.9 1.4.5l3-2.3 3.8 3.1c.6.5 1.5.3 1.8-.5l4.5-13.2c.3-.9-.2-1.5-1.1-1.8-.1-.1-.2-.1-.3-.1-.2-.1-.3-.2-.5-.3zM9.8 17.2l.6-4.1 6.5-5.8-8.5 7.5 1.4 2.4z" />
                    </svg>
                    {t("model.notifyTelegram")}
                  </a>
                  <Link
                    to="/"
                    hash="library"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-xs font-semibold text-foreground backdrop-blur transition hover:border-primary/60 hover:bg-secondary"
                  >
                    Explore Other Models →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur">
              {comic.chapters.map((ch, i) => (
                <li key={ch.id} className="group">
                  <Link
                    to="/read/$comicId/$chapterId"
                    params={{
                      comicId: buildSlugId(comic.title, comic.id),
                      chapterId: buildSlugId(ch.title, ch.id),
                    }}
                    className="relative flex items-center justify-between gap-3 px-5 py-6 transition hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-muted-foreground tabular-nums group-hover:border-primary group-hover:bg-gradient-brand group-hover:text-primary-foreground">
                        {i + 1}
                      </span>
                      {(() => {
                        const thumb =
                          ch.coverId ||
                          (ch.pages[0] ? (extractDriveId(ch.pages[0]) ?? ch.pages[0]) : "");
                        return thumb ? (
                          <img
                            src={driveImageUrl(thumb, 400)}
                            alt={`Album ${i + 1}: ${ch.title} — ${comic.title} gravure photos`}
                            loading="lazy"
                            width={144}
                            height={144}
                            className="h-36 w-36 shrink-0 rounded-xl border border-border object-cover"
                          />
                        ) : (
                          <div className="h-36 w-36 shrink-0 rounded-xl border border-dashed border-border bg-secondary/40" />
                        );
                      })()}
                      <span className="flex items-center gap-2 text-lg font-semibold tracking-tight group-hover:text-primary">
                        {ch.title}
                        {ch.isPremium && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                            ★ {ch.priceUsdt ?? 2} USDT
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{ch.pages.length} photos</span>
                      <ChevronRight className="h-4 w-4 group-hover:text-primary" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {relatedModels.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">You might also like</h2>
              <Link
                to="/"
                hash="library"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                View all models →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {relatedModels.map((rm) => (
                <Link
                  key={rm.id}
                  to="/comic/$comicId"
                  params={{ comicId: buildSlugId(rm.title, rm.id) }}
                  className="group flex flex-col gap-2"
                >
                  <div className="hover-lift relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card group-hover:border-primary/60">
                    <ComicCover
                      id={rm.coverId}
                      title={rm.title}
                      alt={`Gravure model ${rm.title} — profile photo`}
                      className="transition duration-500 group-hover:scale-110"
                    />
                    {rm.chapters.length === 0 && (
                      <span className="absolute bottom-2 left-2 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur">
                        {t("card.comingSoon")}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                      {rm.title}
                    </h3>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {rm.chapters.length > 0 ? (
                        `${rm.chapters.length} albums`
                      ) : (
                        <span className="font-semibold text-amber-500">{t("card.comingSoon")}</span>
                      )}
                      {" · "}
                      {rm.author || "Gravure"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12">
          <CommentSection comicId={comic.id} />
        </div>
      </main>
    </div>
  );
}

function EditProfile({ comic, onDone }: { comic: Comic; onDone: () => void }) {
  const [title, setTitle] = useState(comic.title);
  const [author, setAuthor] = useState(comic.author);
  const [description, setDescription] = useState(comic.description);
  const [coverId, setCoverId] = useState(comic.coverId);
  const [genres, setGenres] = useState(comic.genres.join(", "));
  const [bookingUrl, setBookingUrl] = useState(comic.bookingUrl ?? "");
  const [orderUrl, setOrderUrl] = useState(comic.orderUrl ?? "");
  const [featured, setFeatured] = useState(comic.featured);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim()) return toast.error("Please enter a name");
    setSaving(true);
    try {
      await upsertComic({
        ...comic,
        title: title.trim(),
        author: author.trim(),
        description,
        coverId: coverId ? (extractDriveId(coverId) ?? coverId) : "",
        genres: genres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
        bookingUrl: bookingUrl.trim(),
        orderUrl: orderUrl.trim(),
        featured,
      });
      toast.success("Profile saved successfully");
      onDone();
    } catch (e: any) {
      toast.error(e.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring";

  return (
    <div className="rounded-2xl border border-primary/40 bg-card/70 p-5 backdrop-blur">
      <h2 className="mb-4 text-lg font-bold text-primary">Edit Model Profile</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-xs font-medium text-muted-foreground">
          Name
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass + " mt-1"}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          Author / Stage Name
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={inputClass + " mt-1"}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground md:col-span-2">
          Cover Image (File ID / Drive Link)
          <input
            value={coverId}
            onChange={(e) => setCoverId(e.target.value)}
            className={inputClass + " mt-1 font-mono text-xs"}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground md:col-span-2">
          Genres (comma-separated)
          <input
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className={inputClass + " mt-1"}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          Booking URL
          <input
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
            className={inputClass + " mt-1 text-xs"}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          Order URL
          <input
            value={orderUrl}
            onChange={(e) => setOrderUrl(e.target.value)}
            className={inputClass + " mt-1 text-xs"}
          />
        </label>
        <label className="text-xs font-medium text-muted-foreground md:col-span-2">
          Description (Markdown)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className={inputClass + " mt-1"}
          />
        </label>
        <label className="inline-flex items-center gap-2 text-xs font-medium md:col-span-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />{" "}
          Featured
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onDone}
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

function QuickAddChapter({ comic }: { comic: ReturnType<typeof useComics>[number] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(`Album ${comic.chapters.length + 1}`);
  const [pagesText, setPagesText] = useState("");
  const [coverId, setCoverId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    const pages = parseDriveIds(pagesText);
    if (!title.trim()) return toast.error("Please enter an album title");
    if (!pages.length && !videoUrl.trim())
      return toast.error("Requires at least 1 image or 1 video");
    setSaving(true);
    try {
      const ch: Chapter = {
        id: uid(),
        title: title.trim(),
        pages,
        coverId: coverId ? (extractDriveId(coverId) ?? coverId) : "",
        videoUrl: videoUrl.trim(),
        createdAt: Date.now(),
      };
      await upsertComic({ ...comic, chapters: [...comic.chapters, ch] });
      toast.success("Album added successfully");
      setOpen(false);
      setTitle(`Album ${comic.chapters.length + 2}`);
      setPagesText("");
      setCoverId("");
      setVideoUrl("");
    } catch (e: any) {
      toast.error(e.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-input px-3 py-2 text-sm outline-none focus:border-ring";

  if (!open) {
    return (
      <div className="mb-4">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Quick Add Album
        </button>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-2xl border border-primary/40 bg-background/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary">Quick Add Album (Admin)</h3>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
      <div className="grid gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Album Title"
          className={inputClass}
        />
        <textarea
          value={pagesText}
          onChange={(e) => setPagesText(e.target.value)}
          rows={5}
          placeholder="One File ID or Drive link per line"
          className={inputClass + " font-mono text-xs"}
        />
        <input
          value={coverId}
          onChange={(e) => setCoverId(e.target.value)}
          placeholder="Cover Image (optional)"
          className={inputClass + " text-xs"}
        />
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Embed Video URL (optional)"
          className={inputClass + " text-xs"}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40 hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> {saving ? "Saving…" : "Save Album"}
          </button>
        </div>
      </div>
    </div>
  );
}
