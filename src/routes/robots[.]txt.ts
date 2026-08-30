import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const origin = SITE_URL;
        const body = [
          "# Robots.txt for Duahaumanga.com (GravureHub)",
          "# Content-Signal: search=yes, ai-train=yes, ai-input=yes, use=full",
          "",
          "User-agent: *",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /admin-applications",
          "Disallow: /apply",
          "Disallow: /login",
          "Disallow: /signin",
          "Disallow: /auth/",
          "Disallow: /api/",
          "",
          "User-agent: Googlebot",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /admin-applications",
          "Disallow: /apply",
          "Disallow: /login",
          "Disallow: /signin",
          "Disallow: /auth/",
          "Disallow: /api/",
          "",
          "# XML Sitemaps",
          `Sitemap: ${origin}/sitemap.xml`,
          `Sitemap: ${origin}/sitemap-index.xml`,
          "",
        ].join("\n");

        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
            "Content-Signal": "search=yes, ai-train=yes, ai-input=yes, use=full",
          },
        });
      },
    },
  },
});

export {};
