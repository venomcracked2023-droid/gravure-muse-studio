import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n/context";
import { Toaster } from "sonner";
import { SITE_LOGO, SITE_NAME, SITE_URL, SOCIAL_LINKS } from "@/lib/seo";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingTelegramButton } from "@/components/FloatingTelegramButton";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page failed to load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try reloading or return home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
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
      { name: "description", content: "GravureHub — browse free vertical-scroll gravure photo albums from Korean, Japanese and Vietnamese models. New albums added daily, smooth on any device." },
      { name: "author", content: "GravureHub" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { name: "google-site-verification", content: "ABEQp0spMkYkrxY7BTrojPi32UhODPOsjv3HGSMiHD0" },
      { name: "theme-color", content: "#1a0a18" },
      { name: "keywords", content: "gravure, gravure idol, gravure models, photobook, vertical scroll, GravureHub" },
      { property: "og:site_name", content: "GravureHub" },
      { property: "og:title", content: "GravureHub — Free vertical-scroll gravure photo albums" },
      { property: "og:description", content: "GravureHub — browse free vertical-scroll gravure photo albums from Korean, Japanese and Vietnamese models. New albums added daily." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "vi_VN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "GravureHub — Free vertical-scroll gravure photo albums" },
      { name: "twitter:description", content: "GravureHub — browse free vertical-scroll gravure photo albums from Korean, Japanese and Vietnamese models." },
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
          name: SITE_NAME, url: SITE_URL, logo: SITE_LOGO, sameAs: SOCIAL_LINKS,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME, url: SITE_URL, inLanguage: "en",
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
      <head><HeadContent /></head>
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