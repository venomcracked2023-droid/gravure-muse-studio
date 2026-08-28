import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Chapter = {
  id: string;
  title: string;
  pages: string[];
  createdAt: number;
  coverId?: string;
  videoUrl?: string;
  isPremium?: boolean;
  priceUsdt?: number;
};

export type Comic = {
  id: string;
  title: string;
  author: string;
  description: string;
  coverId: string;
  genres: string[];
  chapters: Chapter[];
  createdAt: number;
  createdBy?: string;
  featured: boolean;
  bookingUrl?: string;
  orderUrl?: string;
};

const CACHE_KEY = "gravure_comics_cache_v1";

const listeners = new Set<() => void>();
let cache: Comic[] = (() => {
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }
  return [];
})();
let loaded = cache.length > 0;
let loading: Promise<void> | null = null;

function emit() {
  if (typeof window !== "undefined" && cache.length > 0) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
      // Storage quota or restriction ignored
    }
  }
  listeners.forEach((l) => l());
}

export async function fetchComicsData(): Promise<Comic[]> {
  try {
    const { data: comics, error } = await supabase
      .from("comics")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("fetchComicsData comics error:", error);
      return cache;
    }
    const ids = (comics ?? []).map((c) => c.id);
    const chaptersByComic: Record<string, Chapter[]> = {};
    if (ids.length) {
      const { data: chapters, error: chErr } = await supabase
        .from("chapters")
        .select("*")
        .in("comic_id", ids)
        .order("order_index", { ascending: true });
      if (chErr) console.error("fetchComicsData chapters error:", chErr);
      for (const ch of chapters ?? []) {
        (chaptersByComic[ch.comic_id] ||= []).push({
          id: ch.id,
          title: ch.title,
          pages: ch.pages ?? [],
          createdAt: new Date(ch.created_at).getTime(),
          coverId: (ch as any).cover_id ?? "",
          videoUrl: (ch as any).video_url ?? "",
          isPremium: (ch as any).is_premium ?? false,
          priceUsdt: Number((ch as any).price_usdt ?? 2),
        });
      }
    }
    const result: Comic[] = (comics ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      author: c.author ?? "",
      description: c.description ?? "",
      coverId: c.cover_id ?? "",
      genres: c.genres ?? [],
      chapters: chaptersByComic[c.id] ?? [],
      createdAt: new Date(c.created_at).getTime(),
      createdBy: c.created_by,
      featured: (c as any).featured ?? false,
      bookingUrl: (c as any).booking_url ?? "",
      orderUrl: (c as any).order_url ?? "",
    }));
    cache = result;
    loaded = true;
    emit();
    return result;
  } catch (err) {
    console.error("fetchComicsData uncaught error:", err);
    return cache;
  }
}

export function setComicsCache(comics: Comic[]) {
  if (comics && comics.length > 0) {
    cache = comics;
    loaded = true;
    emit();
  }
}

export function loadComics(): Promise<Comic[]> {
  if (loading) return loading as unknown as Promise<Comic[]>;
  loading = fetchComicsData().finally(() => {
    loading = null;
  }) as unknown as Promise<void>;
  return loading as unknown as Promise<Comic[]>;
}

export function getComics(): Comic[] {
  return cache;
}

export async function upsertComic(c: Comic): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Bạn cần đăng nhập");
  const isNew = !cache.some((x) => x.id === c.id);
  const payload = {
    title: c.title,
    author: c.author,
    description: c.description,
    cover_id: c.coverId,
    genres: c.genres,
    featured: c.featured,
    booking_url: c.bookingUrl ?? "",
    order_url: c.orderUrl ?? "",
  };
  let comicId = c.id;
  if (isNew) {
    const { data, error } = await supabase
      .from("comics")
      .insert({ ...payload, created_by: userId })
      .select("id")
      .single();
    if (error) throw error;
    comicId = data.id;
  } else {
    const { error } = await supabase.from("comics").update(payload).eq("id", c.id);
    if (error) throw error;
    const { error: delErr } = await supabase.from("chapters").delete().eq("comic_id", c.id);
    if (delErr) throw delErr;
  }
  if (c.chapters.length) {
    const rows = c.chapters.map((ch, i) => ({
      comic_id: comicId,
      title: ch.title,
      pages: ch.pages,
      order_index: i,
      cover_id: ch.coverId ?? "",
      video_url: ch.videoUrl ?? "",
      is_premium: ch.isPremium ?? false,
      price_usdt: ch.priceUsdt ?? 2,
    }));
    const { error: insErr } = await supabase.from("chapters").insert(rows);
    if (insErr) throw insErr;
  }
  await fetchComicsData();
}

export async function deleteComic(id: string): Promise<void> {
  const { error } = await supabase.from("comics").delete().eq("id", id);
  if (error) throw error;
  await fetchComicsData();
}

export async function setFeatured(id: string, featured: boolean): Promise<void> {
  const { error } = await supabase.from("comics").update({ featured }).eq("id", id);
  if (error) throw error;
  const c = cache.find((x) => x.id === id);
  if (c) c.featured = featured;
  emit();
}

export function useComics(initialComics?: Comic[]): Comic[] {
  if (initialComics && initialComics.length > 0 && (!loaded || cache.length === 0)) {
    cache = initialComics;
    loaded = true;
  }
  const [, setTick] = useState(0);
  useEffect(() => {
    const cb = () => setTick((n) => n + 1);
    listeners.add(cb);
    if (!loaded && !loading) loadComics();
    else cb();
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return initialComics && initialComics.length > 0 && cache.length === 0 ? initialComics : cache;
}

export function useComicsLoaded(): boolean {
  const [val, setVal] = useState(loaded);
  useEffect(() => {
    const cb = () => setVal(loaded);
    listeners.add(cb);
    if (!loaded && !loading) loadComics();
    cb();
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return val;
}

export function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}
