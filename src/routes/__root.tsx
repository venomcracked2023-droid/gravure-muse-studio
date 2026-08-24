import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n/context";
import { Toaster } from "sonner";
import { SITE_LOGO, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingTelegramButton } from "@/components/FloatingTelegramButton";
import { SiteHeader } from "@/components/SiteHeader";
import { useComics } from "@/lib/comics-store";
import { ComicCover } from "@/components/ComicCover";
import { buildSlugId } from "@/lib/slug";
import { Search, Home, Star, Clock, Compass } from "lucide-react";
import { useState } from "react";

function NotFoundComponent() {
  const comics = useComics();
  const [searchTerm, setSearchTerm] = useState("");
  const previewModels = comics.slice(0, 6);

  const errorLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Page Not Found",
    description: "The requested page could not be found",
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(errorLd) }}
      />
      <main className="mx-auto max-w-5xl px-4 py-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Compass className="h-3.5 w-3.5" /> 404 Error
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
          The page you are looking for may have been moved, renamed, or deleted. Try searching our
          library or explore popular models below.
        </p>

        {/* Search Box (Task 19) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm.trim()) {
              window.location.href = `/?q=${encodeURIComponent(searchTerm.trim())}#library`;
            }
          }}
          className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-border bg-card/60 p-1.5 shadow-lg backdrop-blur focus-within:border-primary"
        >
          <Search className="ml-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search model or album..."
            className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground/70"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition hover:scale-105"
          >
            Search
          </button>
        </form>

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <Link
            to="/featured"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
          >
            <Star className="h-3.5 w-3.5 text-primary" /> Featured Albums
          </Link>
          <Link
            to="/latest"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
          >
            <Clock className="h-3.5 w-3.5" /> Latest Updates
          </Link>
        </div>

        {/* 6 Model Thumbnails Preview (Task 19) */}
        {previewModels.length > 0 && (
          <section className="mt-14 text-left">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Browse popular models
              </h2>
              <Link to="/" className="text-xs text-primary hover:underline">
                View all models →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {previewModels.map((m) => (
                <Link
                  key={m.id}
                  to="/comic/$comicId"
                  params={{ comicId: buildSlugId(m.title, m.id) }}
                  className="group flex flex-col gap-1.5"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary/60">
                    <ComicCover
                      id={m.coverId}
                      title={m.title}
                      className="transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <span className="line-clamp-1 text-xs font-semibold text-foreground group-hover:text-primary">
                    {m.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {m.chapters.length} albums
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page failed to load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try reloading or return home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GravureHub — Free vertical-scroll gravure photo albums" },
      {
        name: "description",
        content:
          "GravureHub — browse free vertical-scroll gravure photo albums from Korean, Japanese and Vietnamese models. New albums added daily, smooth on any device.",
      },
      { name: "author", content: "GravureHub" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { name: "google-site-verification", content: "ABEQp0spMkYkrxY7BTrojPi32UhODPOsjv3HGSMiHD0" },
      { name: "theme-color", content: "#1a0a18" },
      {
        name: "keywords",
        content: "gravure, gravure idol, gravure models, photobook, vertical scroll, GravureHub",
      },
      { property: "og:site_name", content: "GravureHub" },
      { property: "og:title", content: "GravureHub — Free vertical-scroll gravure photo albums" },
      {
        property: "og:description",
        content:
          "GravureHub — browse free vertical-scroll gravure photo albums from Korean, Japanese and Vietnamese models. New albums added daily.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },

      { name: "twitter:title", content: "GravureHub — Free vertical-scroll gravure photo albums" },
      {
        name: "twitter:description",
        content:
          "GravureHub — browse free vertical-scroll gravure photo albums from Korean, Japanese and Vietnamese models.",
      },
      { property: "og:image", content: `${SITE_URL}/og-default.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: `${SITE_URL}/og-default.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/` },
    ],
    scripts: [
      { src: "https://www.googletagmanager.com/gtag/js?id=G-DYPBMB9T0P", async: true },
      {
        children: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-DYPBMB9T0P');`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: SITE_LOGO,
          sameAs: SOCIAL_LINKS,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          inLanguage: "en",
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <Outlet />
          <SiteFooter />
          <FloatingTelegramButton />
          <Toaster richColors position="top-right" theme="dark" />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
