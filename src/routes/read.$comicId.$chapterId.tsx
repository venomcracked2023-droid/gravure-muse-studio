import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useComics, useComicsLoaded } from "@/lib/comics-store";
import { driveImageUrl, extractDriveId } from "@/lib/drive";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  List,
  Home,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { PdfReader } from "@/components/PdfReader";
import { supabase } from "@/integrations/supabase/client";
import { CommentSection } from "@/components/CommentSection";
import { SITE_URL } from "@/lib/seo";
import { parseEmbed } from "@/lib/embed";
import { buildSlugId, extractId, isUUID, slugifyGenre } from "@/lib/slug";
import { PremiumGate } from "@/components/PremiumGate";
import { trackAlbumOpen } from "@/lib/analytics";
import { useI18n } from "@/lib/i18n/context";

export const Route = createFileRoute("/read/$comicId/$chapterId")({
  component: Reader,
  loader: async ({ params }) => {
    const rawComic = params.comicId;
    const rawChapter = params.chapterId;
    const comicId = extractId(rawComic);
    const chapterId = extractId(rawChapter);

    let comicData: { id: string; title: string; cover_id: string | null } | null = null;
    if (isUUID(comicId)) {
      const res = await supabase
        .from("comics")
        .select("id,title,cover_id")
        .eq("id", comicId)
        .maybeSingle();
      comicData = res.data;
    }
    if (!comicData) {
      const { data: allComics } = await supabase.from("comics").select("id,title,cover_id");
      const targetSlug = slugifyGenre(rawComic);
      comicData =
        (allComics ?? []).find((c) => {
          const s = slugifyGenre(c.title);
          return (
            s === targetSlug ||
            targetSlug.startsWith(s) ||
            s.startsWith(targetSlug) ||
            c.id === comicId
          );
        }) ?? null;
    }

    let chapterData: {
      id: string;
      title: string;
      pages: string[];
      video_url: string;
      cover_id: string;
      created_at: string;
      comic_id: string;
    } | null = null;
    if (isUUID(chapterId)) {
      const res = await supabase
        .from("chapters")
        .select("id,title,pages,video_url,cover_id,created_at,comic_id")
        .eq("id", chapterId)
        .maybeSingle();
      chapterData = res.data;
    }
    if (!chapterData && comicData) {
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id,title,pages,video_url,cover_id,created_at,comic_id")
        .eq("comic_id", comicData.id);

      const targetSlug = slugifyGenre(rawChapter);
      chapterData =
        (chapters ?? []).find((ch) => {
          const s = slugifyGenre(ch.title);
          return (
            s === targetSlug ||
            targetSlug.startsWith(s) ||
            s.startsWith(targetSlug) ||
            ch.id === chapterId
          );
        }) ?? null;
    }

    if (!comicData || !chapterData) throw notFound();

    return {
      comicTitle: comicData.title,
      coverId: comicData.cover_id ?? null,
      comicId: comicData.id,
      chapterTitle: chapterData.title,
      chapterVideoUrl: chapterData.video_url ?? null,
      chapterCoverId: chapterData.cover_id ?? null,
      chapterPages: chapterData.pages ?? [],
      chapterCreatedAt: chapterData.created_at ?? null,
      chapterId: chapterData.id,
    };
  },
  head: ({ loaderData }) => {
    const ct = loaderData?.comicTitle,
      ch = loaderData?.chapterTitle,
      coverId = loaderData?.coverId;
    if (!ct || !ch) return { meta: [{ title: "Reading Album — GravureHub" }] };

    const title = `${ch} — ${ct} | GravureHub`;
    const comicSlug = buildSlugId(ct, loaderData!.comicId);
    const chapterSlug = buildSlugId(ch, loaderData!.chapterId);
    const url = `${SITE_URL}/read/${comicSlug}/${chapterSlug}`;
    const desc = `View album "${ch}" by ${ct} on GravureHub — smooth vertical-scroll, high-definition photobooks.`;

    const firstPage = loaderData?.chapterPages?.[0]
      ? (extractDriveId(loaderData.chapterPages[0]) ?? loaderData.chapterPages[0])
      : "";
    const coverFileId = loaderData?.chapterCoverId || firstPage || coverId;
    const img = coverFileId ? driveImageUrl(coverFileId, 1200) : `${SITE_URL}/og-default.jpg`;

    const videoUrl = loaderData?.chapterVideoUrl ? parseEmbed(loaderData.chapterVideoUrl) : null;
    const uploadDate = loaderData?.chapterCreatedAt
      ? new Date(loaderData.chapterCreatedAt).toISOString()
      : new Date().toISOString();

    const imageList: string[] = (loaderData?.chapterPages ?? [])
      .slice(0, 10)
      .map((p) => {
        const fid = extractDriveId(p) ?? p;
        return fid ? driveImageUrl(fid, 1200) : "";
      })
      .filter(Boolean);

    if (imageList.length === 0 && img) {
      imageList.push(img);
    }

    const ldBreadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Models", item: `${SITE_URL}/#library` },
        { "@type": "ListItem", position: 3, name: ct, item: `${SITE_URL}/comic/${comicSlug}` },
        { "@type": "ListItem", position: 4, name: ch, item: url },
      ],
    };

    const ldImageGallery = {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: `${ch} — ${ct}`,
      description: desc,
      url,
      author: {
        "@type": "Person",
        name: ct,
      },
      image: imageList,
    };

    const ldArticle = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${ch} — ${ct}`,
      description: desc,
      image: imageList,
      datePublished: uploadDate,
      dateModified: uploadDate,
      mainEntityOfPage: url,
      author: {
        "@type": "Person",
        name: ct,
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    };

    const scripts: Array<{ type: string; children: string }> = [
      { type: "application/ld+json", children: JSON.stringify(ldBreadcrumb) },
      { type: "application/ld+json", children: JSON.stringify(ldImageGallery) },
      { type: "application/ld+json", children: JSON.stringify(ldArticle) },
    ];

    if (videoUrl) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: `${ch} — ${ct}`,
          description: desc,
          thumbnailUrl: [videoUrl.kind === "video" ? videoUrl.poster || img : img],
          uploadDate,
          ...(videoUrl.kind === "video"
            ? { contentUrl: videoUrl.url }
            : { embedUrl: videoUrl.url }),
        }),
      });
    }

    const meta = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: `${ch} — ${ct} | GravureHub` },
      { property: "og:description", content: desc },
      { property: "og:image", content: img },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: url },
      { property: "og:type", content: videoUrl ? "video.other" : "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${ch} — ${ct}` },
      { name: "twitter:description", content: desc },
      { name: "twitter:image", content: img },
    ];

    const preloadImg = loaderData?.chapterCoverId || loaderData?.chapterPages?.[0];

    return {
      meta,
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "vi", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
        ...(preloadImg
          ? [{ rel: "preload", as: "image", href: driveImageUrl(preloadImg, 600) }]
          : []),
      ],
      scripts,
    };
  },
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h1 className="text-xl font-bold">Album Not Found</h1>
      <p className="mt-2 text-sm text-muted-foreground">The requested album could not be found or has been moved.</p>
      <Link to="/" className="mt-4 inline-block text-primary underline">
        Back to Home
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-destructive">{error.message}</div>,
});

