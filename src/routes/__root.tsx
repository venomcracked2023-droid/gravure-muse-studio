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

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Không tìm thấy trang</h2>
        <p className="mt-2 text-sm text-muted-foreground">Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Về trang chủ
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
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Trang này không tải được</h1>
        <p className="mt-2 text-sm text-muted-foreground">Có lỗi xảy ra. Thử tải lại hoặc về trang chủ.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Thử lại
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            Về trang chủ
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
      { title: "GravureHub — Bộ ảnh gravure cuộn dọc" },
      { name: "description", content: "GravureHub — ngắm bộ ảnh gravure cuộn dọc miễn phí, cập nhật album mới mỗi ngày, mượt mà trên mọi thiết bị." },
      { name: "author", content: "GravureHub" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { name: "google-site-verification", content: "ABEQp0spMkYkrxY7BTrojPi32UhODPOsjv3HGSMiHD0" },
      { name: "theme-color", content: "#1a0a18" },
      { name: "keywords", content: "gravure, người mẫu gravure, ảnh gravure, photobook, idol, GravureHub" },
      { property: "og:site_name", content: "GravureHub" },
      { property: "og:title", content: "GravureHub — Bộ ảnh gravure cuộn dọc" },
      { property: "og:description", content: "GravureHub — ngắm bộ ảnh gravure cuộn dọc miễn phí, cập nhật album mới mỗi ngày, mượt mà trên mọi thiết bị." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "vi_VN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "GravureHub — Bộ ảnh gravure cuộn dọc" },
      { name: "twitter:description", content: "GravureHub — ngắm bộ ảnh gravure cuộn dọc miễn phí, cập nhật album mới mỗi ngày, mượt mà trên mọi thiết bị." },
      { property: "og:image", content: `${SITE_URL}/og-default.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: `${SITE_URL}/og-default.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "alternate", hrefLang: "vi", href: `${SITE_URL}/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/` },
    ],
    scripts: [
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
          name: SITE_NAME, url: SITE_URL, inLanguage: "vi-VN",
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
    <html lang="vi">
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
          <Toaster richColors position="top-right" theme="dark" />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}