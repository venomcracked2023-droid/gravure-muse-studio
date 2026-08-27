export const SITE_URL = "https://duahaumanga.com";
export const SITE_DOMAIN = "duahaumanga.com";
export const SITE_NAME = "GravureHub";
export const SITE_BRAND_FULL = "GravureHub (Dưa Hấu Manga)";
export const SITE_ALT_NAMES: string[] = [
  "GravureHub",
  "DuaHauManga",
  "Dưa Hấu Manga",
  "duahaumanga.com",
  "GravureHub - Dưa Hấu Manga",
];
export const SITE_LOGO = `${SITE_URL}/og-default.jpg`;
export const TELEGRAM_GROUP_URL = "https://t.me/+8xnMvFtjulkyNzE1";
export const SOCIAL_LINKS: string[] = [TELEGRAM_GROUP_URL];
export const DEFAULT_CTA_URL = "https://omg10.com/4/6070118";

export function getModelCountry(model: {
  author?: string | null;
  genres?: string[] | null;
  description?: string | null;
}): string {
  const text =
    `${model.author || ""} ${(model.genres || []).join(" ")} ${model.description || ""}`.toLowerCase();
  if (
    text.includes("korea") ||
    text.includes("hàn quốc") ||
    text.includes("han quoc") ||
    text.includes("korean")
  ) {
    return "Korea";
  }
  if (
    text.includes("japan") ||
    text.includes("nhật bản") ||
    text.includes("nhat ban") ||
    text.includes("japanese")
  ) {
    return "Japan";
  }
  if (
    text.includes("vietnam") ||
    text.includes("việt nam") ||
    text.includes("viet nam") ||
    text.includes("vietnamese")
  ) {
    return "Vietnam";
  }
  if (text.includes("taiwan") || text.includes("đài loan") || text.includes("taiwanese")) {
    return "Taiwan";
  }
  if (text.includes("china") || text.includes("trung quốc") || text.includes("chinese")) {
    return "China";
  }
  return "Asia";
}

export function getModelStyle(model: { genres?: string[] | null; description?: string | null }): string {
  const genres = model.genres || [];
  if (genres.length > 0) {
    return genres.slice(0, 3).join(", ");
  }
  return "sensual aesthetics and vertical-scroll photography";
}

/**
 * Concise SEO meta description under 160 characters (Task 4)
 */
export function generateModelMetaDescription(
  model: { title: string; author?: string | null; genres?: string[] | null },
  albumCount: number,
): string {
  const count = albumCount || 1;
  const desc = `Explore ${count} free gravure albums by ${model.title}. Korean/Japanese/Vietnamese model photo sets, vertically scrollable.`;
  return desc.slice(0, 160);
}

/**
 * Rich, unique model description (80-150 words) for server-rendered page content (Task 5)
 */
export function generateModelDescription(
  model: { title: string; author?: string | null; genres?: string[] | null; description?: string | null },
  albumCount: number,
): string {
  const country = getModelCountry(model);
  const style = getModelStyle(model);
  const count = albumCount || 1;
  const albumText = count === 1 ? "1 album" : `${count} albums`;

  // If there's an existing custom description with substantial length, incorporate it
  const customDesc = (model.description || "").trim();

  const baseIntro = `${model.title} is a popular gravure model from ${country}. Known for ${style}, she currently has ${albumText} available in the collection on GravureHub.`;
  const baseDetails = `Each album offers an immersive, high-definition viewing experience designed for seamless vertical scrolling across mobile and desktop devices. Fans can explore a curated selection of stunning visual photobooks capturing the artistic beauty and unique charm of ${model.title}.`;
  const baseOutro = `Browse all free photo sets and vertical-scroll albums by ${model.title} on GravureHub today, with new photo updates and high-resolution galleries regularly published.`;

  if (customDesc && customDesc.length >= 100) {
    return `${customDesc}\n\n${baseIntro} ${baseOutro}`;
  }

  return `${baseIntro} ${baseDetails} ${baseOutro}`;
}
