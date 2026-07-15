import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { buildSlugId } from "@/lib/slug";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const origin = SITE_URL;
        const { data: comics } = await supabase
          .from("comics")
          .select("id,title,updated_at,genres")
          .order("updated_at", { ascending: false })
          .limit(1000);
        const comicIds = (comics ?? []).map((c) => c.id);
        const chaptersByComic: Record<string, { id: string; title: string; updated_at: string }[]> = {};
        if (comicIds.length) {
          const { data: chapters } = await supabase
            .from("chapters")
            .select("id,title,updated_at,comic_id")
            .in("comic_id", comicIds)
            .order("order_index", { ascending: true });
          for (const ch of chapters ?? []) {
            (chaptersByComic[(ch as any).comic_id] ||= []).push(ch as any);
          }
        }
        const iso = (v: any) => new Date(v).toISOString();
        const urls = [
          `<url><loc>${origin}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
          `<url><loc>${origin}/featured</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
          `<url><loc>${origin}/latest</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
          `<url><loc>${origin}/blog/gravure-idol-la-gi</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
          `<url><loc>${origin}/blog/top-10-gravure-idols-2024</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
        ];
        for (const c of comics ?? []) {
          const comicSlug = buildSlugId((c as any).title, c.id);
          urls.push(`<url><loc>${origin}/comic/${comicSlug}</loc><lastmod>${iso(c.updated_at)}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`);
          for (const ch of chaptersByComic[c.id] ?? []) {
            const chSlug = buildSlugId(ch.title, ch.id);
            urls.push(`<url><loc>${origin}/read/${comicSlug}/${chSlug}</loc><lastmod>${iso(ch.updated_at)}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`);
          }
        }
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=900" } });
      },
    },
  },
});

export {};