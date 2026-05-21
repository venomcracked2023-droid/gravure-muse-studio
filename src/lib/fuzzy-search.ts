export function normalizeVi(input: string): string {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").toLowerCase().trim();
}
function isSubsequence(needle: string, haystack: string): boolean {
  if (!needle) return true;
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) if (haystack[j] === needle[i]) i++;
  return i === needle.length;
}
function levenshtein(a: string, b: string, max: number): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = new Array(n + 1), curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i; let rowMin = curr[0];
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
  const q = normalizeVi(query), t = normalizeVi(text);
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