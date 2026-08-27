import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const origin = SITE_URL;
        const body = [
          "User-agent: *",
          "Content-Signal: ai-train=no, ai-input=no, search=yes",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /admin-applications",
          "Disallow: /apply",
          "Disallow: /login",
          "Disallow: /api/",
          "",
          "User-agent: GPTBot",
          "Disallow: /",
          "",
          "User-agent: ChatGPT-User",
          "Disallow: /",
          "",
          "User-agent: CCBot",
          "Disallow: /",
          "",
          "User-agent: ClaudeBot",
          "Disallow: /",
          "",
          "User-agent: anthropic-ai",
          "Disallow: /",
          "",
          "User-agent: Google-Extended",
          "Disallow: /",
          "",
          "User-agent: Bytespider",
          "Disallow: /",
          "",
          `Sitemap: ${origin}/sitemap.xml`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
            "Content-Signal": "ai-train=no, ai-input=no, search=yes",
          },
        });
      },
    },
  },
});

export {};
