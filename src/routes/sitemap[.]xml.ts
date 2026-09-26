import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { buildSlugId, slugifyGenre } from "@/lib/slug";
import { SITE_URL } from "@/lib/seo";

const CANONICAL_GENRE_MAP: Record<string, string> = {
  japanese: "japan",
  korean: "korea",
  vietnamese: "vietnam",
  chinese: "china",
  taiwanese: "taiwan",
  thai: "thailand",
  singaporean: "singapore",
  malaysian: "malaysia",
  bikini: "swimsuit",
  swimwear: "swimsuit",
  boudoir: "lingerie",
};

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

          const validComics = (comics ?? []).filter((c) => (chaptersByComic[c.id] ?? []).length > 0);

          for (const c of validComics) {
            const chList = chaptersByComic[c.id] ?? [];
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

          // Strictly include only genres with >= 1 model (never include empty / noindex genres in sitemap)
          const genreCountMap: Record<string, number> = {};
          for (const c of validComics) {
            for (const g of (c.genres ?? [])) {
              const raw = slugifyGenre(g.trim());
              const canonical = CANONICAL_GENRE_MAP[raw] || raw;
              if (canonical) {
                genreCountMap[canonical] = (genreCountMap[canonical] || 0) + 1;
              }
            }
          }

          const indexedGenres = Object.keys(genreCountMap).filter((g) => genreCountMap[g] > 0);
          for (const g of indexedGenres) {
            urls.push(
              `<url><loc>${origin}/genre/${g}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
            );
          }
        } catch (error) {
          console.error("Sitemap dynamic database query fallback:", error);
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