function Reader() {
  const { comicId, chapterId } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const navigate = useNavigate();
  const comics = useComics();
  const loaded = useComicsLoaded();
  const { t } = useI18n();

  const realComicId = loaderData?.comicId || extractId(comicId);
  const realChapterId = loaderData?.chapterId || extractId(chapterId);

  const comic =
    comics.find((c) => c.id === realComicId || slugifyGenre(c.title) === slugifyGenre(comicId)) ??
    (loaderData
      ? {
          id: loaderData.comicId,
          title: loaderData.comicTitle ?? "",
          author: "",
          description: "",
          coverId: loaderData.coverId ?? "",
          genres: [],
          chapters: [
            {
              id: loaderData.chapterId,
              title: loaderData.chapterTitle ?? "",
              pages: loaderData.chapterPages ?? [],
              createdAt: Date.now(),
              coverId: loaderData.chapterCoverId ?? "",
              videoUrl: loaderData.chapterVideoUrl ?? "",
            },
          ],
          createdAt: Date.now(),
          featured: false,
        }
      : undefined);

  const idx = comic?.chapters.findIndex((c) => c.id === realChapterId) ?? -1;
  const chapter = comic && idx >= 0 ? comic.chapters[idx] : (comic?.chapters[0] ?? null);

  const [hideUI, setHideUI] = useState(false);
  const [pdfFailed, setPdfFailed] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHideUI(y > 200 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPdfFailed(false);
  }, [chapterId]);

  if (!comic || !chapter) {
    if (!loaded && !loaderData)
      return <div className="p-10 text-center text-muted-foreground">Loading…</div>;
    throw notFound();
  }

  const prev = idx > 0 ? comic.chapters[idx - 1] : null;
  const next = idx >= 0 && idx < comic.chapters.length - 1 ? comic.chapters[idx + 1] : null;
  const first = comic.chapters[0];
  const last = comic.chapters[comic.chapters.length - 1];
  const total = comic.chapters.length;
  const progress = total > 0 ? (((idx >= 0 ? idx : 0) + 1) / total) * 100 : 0;

  const singleId =
    chapter.pages.length === 1 ? (extractDriveId(chapter.pages[0]) ?? chapter.pages[0]) : null;
  const embed = chapter.videoUrl ? parseEmbed(chapter.videoUrl) : null;
  const isPremium = chapter.isPremium ?? false;
  const priceUsdt = chapter.priceUsdt ?? 2;
  const locked = isPremium && !unlocked;

  const goToChapter = (id: string) => {
    const ch = comic.chapters.find((c) => c.id === id);
    navigate({
      to: "/read/$comicId/$chapterId",
      params: {
        comicId: buildSlugId(comic.title, comic.id),
        chapterId: buildSlugId(ch?.title ?? "", id),
      },
    });
  };

  useEffect(() => {
    if (comic?.title && chapter?.title) {
      trackAlbumOpen(comic.title, chapter.title);
    }
  }, [comic?.title, chapter?.title]);

  const otherChapters = comic.chapters.filter((c) => c.id !== chapter.id).slice(0, 4);
  const featuredOthers = comics
    .filter((c) => c.id !== comic.id && c.chapters.length > 0)
    .slice(0, 3);

  const Footer = () => (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-6">
        <Link
          to="/comic/$comicId"
          params={{ comicId: buildSlugId(comic.title, comic.id) }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur transition hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("reader.backToProfile").replace("{name}", comic.title)}
        </Link>
        <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
          {t("reader.exploreAll")}
        </Link>
      </div>

      {otherChapters.length > 0 && (
        <section className="mt-8">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {t("reader.otherAlbums").replace("{name}", comic.title)}
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {otherChapters.map((ch) => {
              const thumb =
                ch.coverId || (ch.pages[0] ? (extractDriveId(ch.pages[0]) ?? ch.pages[0]) : "");
              return (
                <Link
                  key={ch.id}
                  to="/read/$comicId/$chapterId"
                  params={{
                    comicId: buildSlugId(comic.title, comic.id),
                    chapterId: buildSlugId(ch.title, ch.id),
                  }}
                  className="group flex flex-col gap-1.5 rounded-xl border border-border/60 bg-card/40 p-2 transition hover:border-primary/60 hover:bg-card"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary/40">
                    {thumb && (
                      <img
                        src={driveImageUrl(thumb, 300)}
                        alt={`Album: ${ch.title} — ${comic.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    )}
                  </div>
                  <span className="line-clamp-1 text-xs font-medium text-foreground group-hover:text-primary">
                    {ch.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {ch.pages.length} {t("reader.photos")}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {featuredOthers.length > 0 && (
        <section className="mt-8">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{t("reader.featuredModels")}</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {featuredOthers.map((om) => (
              <Link
                key={om.id}
                to="/comic/$comicId"
                params={{ comicId: buildSlugId(om.title, om.id) }}
                className="group flex flex-col gap-1.5 rounded-xl border border-border/60 bg-card/40 p-2 transition hover:border-primary/60 hover:bg-card"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary/40">
                  {om.coverId && (
                    <img
                      src={driveImageUrl(om.coverId, 300)}
                      alt={`Gravure model ${om.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                </div>
                <span className="line-clamp-1 text-xs font-medium text-foreground group-hover:text-primary">
                  {om.title}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {om.chapters.length} {t("card.albums")}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        <CommentSection comicId={comic.id} chapterId={chapter.id} />
      </div>
    </div>
  );

  const BreadcrumbNav = () => (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-3xl px-4 pt-16 pb-2 flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
        <Home className="h-3 w-3" /> Home
      </Link>
      <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
      <Link to="/" hash="library" className="hover:text-primary transition-colors">
        Models
      </Link>
      <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
      <Link
        to="/comic/$comicId"
        params={{ comicId: buildSlugId(comic.title, comic.id) }}
        className="hover:text-primary transition-colors line-clamp-1 max-w-[150px]"
      >
        {comic.title}
      </Link>
      <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
      <span className="font-semibold text-foreground line-clamp-1 max-w-[200px]">
        {chapter.title}
      </span>
    </nav>
  );

  const VideoEmbed = () =>
    embed ? (
      <div className="mx-auto max-w-3xl px-2 pt-2 sm:px-4">
        <div className="overflow-hidden rounded-2xl border border-primary/30 bg-black shadow-glow">
          <div className="relative aspect-video">
            {embed.kind === "iframe" ? (
              <iframe
                src={embed.url}
                title={chapter.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <video
                src={embed.url}
                poster={embed.poster}
                controls
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full bg-black"
              />
            )}
          </div>
        </div>
      </div>
    ) : null;

  const StickyNav = () => (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="h-1 w-full bg-secondary">
        <div
          className="h-full bg-gradient-brand transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-3 py-2 sm:px-4">
        <span className="hidden shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary sm:inline-flex">
          {(idx >= 0 ? idx : 0) + 1}/{total}
        </span>
        <button
          disabled={!prev}
          onClick={() => first && goToChapter(first.id)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary disabled:opacity-30"
          aria-label="First"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          disabled={!prev}
          onClick={() => prev && goToChapter(prev.id)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm hover:bg-secondary disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:inline">Previous</span>
        </button>
        <div className="relative min-w-0 flex-1">
          <List className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={chapter.id}
            onChange={(e) => goToChapter(e.target.value)}
            aria-label="Select album"
            className="w-full appearance-none truncate rounded-full border border-border bg-background py-2 pl-9 pr-8 text-sm font-medium outline-none focus:border-primary"
          >
            {comic.chapters.map((ch, i) => (
              <option key={ch.id} value={ch.id}>
                {i + 1}. {ch.title}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={!next}
          onClick={() => next && goToChapter(next.id)}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          <span className="sr-only sm:not-sr-only sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          disabled={!next}
          onClick={() => last && goToChapter(last.id)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary disabled:opacity-30"
          aria-label="Last"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header
        className={
          "fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl transition-transform " +
          (hideUI ? "-translate-y-full" : "translate-y-0")
        }
      >
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
          <Link
            to="/comic/$comicId"
            params={{ comicId: buildSlugId(comic.title, comic.id) }}
            className="inline-flex items-center gap-1.5 text-sm font-bold hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="line-clamp-1">{comic.title}</span>
          </Link>
          <span className="text-xs font-bold">{chapter.title}</span>
        </div>
      </header>

      <h1 className="sr-only">
        {chapter.title} — {comic.title}
      </h1>

      <BreadcrumbNav />

      {chapter.pages.length === 0 ? (
        <main className="mx-auto max-w-3xl pt-4">
          <VideoEmbed />
          {!embed && (
            <div className="p-10 text-center text-muted-foreground">
              {t("reader.emptyAlbum")}
            </div>
          )}
          <Footer />
        </main>
      ) : singleId && !pdfFailed ? (
        <>
          <VideoEmbed />
          <PdfReader
            fileUrl={`/api/drive-file?id=${singleId}`}
            Footer={Footer}
            onFail={() => setPdfFailed(true)}
          />
        </>
      ) : (
        <Virtuoso
          useWindowScroll
          data={chapter.pages}
          increaseViewportBy={{ top: 1500, bottom: 2000 }}
          components={{
            Header: () => (embed ? <VideoEmbed /> : <div className="h-2" />),
            Footer,
          }}
          itemContent={(i, id) => (
            <div className="mx-auto max-w-3xl">
              <img
                src={driveImageUrl(id, 1200)}
                alt={`Gravure photo ${i + 1} — ${comic.title}, ${chapter.title}`}
                loading="lazy"
                decoding="async"
                className="block w-full min-h-[60vh] bg-secondary/40 object-contain"
                onError={(e) => {
                  const imgEl = e.currentTarget as HTMLImageElement;
                  if (!imgEl.dataset.fallback) {
                    imgEl.dataset.fallback = "1";
                    const m = imgEl.src.match(/[?&]id=([A-Za-z0-9_-]+)/);
                    if (m) imgEl.src = `https://lh3.googleusercontent.com/d/${m[1]}=w1200`;
                  } else {
                    imgEl.style.opacity = "0.3";
                  }
                }}
              />
            </div>
          )}
        />
      )}
      {locked && (
        <div className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,340px)] -translate-x-1/2 -translate-y-1/2">
          <PremiumGate
            chapterId={chapter.id}
            chapterTitle={chapter.title}
            priceUsdt={priceUsdt}
            onUnlocked={() => setUnlocked(true)}
          />
        </div>
      )}
      <StickyNav />
    </div>
  );
}
