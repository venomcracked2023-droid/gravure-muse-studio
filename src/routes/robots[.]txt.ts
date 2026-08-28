import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const origin = SITE_URL;
        const body = [
          "# Robots.txt for Duahaumanga.com (GravureHub)",
          "User-agent: *",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /admin-applications",
          "Disallow: /apply",
          "Disallow: /login",
          "Disallow: /signin",
          "Disallow: /api/",
          "",
          "# AI Training & Scraper Bots Policy (Content Protection)",
          "User-agent: GPTBot",
          "User-agent: ChatGPT-User",
          "User-agent: ClaudeBot",
          "User-agent: anthropic-ai",
          "User-agent: CCBot",
          "User-agent: Applebot-Extended",
          "User-agent: Google-Extended",
          "User-agent: Bytespider",
          "User-agent: Amazonbot",
          "User-agent: meta-externalagent",
          "Disallow: /",
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
            "Content-Signal": "search=yes, ai-train=no, ai-input=no",
          },
        });
      },
    },
  },
});

export {};
