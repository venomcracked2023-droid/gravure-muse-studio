export type EmbedInfo =
  | { kind: "iframe"; url: string }
  | { kind: "video"; url: string; poster?: string };

const VIDEO_EXT_RE = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i;

export function parseEmbed(input: string): EmbedInfo | null {
  const s = input.trim();
  if (!s) return null;
  // Direct <video src="..."> HTML
  const tag = s.match(/<video[^>]*\ssrc=["']([^"']+)["'][^>]*>/i);
  if (tag) {
    const url = tag[1];
    const poster = s.match(/\sposter=["']([^"']+)["']/i)?.[1];
    return { kind: "video", url, poster };
  }
  try {
    const u = new URL(s);
    if (VIDEO_EXT_RE.test(u.pathname)) return { kind: "video", url: s };
  } catch { /* not a URL */ }
  const iframe = toEmbedUrl(s);
  return iframe ? { kind: "iframe", url: iframe } : null;
}

export function toEmbedUrl(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, "");
    // YouTube
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const m = u.pathname.match(/^\/(embed|shorts|live)\/([A-Za-z0-9_-]+)/);
      if (m) return `https://www.youtube.com/embed/${m[2]}`;
    }
    // Vimeo
    if (host.endsWith("vimeo.com")) {
      if (host === "player.vimeo.com") return s;
      const m = u.pathname.match(/^\/(\d+)/);
      if (m) return `https://player.vimeo.com/video/${m[1]}`;
    }
    // Google Drive
    if (host.endsWith("drive.google.com")) {
      const m = u.pathname.match(/\/file\/d\/([A-Za-z0-9_-]+)/);
      const id = m?.[1] ?? u.searchParams.get("id");
      if (id) return `https://drive.google.com/file/d/${id}/preview`;
    }
    // Dailymotion
    if (host.endsWith("dailymotion.com")) {
      const m = u.pathname.match(/\/video\/([A-Za-z0-9]+)/);
      if (m) return `https://www.dailymotion.com/embed/video/${m[1]}`;
    }
    if (host === "dai.ly") {
      const id = u.pathname.slice(1);
      return id ? `https://www.dailymotion.com/embed/video/${id}` : null;
    }
    return s; // assume already embeddable
  } catch {
    return null;
  }
}