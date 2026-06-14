import type { Comic } from "@/lib/comics-store";

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