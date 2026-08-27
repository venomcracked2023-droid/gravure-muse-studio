import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { Check, Star, Zap, Shield, Sparkles, ChevronRight, Home, Gem, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => {
    const title = `Pricing & VIP Photobooks — ${SITE_NAME}`;
    const desc =
      "Browse GravureHub's 100% free photo albums or unlock exclusive high-resolution VIP photobooks with instant crypto payments.";
    const url = `${SITE_URL}/pricing`;
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
        { rel: "alternate", hrefLang: "vi", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "VIP Pricing", item: url },
            ],
          }),
        },
      ],
    };
  },
});

function PricingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">Pricing & VIP Access</span>
        </nav>

        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Transparent & Flexible Access
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Free Browsing & Exclusive VIP Sets
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Enjoy thousands of vertical-scroll gravure photos completely free, or support creators by
            unlocking exclusive high-res photobooks.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Free Tier */}
          <div className="relative rounded-3xl border border-border bg-card/50 p-8 backdrop-blur sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Free Community Access</h2>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Free Forever
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-foreground">$0</span>
                <span className="text-sm text-muted-foreground">/ forever</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Unlimited access to our standard library of Asian gravure models.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-foreground/90 sm:text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Full vertical-scroll reading experience
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> High-definition image resolution
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Leave comments & star ratings
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Search models by tags and nationality
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Zero intrusive popup ads
                </li>
              </ul>
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-secondary/80 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              Start Browsing Now
            </Link>
          </div>

          {/* Premium VIP Set */}
          <div className="relative rounded-3xl border border-primary/50 bg-gradient-to-b from-card/80 via-primary/5 to-card/80 p-8 shadow-glow backdrop-blur sm:p-10 flex flex-col justify-between">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
            <div>
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                  <Gem className="h-5 w-5 text-primary" /> Premium VIP Photobooks
                </h2>
                <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                  Pay-per-Album
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-gradient-brand">From ~2 USDT</span>
                <span className="text-sm text-muted-foreground">/ album</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                One-time unlock for exclusive, full-resolution photobook releases.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-foreground/90 sm:text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Ultra HD / Original raw quality
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Instant automated crypto payment (Plisio gateway)
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Permanent access tied to your account
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Embedded exclusive video previews
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 shrink-0 text-primary" /> Directly support model curation & platform costs
                </li>
              </ul>
            </div>

            <Link
              to="/featured"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Featured Albums <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-border bg-card/40 p-6 backdrop-blur sm:p-8">
          <h3 className="text-base font-bold text-foreground sm:text-lg">Frequently Asked Questions</h3>
          <dl className="mt-4 space-y-4 text-xs sm:text-sm">
            <div>
              <dt className="font-semibold text-foreground">Do I need to pay a monthly subscription?</dt>
              <dd className="mt-1 text-muted-foreground">
                No! Most photobooks on GravureHub are 100% free. Any special VIP sets are available on
                a one-time payment basis with no recurring fees.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">What payment methods are supported?</dt>
              <dd className="mt-1 text-muted-foreground">
                We accept USDT, BTC, ETH, and popular cryptocurrencies through the secure Plisio payment
                gateway.
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
