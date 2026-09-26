import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { buildSlugId, slugifyGenre } from "@/lib/slug";
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
              // Exclude empty chapters with 0 pages and no video
              if ((!ch.pages || ch.pages.length === 0) && !ch.video_url) {
                continue;
              }
              (chaptersByComic[ch.comic_id] ||= []).push(ch);
            }
          }

          for (const c of comics ?? []) {
            const chList = chaptersByComic[c.id] ?? [];
            if (chList.length === 0) continue; // Skip models with 0 chapters

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
          console.error("Sitemap dynamic database query fallback:", error);
          // Add default fallback genres if DB fetch fails
          const fallbackGenres = ["japan", "korea", "vietnam", "china", "taiwan", "thailand", "cosplay", "lingerie", "swimsuit", "office", "school", "outdoor", "idol"];
          for (const g of fallbackGenres) {
            urls.push(
              `<url><loc>${origin}/genre/${g}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
            );
          }
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
