// Google Analytics 4 Event Tracking Helper

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, eventParams: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...eventParams });
    }
  } catch (err) {
    // Non-blocking catch to ensure analytics errors never affect user experience
    console.debug("[Analytics error]", err);
  }
}

export function trackModelView(modelName: string): void {
  trackEvent("model_view", { model_name: modelName });
}

export function trackAlbumOpen(modelName: string, albumName: string): void {
  trackEvent("album_open", { model_name: modelName, album_name: albumName });
}

export function trackSearch(searchTerm: string): void {
  if (!searchTerm.trim()) return;
  trackEvent("search", { search_term: searchTerm.trim() });
}

export function trackTelegramClick(location: "header" | "floating" | "footer" | "cta"): void {
  trackEvent("telegram_click", { location });
}

export function trackBlogView(postTitle: string): void {
  trackEvent("blog_view", { post_title: postTitle });
}
