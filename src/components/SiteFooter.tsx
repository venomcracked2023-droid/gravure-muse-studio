import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import gravureLogo from "@/assets/gravure-logo.png";
import { SITE_NAME } from "@/lib/seo";
import { useComics } from "@/lib/comics-store";
import { useI18n } from "@/lib/i18n/context";
import { buildSlugId } from "@/lib/slug";
import { TelegramLink } from "@/components/TelegramLink";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const comics = useComics();
  const { t } = useI18n();
  const topModels = comics.slice(0, 10);
  const genres = Array.from(new Set(comics.flatMap((c) => c.genres).filter(Boolean))).slice(0, 8);

  return (
    <footer className="relative mt-20 border-t border-border bg-card/40" role="contentinfo">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="group inline-flex items-center gap-2">
              <img
                src={gravureLogo}
                alt={`Logo ${SITE_NAME}`}
                width={32}
                height={32}
                className="h-8 w-8 object-contain transition group-hover:rotate-[-8deg]"
                loading="lazy"
              />
              <span className="text-lg font-bold tracking-tight text-gradient-brand">
                {SITE_NAME}
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground/80">
              <span className="font-semibold text-foreground/80">duahaumanga.com</span> (Dưa Hấu Manga) là website chính thức của <strong>GravureHub</strong> — Thư viện ảnh gravure cuộn dọc chuẩn HD.
            </p>
          </div>

          <nav aria-label={t("footer.explore")}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              {t("footer.explore")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.home")}
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.featured")}
                </Link>
              </li>
              <li>
                <Link to="/latest" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.latest")}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing & VIP
                </Link>
              </li>
              <li>
                <TelegramLink
                  className="text-muted-foreground hover:text-[#29A9EA] transition-colors"
                  label={t("footer.telegram") ?? "Telegram group"}
                />
              </li>
            </ul>
          </nav>

          <nav aria-label="About & Legal">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              About & Legal
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About GravureHub
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  to="/blog/gravure-idol-la-gi"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.blogPost1")}
                </Link>
              </li>
              <li>
                <Link
                  to="/blog/top-10-gravure-idols-2024"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.blogPost2")}
                </Link>
              </li>
            </ul>
          </nav>

          {genres.length > 0 ? (
            <nav aria-label={t("footer.genres")}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {t("footer.genres")}
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {genres.map((g) => (
                  <li key={g}>
                    <Link
                      to="/genre/$slug"
                      params={{ slug: g.toLowerCase() }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {g}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <nav aria-label="Quick Categories">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                Categories
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {["Japanese", "Korean", "Vietnamese", "Bikini", "Cosplay"].map((g) => (
                  <li key={g}>
                    <Link
                      to="/genre/$slug"
                      params={{ slug: g.toLowerCase() }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {g}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © <time dateTime={String(year)}>{year}</time> {SITE_NAME}. {t("footer.rights")}
          </p>
          <p className="inline-flex items-center gap-1.5">
            {t("footer.madeWith")} <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> {t("footer.byTeam")}{" "}
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" /> {SITE_NAME}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
