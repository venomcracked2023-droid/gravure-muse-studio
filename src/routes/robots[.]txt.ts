import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const body = [
          "# robots.txt — GravureHub", "",
          "User-agent: *", "Allow: /",
          "Disallow: /admin", "Disallow: /admin-applications",
          "Disallow: /apply", "Disallow: /login", "Disallow: /api/", "",
          "User-agent: GPTBot", "Disallow: /", "",
          "User-agent: CCBot", "Disallow: /", "",
          "User-agent: ClaudeBot", "Disallow: /", "",
          `Host: ${origin}`, `Sitemap: ${origin}/sitemap.xml`, "",
        ].join("\n");
        return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});

export {};