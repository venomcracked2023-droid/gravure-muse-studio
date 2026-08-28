import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { buildSlugId } from "@/lib/slug";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const origin = SITE_URL;
        const now = new Date().toISOString();
        const safeIso = (v: string | null | undefined) => {
          if (!v) return now;
          const d = new Date(v);
          return isNaN(d.getTime()) ? now : d.toISOString();
        };

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
          }[]
        > = {};

        if (comicIds.length) {
          const { data: chapters } = await supabase
            .from("chapters")
            .select("id,title,created_at,comic_id")
            .in("comic_id", comicIds)
            .order("order_index", { ascending: true });

          for (const ch of (chapters ?? []) as Array<{
            id: string;
            title: string;
            created_at: string;
            comic_id: string;
          }>) {
            (chaptersByComic[ch.comic_id] ||= []).push(ch);
          }
        }

        const urls = [
          `<url><loc>${origin}/</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
          `<url><loc>${origin}/featured</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`,
          `<url><loc>${origin}/latest</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`,
          `<url><loc>${origin}/pricing</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
          `<url><loc>${origin}/about</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
          `<url><loc>${origin}/terms</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
          `<url><loc>${origin}/privacy</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`,
          `<url><loc>${origin}/contact</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
          `<url><loc>${origin}/blog/gravure-idol-la-gi</loc><lastmod>2026-06-09T00:00:00.000Z</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
          `<url><loc>${origin}/blog/top-10-gravure-idols-2024</loc><lastmod>2026-06-22T00:00:00.000Z</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
        ];

        for (const c of comics ?? []) {
          const comicSlug = buildSlugId(c.title, c.id);
          const comicLastmod = safeIso(c.updated_at || c.created_at);
          urls.push(
            `<url><loc>${origin}/comic/${comicSlug}</loc><lastmod>${comicLastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
          );

          for (const ch of chaptersByComic[c.id] ?? []) {
            const chSlug = buildSlugId(ch.title, ch.id);
            const chLastmod = safeIso(ch.updated_at || ch.created_at || c.updated_at);
            urls.push(
              `<url><loc>${origin}/read/${comicSlug}/${chSlug}</loc><lastmod>${chLastmod}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
            );
          }
        }

        const genres = Array.from(
          new Set(
            (comics ?? [])
              .flatMap((c) => (c.genres ?? []).map((g: string) => g.trim().toLowerCase()))
              .filter(Boolean),
          ),
        );
        for (const g of genres) {
          urls.push(
            `<url><loc>${origin}/genre/${encodeURIComponent(g)}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
          );
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=900",
          },
        });
      },
    },
  },
});

export {};
