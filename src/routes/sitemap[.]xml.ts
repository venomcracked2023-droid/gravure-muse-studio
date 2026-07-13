import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { buildSlugId } from "@/lib/slug";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      HEAD: async () =>
        new Response(null, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=900",
          },
        }),
      GET: async () => {
        const origin = SITE_URL;
        const { data: comics } = await supabase.from("comics").select("id,title,updated_at,genres").order("updated_at", { ascending: false }).limit(1000);
        const iso = (v: any) => new Date(v).toISOString();
        const urls = [
          `<url><loc>${origin}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
          `<url><loc>${origin}/featured</loc><changefreq>daily</changefreq></url>`,
          `<url><loc>${origin}/latest</loc><changefreq>daily</changefreq></url>`,
          `<url><loc>${origin}/blog/gravure-idol-la-gi</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
          `<url><loc>${origin}/blog/top-10-gravure-idols-2024</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
          `<url><loc>${origin}/login</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>`,
          `<url><loc>${origin}/apply</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>`,
        ];
        const genres = new Set<string>();
        for (const c of comics ?? []) {
          urls.push(`<url><loc>${origin}/comic/${buildSlugId((c as any).title, c.id)}</loc><lastmod>${iso(c.updated_at)}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
          for (const g of (c.genres ?? []) as string[]) {
            const slug = (g || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            if (slug) genres.add(slug);
          }
        }
        for (const slug of genres) urls.push(`<url><loc>${origin}/genre/${slug}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=900" } });
      },
    },
  },
});

export {};