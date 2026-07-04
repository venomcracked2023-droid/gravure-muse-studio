import type { Chapter, Comic } from "@/lib/comics-store";

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

export type FeaturedAlbum = {
  comic: Comic;
  chapter: Chapter;
};

function albumThumbnail(a: FeaturedAlbum): string | undefined {
  return a.chapter.coverId || a.chapter.pages[0] || a.comic.coverId || undefined;
}

/**
 * Latest albums: individual chapters sorted by upload time, newest first.
 * Uses the album's own thumbnail (chapter cover, first page, or parent comic cover).
 */
export function getLatestAlbums(comics: Comic[], limit = 12): FeaturedAlbum[] {
  const albums: FeaturedAlbum[] = [];
  for (const comic of comics) {
    for (const chapter of comic.chapters) {
      albums.push({ comic, chapter });
    }
  }
  return albums
    .filter((a) => albumThumbnail(a))
    .sort((a, b) => b.chapter.createdAt - a.chapter.createdAt)
    .slice(0, limit);
}
