export function slugifyGenre(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const UUID_RE = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export function isUUID(input: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    (input || "").trim(),
  );
}

/** Extract a UUID from a SEO permalink like "ten-nguoi-mau-<uuid>". Falls back to the input. */
export function extractId(param: string): string {
  const m = (param || "").match(UUID_RE);
  return m ? m[1] : param;
}

/** Build a SEO-friendly permalink segment: "ten-truyen-<uuid>". */
export function buildSlugId(title: string | null | undefined, id: string): string {
  const s = slugifyGenre(title || "");
  return s ? `${s}-${id}` : id;
}
