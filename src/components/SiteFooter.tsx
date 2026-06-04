import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import gravureLogo from "@/assets/gravure-logo.png";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { useComics } from "@/lib/comics-store";
import { useI18n } from "@/lib/i18n/context";
import { buildSlugId } from "@/lib/slug";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const comics = useComics();
  const { t } = useI18n();
  const toc = comics.slice(0, 6);
  const genres = Array.from(new Set(comics.flatMap((c) => c.genres).filter(Boolean))).slice(0, 8);

  return (
    <footer className="relative mt-20 border-t border-border bg-card/40" role="contentinfo">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="group inline-flex items-center gap-2">
              <img src={gravureLogo} alt={`Logo ${SITE_NAME}`} width={32} height={32}
                className="h-8 w-8 object-contain transition group-hover:rotate-[-8deg]" loading="lazy" />
              <span className="text-lg font-bold tracking-tight text-gradient-brand">{SITE_NAME}</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          <nav aria-label={t("footer.explore")}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{t("footer.explore")}</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">{t("footer.home")}</Link></li>
              <li><Link to="/featured" className="text-muted-foreground hover:text-primary">{t("footer.featured")}</Link></li>
              <li><Link to="/latest" className="text-muted-foreground hover:text-primary">{t("footer.latest")}</Link></li>
            </ul>
          </nav>

          {toc.length > 0 && (
            <nav aria-label={t("footer.newModels")}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{t("footer.newModels")}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {toc.map((c) => (
                  <li key={c.id}>
                    <Link to="/comic/$comicId" params={{ comicId: buildSlugId(c.title, c.id) }} className="text-muted-foreground hover:text-primary">
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {genres.length > 0 && (
            <nav aria-label={t("footer.genres")}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">{t("footer.genres")}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {genres.map((g) => (
                  <li key={g}><Link to="/featured" className="text-muted-foreground hover:text-primary">{g}</Link></li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© <time dateTime={String(year)}>{year}</time> {SITE_NAME}. {t("footer.rights")}</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> by team{" "}
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" /> {SITE_NAME}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export const _siteUrl = SITE_URL;