import type { Comic, Chapter } from "@/lib/comics-store";

export function normalizeVi(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim();
}

function isSubsequence(needle: string, haystack: string): boolean {
  if (!needle) return true;
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (haystack[j] === needle[i]) i++;
  }
  return i === needle.length;
}

function levenshtein(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = new Array(n + 1);
  let curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return max + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

export function fuzzyScoreVi(query: string, text: string): number | null {
  const q = normalizeVi(query);
  const t = normalizeVi(text);
  if (!q) return 0;
  if (!t) return null;
  const idx = t.indexOf(q);
  if (idx !== -1) return idx === 0 ? 0 : 1;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every((tok) => t.includes(tok))) return 2;
  if (q.length >= 2 && isSubsequence(q.replace(/\s+/g, ""), t.replace(/\s+/g, ""))) return 3;
  const maxEdits = q.length <= 4 ? 1 : q.length <= 8 ? 2 : 3;
  const words = t.split(/\s+/).filter(Boolean);
  let bestWord = Infinity;
  for (const w of words) {
    if (Math.abs(w.length - q.length) > maxEdits + 2) continue;
    const d = levenshtein(q, w, maxEdits);
    if (d <= maxEdits && d < bestWord) bestWord = d;
  }
  if (bestWord !== Infinity) return 4 + bestWord;
  return null;
}

export type SearchMatch = {
  comic: Comic;
  score: number;
  matchedField: "title" | "album" | "genre" | "author" | "description";
  matchedAlbum?: Chapter;
  matchedGenre?: string;
};

export function searchComics(comics: Comic[], query: string): SearchMatch[] {
  const rawQ = (query ?? "").trim();
  if (!rawQ) {
    return comics.map((comic) => ({
      comic,
      score: 0,
      matchedField: "title",
    }));
  }

  const qNorm = normalizeVi(rawQ);
  const tokens = qNorm.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return comics.map((comic) => ({
      comic,
      score: 0,
      matchedField: "title",
    }));
  }

  const matches: SearchMatch[] = [];

  for (const comic of comics) {
    const titleNorm = normalizeVi(comic.title);
    const authorNorm = normalizeVi(comic.author || "");
    const descNorm = normalizeVi(comic.description || "");
    const genresNorm = (comic.genres || []).map((g) => ({ raw: g, norm: normalizeVi(g) }));
    const chaptersNorm = (comic.chapters || []).map((ch) => ({ ch, norm: normalizeVi(ch.title) }));

    // 1. Exact or prefix match on model title
    if (titleNorm === qNorm) {
      matches.push({ comic, score: 100, matchedField: "title" });
      continue;
    }
    if (titleNorm.startsWith(qNorm)) {
      matches.push({ comic, score: 90, matchedField: "title" });
      continue;
    }
    if (titleNorm.includes(qNorm)) {
      matches.push({ comic, score: 80, matchedField: "title" });
      continue;
    }

    // 2. Check if all query tokens match model title
    const allTokensInTitle = tokens.every((tok) => titleNorm.includes(tok));
    if (allTokensInTitle) {
      matches.push({ comic, score: 75, matchedField: "title" });
      continue;
    }

    // 3. Check Chapter / Album titles
    let bestMatchedChapter: Chapter | undefined;
    let albumScore = 0;
    for (const item of chaptersNorm) {
      if (item.norm === qNorm) {
        bestMatchedChapter = item.ch;
        albumScore = 70;
        break;
      }
      if (item.norm.includes(qNorm)) {
        bestMatchedChapter = item.ch;
        albumScore = 65;
        break;
      }
      if (tokens.length > 1 && tokens.every((tok) => item.norm.includes(tok))) {
        bestMatchedChapter = item.ch;
        albumScore = 60;
        break;
      }
    }
    if (bestMatchedChapter) {
      matches.push({
        comic,
        score: albumScore,
        matchedField: "album",
        matchedAlbum: bestMatchedChapter,
      });
      continue;
    }

    // 4. Check Genres
    let matchedGenre: string | undefined;
    for (const g of genresNorm) {
      if (
        g.norm === qNorm ||
        g.norm.includes(qNorm) ||
        (tokens.length > 1 && tokens.every((tok) => g.norm.includes(tok)))
      ) {
        matchedGenre = g.raw;
        break;
      }
    }
    if (matchedGenre) {
      matches.push({ comic, score: 55, matchedField: "genre", matchedGenre });
      continue;
    }

    // 5. Check Author / Studio
    if (
      authorNorm.includes(qNorm) ||
      (tokens.length > 1 && tokens.every((tok) => authorNorm.includes(tok)))
    ) {
      matches.push({ comic, score: 50, matchedField: "author" });
      continue;
    }

    // 6. Check Description
    if (
      descNorm.includes(qNorm) ||
      (tokens.length > 1 && tokens.every((tok) => descNorm.includes(tok)))
    ) {
      matches.push({ comic, score: 40, matchedField: "description" });
      continue;
    }

    // 7. Cross-field token matching (e.g. token 1 in model title, token 2 in genre or chapter)
    const allCombined = `${titleNorm} ${authorNorm} ${genresNorm.map((g) => g.norm).join(" ")} ${chaptersNorm.map((c) => c.norm).join(" ")} ${descNorm}`;
    const allTokensInCombined = tokens.every((tok) => allCombined.includes(tok));
    if (allTokensInCombined) {
      const matchedCh = chaptersNorm.find((c) => tokens.some((tok) => c.norm.includes(tok)))?.ch;
      const matchedG = genresNorm.find((g) => tokens.some((tok) => g.norm.includes(tok)))?.raw;
      matches.push({
        comic,
        score: 35,
        matchedField: matchedCh ? "album" : matchedG ? "genre" : "title",
        matchedAlbum: matchedCh,
        matchedGenre: matchedG,
      });
      continue;
    }

    // 8. Fuzzy / Subsequence score on model title
    const fScore = fuzzyScoreVi(qNorm, titleNorm);
    if (fScore !== null && fScore <= 6) {
      matches.push({
        comic,
        score: Math.max(10, 30 - fScore * 3),
        matchedField: "title",
      });
    }
  }

  // Sort by score descending
  return matches.sort((a, b) => b.score - a.score);
}
