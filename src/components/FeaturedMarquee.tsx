import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { ComicCover } from "@/components/ComicCover";
import { buildSlugId } from "@/lib/slug";
import type { Comic } from "@/lib/comics-store";
import { useI18n } from "@/lib/i18n/context";

type Props = { items: Comic[]; speedSec?: number };

export function FeaturedMarquee({ items, speedSec = 40 }: Props) {
  const { t } = useI18n();
  if (items.length === 0) return null;
  // duplicate the list so the translateX(-50%) loop is seamless
  const loop = [...items, ...items];
  return (
    <div
      className="group/marquee relative overflow-hidden"
      style={{ maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)" }}
      aria-label={t("section.featured")}
    >
      <ul
        className="flex w-max gap-4 py-2 animate-marquee-x group-hover/marquee:[animation-play-state:paused]"
        style={{ animationDuration: `${speedSec}s` }}
      >
        {loop.map((c, i) => (
          <li key={`${c.id}-${i}`} className="w-[160px] shrink-0 sm:w-[180px] md:w-[200px]">
            <Link
              to="/comic/$comicId"
              params={{ comicId: buildSlugId(c.title, c.id) }}
              className="group flex flex-col gap-2"
              aria-hidden={i >= items.length ? true : undefined}
              tabIndex={i >= items.length ? -1 : undefined}
            >
              <div className="hover-lift relative aspect-[3/4] overflow-hidden rounded-xl border border-primary/40 bg-card shadow-lg">
                <ComicCover id={c.coverId} title={c.title} className="transition duration-500 group-hover:scale-110" />
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  <Star className="h-3 w-3 fill-current" /> {t("section.featured")}
                </span>
              </div>
              <div>
                <h3 className="line-clamp-1 text-sm font-semibold group-hover:text-primary">{c.title}</h3>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {c.chapters.length} {t("card.albums")} · {c.author || t("card.anonymous")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}