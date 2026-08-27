export function extractDriveId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (/^[A-Za-z0-9_-]{20,}$/.test(s)) return s;
  const patterns = [
    /\/file\/d\/([A-Za-z0-9_-]+)/,
    /[?&]id=([A-Za-z0-9_-]+)/,
    /\/d\/([A-Za-z0-9_-]+)/,
    /uc\?id=([A-Za-z0-9_-]+)/,
  ];
  for (const r of patterns) {
    const m = s.match(r);
    if (m) return m[1];
  }
  return null;
}

/**
 * High-speed Google User Content edge CDN with HTTP/3 & WebP compression (fastest).
 */
export function driveImageUrl(idOrUrl: string, width = 1200): string {
  const id = extractDriveId(idOrUrl) ?? idOrUrl;
  return `https://lh3.googleusercontent.com/d/${id}=w${width}`;
}

/**
 * Fallback thumbnail endpoint if lh3 CDN is restricted or unavailable.
 */
export function driveImageFallbackUrl(idOrUrl: string, width = 1200): string {
  const id = extractDriveId(idOrUrl) ?? idOrUrl;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;
}

export function parseDriveIds(text: string): string[] {
  return text
    .split(/\s|,|;/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => extractDriveId(l) ?? l);
}
