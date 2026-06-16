import type { Comic } from "@/lib/comics-store";
import { buildSlugId } from "@/lib/slug";

function latestActivity(c: Comic): number {
  let max = c.createdAt ?? 0;
  for (const ch of c.chapters) {
    if (ch.createdAt > max) max = ch.createdAt;
  }
  return max;
}

/**
 * Auto-featured: most recently uploaded albums (by latest chapter or comic creation).
 * Admin no longer hand-picks — the newest content always shows up here.
 */
export function getAutoFeatured(comics: Comic[], limit = 12): Comic[] {
  return [...comics]
    .filter((c) => c.chapters.length > 0 || c.coverId)
    .sort((a, b) => latestActivity(b) - latestActivity(a))
    .slice(0, limit);
}

export type FeaturedChapter = {
  chapterId: string;
  chapterTitle: string;
  chapterCoverId: string;
  comicId: string;
  comicTitle: string;
  comicSlug: string;
  createdAt: number;
};

/**
 * Get the latest chapters across all comics, sorted by newest first.
 * Each chapter is enriched with its parent comic info for display.
 */
export function getLatestChapters(comics: Comic[], limit = 12): FeaturedChapter[] {
  const items: FeaturedChapter[] = [];
  for (const comic of comics) {
    for (const ch of comic.chapters) {
      items.push({
        chapterId: ch.id,
        chapterTitle: ch.title,
        chapterCoverId: ch.coverId || comic.coverId,
        comicId: comic.id,
        comicTitle: comic.title,
        comicSlug: buildSlugId(comic.title, comic.id),
        createdAt: ch.createdAt,
      });
    }
  }
  return items
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}
