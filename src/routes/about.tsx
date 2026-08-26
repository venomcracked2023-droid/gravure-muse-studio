import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { Sparkles, Heart, Globe, Layers, BookOpen, ChevronRight, Home, Shield, Users } from "lucide-react";
import gravureLogo from "@/assets/gravure-logo.png";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => {
    const title = `About GravureHub — Free Vertical-Scroll Gravure Photo Library`;
    const desc =
      "Learn about GravureHub (duahaumanga.com) — a dedicated, high-definition vertical-scroll photobook library celebrating the aesthetics of Asian gravure models.";
    const url = `${SITE_URL}/about`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
    };
  },
});

function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">About GravureHub</span>
        </nav>

        <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur sm:p-10">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <img
              src={gravureLogo}
              alt="GravureHub Logo"
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl border border-primary/30 bg-primary/10 p-2 object-contain"
            />
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Our Mission & Vision
              </span>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                About GravureHub
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Curating the finest vertical-scroll gravure photobooks across Asia
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Globe className="h-5 w-5 text-primary" /> What is GravureHub?
              </h2>
              <p className="mt-2">
                <strong>GravureHub</strong> is a digital curation platform and reading experience
                crafted for fans of gravure aesthetics, fashion portraits, and artistic model
                photobooks. We showcase high-definition albums from top Japanese gravure idols, trendy
                Korean lookbook models, and elegant Vietnamese muses with a clean, vertical-scroll
                interface that looks breathtaking on both smartphones and desktop monitors.
              </p>
            </section>

            {/* Brand and Domain Explanation (Fix 8) */}
            <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-foreground/90">
              <h3 className="flex items-center gap-2 text-base font-semibold text-primary">
                <Layers className="h-4 w-4" /> Domain & Brand Notice (duahaumanga.com)
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                The domain <strong className="text-foreground">duahaumanga.com</strong> serves as the
                official web address and hosting domain for <strong>GravureHub</strong>. While the
                domain originates from our media studio foundation, the site is 100% focused on
                delivering premium gravure photo albums, model profiles, and photobook collections.
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="mt-2 font-semibold text-foreground">Vertical Scroll</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Zero lag, smooth continuous scrolling optimized for mobile web browsing.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="mt-2 font-semibold text-foreground">100% Free Access</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Browse hundreds of curated albums freely without paywalls or intrusive ads.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="mt-2 font-semibold text-foreground">Consenting Adults</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  All models featured are verified adults (18+) with artistic and commercial rights.
                </p>
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Users className="h-5 w-5 text-primary" /> Community & Contributors
              </h2>
              <p className="mt-2">
                GravureHub is powered by a community of passionate curators and contributors. We
                regularly update new albums, translate model profiles, and celebrate the artistry of
                gravure photography.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition hover:scale-105"
                >
                  Apply as Contributor
                </Link>
                <a
                  href="https://t.me/+8xnMvFtjulkyNzE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2.5 text-xs font-semibold text-foreground transition hover:bg-secondary"
                >
                  Join Telegram Community
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
