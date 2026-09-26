import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

const SECURITY_HEADERS: Record<string, string> = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://drive.google.com https://*.googleusercontent.com https://www.google.com https://images.unsplash.com https://qhmsex.cloud https://www.qhmsex.cloud https://*.qhmsex.cloud https://duahaumanga.com; media-src 'self' https: blob:; connect-src 'self' https://qhmsex.cloud https://www.qhmsex.cloud https://*.qhmsex.cloud https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.supabase.co wss://*.supabase.co https://static.cloudflareinsights.com; frame-src 'self' https://drive.google.com https://www.youtube.com https://www.youtube-nocookie.com https://plisio.net; frame-ancestors 'self';",
  "Content-Signal": "search=yes, ai-train=yes, ai-input=yes, use=full",
};

function applySecurityHeaders(res: Response, requestUrl?: string): Response {
  const headers = new Headers(res.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  if (requestUrl) {
    try {
      const url = new URL(requestUrl);
      const p = url.pathname.toLowerCase();
      if (
        p.startsWith("/admin") ||
        p.startsWith("/apply") ||
        p.startsWith("/login") ||
        p.startsWith("/signin")
      ) {
        headers.set("X-Robots-Tag", "noindex, nofollow");
      }
    } catch {
      // ignore invalid url
    }
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

import { SITE_URL } from "./lib/seo";
import { supabase } from "./integrations/supabase/client";
import { buildSlugId, slugifyGenre } from "./lib/slug";

async function generateSitemapXml(origin: string): Promise<string> {
  const now = new Date().toISOString();
  const safeIso = (v: string | null | undefined) => {
    if (!v) return now;
    const d = new Date(v);
    return isNaN(d.getTime()) ? now : d.toISOString();
  };

  const urls: string[] = [
    `<url><loc>${origin}/</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${origin}/featured</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${origin}/latest</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${origin}/pricing</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${origin}/about</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
    `<url><loc>${origin}/dmca</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    `<url><loc>${origin}/terms</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    `<url><loc>${origin}/privacy</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
    `<url><loc>${origin}/contact</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
    `<url><loc>${origin}/blog</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    `<url><loc>${origin}/blog/gravure-idol-la-gi</loc><lastmod>2026-06-09T00:00:00.000Z</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
    `<url><loc>${origin}/blog/top-10-gravure-idols-2024</loc><lastmod>2026-06-22T00:00:00.000Z</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
  ];

  try {
    const { data: comics } = await supabase
      .from("comics")
      .select("id,title,updated_at,created_at,genres")
      .order("updated_at", { ascending: false })
      .limit(1000);

    const comicIds = (comics ?? []).map((c) => c.id);
    const chaptersByComic: Record<
      string,
      {
        id: string;
        title: string;
        updated_at?: string;
        created_at?: string;
        comic_id: string;
        pages?: string[];
        video_url?: string;
      }[]
    > = {};

    if (comicIds.length) {
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id,title,created_at,comic_id,pages,video_url")
        .in("comic_id", comicIds)
        .order("order_index", { ascending: true });

      for (const ch of (chapters ?? []) as Array<{
        id: string;
        title: string;
        created_at: string;
        comic_id: string;
        pages?: string[];
        video_url?: string;
      }>) {
        if ((!ch.pages || ch.pages.length === 0) && !ch.video_url) {
          continue;
        }
        (chaptersByComic[ch.comic_id] ||= []).push(ch);
      }
    }

    for (const c of comics ?? []) {
      const chList = chaptersByComic[c.id] ?? [];
      if (chList.length === 0) continue;

      const comicSlug = buildSlugId(c.title, c.id);
      const comicLastmod = safeIso(c.updated_at || c.created_at);
      urls.push(
        `<url><loc>${origin}/comic/${comicSlug}</loc><lastmod>${comicLastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
      );

      for (const ch of chList) {
        const chSlug = buildSlugId(ch.title, ch.id);
        const chLastmod = safeIso(ch.updated_at || ch.created_at || c.updated_at);
        urls.push(
          `<url><loc>${origin}/read/${comicSlug}/${chSlug}</loc><lastmod>${chLastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
        );
      }
    }

    const validComics = (comics ?? []).filter((c) => (chaptersByComic[c.id] ?? []).length > 0);
    const genres = Array.from(
      new Set(
        validComics
          .flatMap((c) => (c.genres ?? []).map((g: string) => slugifyGenre(g.trim())))
          .map((g) => (g === "thai" ? "thailand" : g))
          .filter(Boolean),
      ),
    );
    for (const g of genres) {
      urls.push(
        `<url><loc>${origin}/genre/${g}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      );
    }
  } catch (error) {
    console.error("Worker dynamic sitemap fallback:", error);
    const fallbackGenres = [
      "japan",
      "korea",
      "vietnam",
      "china",
      "taiwan",
      "thailand",
      "cosplay",
      "lingerie",
      "swimsuit",
      "office",
      "school",
      "outdoor",
      "idol",
    ];
    for (const g of fallbackGenres) {
      urls.push(
        `<url><loc>${origin}/genre/${g}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
      );
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      if (env && typeof env === "object") {
        if (typeof process === "undefined") {
          (globalThis as any).process = { env: {} };
        }
        if (!process.env) {
          process.env = {};
        }
        Object.assign(process.env, env);
      }

      const url = new URL(request.url);
      const pathname = url.pathname.toLowerCase();

      // Direct Cloudflare Worker handler for Sitemap & Robots — guarantees pure XML/text without SPA fallback
      if (pathname === "/sitemap.xml") {
        const origin = SITE_URL;
        const xml = await generateSitemapXml(origin);
        return new Response(xml, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
            "x-content-type-options": "nosniff",
          },
        });
      }

      if (pathname === "/sitemap-index.xml" || pathname === "/sitemap_index.xml") {
        const origin = SITE_URL;
        const now = new Date().toISOString();
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${origin}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
        return new Response(xml, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
            "x-content-type-options": "nosniff",
          },
        });
      }

      if (pathname === "/robots.txt") {
        const origin = SITE_URL;
        const body = [
          "# Robots.txt for qhmsex.cloud / www.qhmsex.cloud (GravureHub)",
          "Content-Signal: search=yes, ai-train=yes, ai-input=yes, use=full",
          "",
          "User-agent: *",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /admin-applications",
          "Disallow: /apply",
          "Disallow: /auth/",
          "Disallow: /api/",
          "",
          "User-agent: Googlebot",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /admin-applications",
          "Disallow: /apply",
          "Disallow: /auth/",
          "Disallow: /api/",
          "",
          "# XML Sitemaps",
          `Sitemap: ${origin}/sitemap.xml`,
          `Sitemap: ${origin}/sitemap-index.xml`,
          "",
        ].join("\n");

        return new Response(body, {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
            "Content-Signal": "search=yes, ai-train=yes, ai-input=yes, use=full",
          },
        });
      }

      if (pathname === "/bingsiteauth.xml") {
        const xml = `<?xml version="1.0"?>
<users>
	<user>190656BE5C586C70BDE829F7CB6259E4</user>
</users>`;
        return new Response(xml, {
          status: 200,
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=86400",
          },
        });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return applySecurityHeaders(normalized, request.url);
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(brandedErrorResponse(), request?.url);
    }
  },
};
