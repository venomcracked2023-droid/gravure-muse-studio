import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { data: comics } = await supabase.from("comics").select("id,updated_at").order("updated_at", { ascending: false }).limit(1000);
        const iso = (v: any) => new Date(v).toISOString();
        const urls = [
          `<url><loc>${origin}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
          `<url><loc>${origin}/featured</loc><changefreq>daily</changefreq></url>`,
          `<url><loc>${origin}/latest</loc><changefreq>daily</changefreq></url>`,
        ];
        for (const c of comics ?? []) urls.push(`<url><loc>${origin}/comic/${c.id}</loc><lastmod>${iso(c.updated_at)}</lastmod></url>`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=900" } });
      },
    },
  },
});

export {};