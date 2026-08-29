import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogIn, LogOut, Search, Settings, UserPlus, ShieldCheck, X, BookOpen, Tag } from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TelegramLink } from "@/components/TelegramLink";
import gravureLogo from "@/assets/gravure-logo.png";
import { trackSearch } from "@/lib/analytics";
import { useComics } from "@/lib/comics-store";
import { searchComics } from "@/lib/fuzzy-search";
import { buildSlugId } from "@/lib/slug";
import { ComicCover } from "@/components/ComicCover";

export function SiteHeader() {
  const { user, isContributor, isAdmin, profile, signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const comics = useComics();
  const search = useRouterState({ select: (s) => s.location.search as { q?: string } });
  
  const [q, setQ] = useState(search?.q ?? "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQ(search?.q ?? "");
  }, [search?.q]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus mobile search input when opened
  useEffect(() => {
    if (isMobileSearchOpen) {
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 100);
    }
  }, [isMobileSearchOpen]);

  // Live search preview suggestions
  const liveResults = useMemo(() => {
    const trimmed = q.trim();
    if (!trimmed) return [];
    return searchComics(comics, trimmed).slice(0, 6);
  }, [comics, q]);

  function submitSearch(termToSearch?: string) {
    const term = (typeof termToSearch === "string" ? termToSearch : q).trim();
    if (term) trackSearch(term);
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
    navigate({
      to: "/",
      search: term ? { q: term } : {},
      hash: "library",
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isDropdownOpen && e.key === "ArrowDown" && q.trim()) {
      setIsDropdownOpen(true);
      return;
    }
    if (!isDropdownOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < liveResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < liveResults.length) {
        const item = liveResults[selectedIndex];
        handleSelectResult(item);
      } else {
        submitSearch();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    }
  }

  function handleSelectResult(item: (typeof liveResults)[0]) {
    setIsDropdownOpen(false);
    setIsMobileSearchOpen(false);
    trackSearch(q.trim());

    if (item.matchedField === "album" && item.matchedAlbum) {
      navigate({
        to: "/read/$comicId/$chapterId",
        params: {
          comicId: buildSlugId(item.comic.title, item.comic.id),
          chapterId: buildSlugId(item.matchedAlbum.title, item.matchedAlbum.id),
        },
      });
    } else {
      navigate({
        to: "/comic/$comicId",
        params: {
          comicId: buildSlugId(item.comic.title, item.comic.id),
        },
      });
    }
  }

  const navClass =
    "nav-link inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground";
  const activeClass =
    "nav-link inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-medium text-foreground";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4" ref={containerRef}>
        <Link to="/" className="group flex items-center gap-2">
          <span className="relative">
            <span className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-lg transition group-hover:bg-primary/50" />
            <img
              src={gravureLogo}
              alt="GravureHub logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"
            />
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none tracking-tight text-gradient-brand">
              GravureHub
            </span>
            <span className="text-[10px] font-medium leading-tight text-muted-foreground/80 tracking-wide">
              duahaumanga.com
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar with Live Suggestions Dropdown */}
        <div className="relative mx-3 hidden min-w-0 flex-1 sm:block sm:max-w-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
            role="search"
            className="flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3.5 py-1.5 backdrop-blur transition focus-within:border-primary/60 focus-within:bg-background/90 focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              ref={desktopInputRef}
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setIsDropdownOpen(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => {
                if (q.trim()) setIsDropdownOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t("search.placeholder")}
              aria-label={t("search.placeholder")}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setIsDropdownOpen(false);
                  navigate({ to: "/", search: {} });
                }}
                aria-label={t("search.clear")}
                className="rounded-full p-0.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown Preview */}
          {isDropdownOpen && q.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150">
              {liveResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("section.results")} ({liveResults.length})
                  </div>
                  {liveResults.map((res, index) => {
                    const isSelected = selectedIndex === index;
                    return (
                      <button
                        key={res.comic.id}
                        type="button"
                        onClick={() => handleSelectResult(res)}
                        className={`w-full flex items-center gap-3 rounded-xl p-2 text-left transition ${
                          isSelected ? "bg-primary/15 text-foreground ring-1 ring-primary/30" : "hover:bg-secondary/70 text-foreground"
                        }`}
                      >
                        <div className="relative h-11 w-8 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                          <ComicCover
                            id={res.comic.coverId}
                            title={res.comic.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs truncate">
                              {res.comic.title}
                            </span>
                            {res.comic.chapters.length > 0 && (
                              <span className="shrink-0 text-[10px] text-muted-foreground">
                                • {res.comic.chapters.length} {t("card.albums")}
                              </span>
                            )}
                          </div>
                          {res.matchedField === "album" && res.matchedAlbum ? (
                            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-primary truncate">
                              <BookOpen className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {t("search.matchedAlbum")} {res.matchedAlbum.title}
                              </span>
                            </div>
                          ) : res.matchedField === "genre" && res.matchedGenre ? (
                            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-accent-foreground truncate">
                              <Tag className="h-3 w-3 shrink-0 text-primary" />
                              <span className="truncate">#{res.matchedGenre}</span>
                            </div>
                          ) : res.comic.author ? (
                            <div className="text-[11px] text-muted-foreground truncate">
                              {res.comic.author}
                            </div>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                  <div className="pt-1.5 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => submitSearch()}
                      className="w-full text-center py-2 text-xs font-semibold text-primary hover:bg-primary/10 rounded-xl transition"
                    >
                      {t("search.seeAll", { count: String(liveResults.length), query: q.trim() })} →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center px-4">
                  <p className="text-xs text-muted-foreground">{t("empty.noResults")} "{q.trim()}"</p>
                  <button
                    type="button"
                    onClick={() => submitSearch()}
                    className="mt-2 text-xs font-medium text-primary hover:underline"
                  >
                    {t("section.viewAll")}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation & Actions */}
        <nav className="flex items-center gap-0.5 text-sm">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen);
              if (!isMobileSearchOpen) {
                setIsDropdownOpen(true);
              }
            }}
            aria-label="Toggle mobile search"
            className="sm:hidden rounded-md p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>

          <Link
            to="/"
            activeOptions={{ exact: true }}
            className={navClass}
            activeProps={{ className: activeClass }}
          >
            {t("nav.explore")}
          </Link>
          {isContributor && (
            <Link to="/admin" className={navClass} activeProps={{ className: activeClass }}>
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.manage")}</span>
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin-applications"
              className={navClass}
              activeProps={{ className: activeClass }}
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.approveCtv")}</span>
            </Link>
          )}
          {user && !isContributor && (
            <Link to="/apply" className={navClass} activeProps={{ className: activeClass }}>
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.apply")}</span>
            </Link>
          )}
          <TelegramLink
            className="rounded-md p-2 text-muted-foreground transition hover:bg-[#29A9EA]/10 hover:text-[#29A9EA]"
            label=""
          />
          <LanguageSwitcher />
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground sm:inline">
                {profile?.display_name ?? user.email}
              </span>
              <button
                onClick={() => signOut()}
                aria-label={t("nav.logout")}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition hover:scale-105 active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.login")}</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Expandable Search Bar */}
      {isMobileSearchOpen && (
        <div className="sm:hidden border-t border-border/60 bg-background/95 px-4 py-3 shadow-lg backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
            role="search"
            className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={mobileInputRef}
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder={t("search.placeholder")}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  navigate({ to: "/", search: {} });
                }}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm"
            >
              Tìm
            </button>
          </form>

          {/* Mobile Search Dropdown Suggestions */}
          {q.trim() && (
            <div className="mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-border/80 bg-card p-2 shadow-lg">
              {liveResults.length > 0 ? (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase">
                    {t("section.results")} ({liveResults.length})
                  </div>
                  {liveResults.map((res) => (
                    <button
                      key={res.comic.id}
                      type="button"
                      onClick={() => handleSelectResult(res)}
                      className="w-full flex items-center gap-3 rounded-xl p-2 text-left hover:bg-secondary/70 transition"
                    >
                      <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                        <ComicCover
                          id={res.comic.coverId}
                          title={res.comic.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-foreground truncate">
                          {res.comic.title}
                        </div>
                        {res.matchedField === "album" && res.matchedAlbum ? (
                          <div className="text-[11px] text-primary truncate">
                            {t("search.matchedAlbum")} {res.matchedAlbum.title}
                          </div>
                        ) : res.matchedField === "genre" && res.matchedGenre ? (
                          <div className="text-[11px] text-muted-foreground truncate">
                            #{res.matchedGenre}
                          </div>
                        ) : (
                          <div className="text-[10px] text-muted-foreground">
                            {res.comic.chapters.length} {t("card.albums")}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => submitSearch()}
                      className="w-full text-center py-2 text-xs font-semibold text-primary hover:bg-primary/10 rounded-xl transition"
                    >
                      {t("search.seeAll", { count: String(liveResults.length), query: q.trim() })} →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-xs text-muted-foreground">{t("empty.noResults")} "{q.trim()}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
