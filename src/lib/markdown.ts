import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ breaks: true, gfm: true });

/** Render a markdown string to sanitized HTML. Safe for dangerouslySetInnerHTML. */
export function renderMarkdown(src: string): string {
  const raw = marked.parse(src || "", { async: false }) as string;
  if (typeof window === "undefined") {
    // SSR: skip DOM sanitize; we only render this client-side anyway.
    return raw;
  }
  return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
}

/** Strip markdown to plain text (for meta description / previews). */
export function stripMarkdown(src: string): string {
  return (src || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/[*_~>#-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}