import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { ShieldCheck, Lock, Eye, Database, Cookie, UserCheck, ChevronRight, Home } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => {
    const title = `Privacy Policy — ${SITE_NAME}`;
    const desc =
      "Privacy policy for GravureHub (duahaumanga.com). Details on data collection, Google Analytics (GA4), authentication security, cookie policy, and user rights.";
    const url = `${SITE_URL}/privacy`;
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
              { "@type": "ListItem", position: 2, name: "Privacy Policy", item: url },
            ],
          }),
        },
      ],
    };
  },
});

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">Privacy Policy</span>
        </nav>

        <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur sm:p-10">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Privacy Policy
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Effective Date: June 2026 · Transparency for GravureHub (duahaumanga.com)
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Eye className="h-5 w-5 text-primary" /> 1. Information We Collect
              </h2>
              <p className="mt-2">
                We value your privacy. We collect minimal information necessary to deliver a fast,
                seamless vertical-scroll photobook experience:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs sm:text-sm">
                <li>
                  <strong>Account Information:</strong> When you register or sign in with Google or
                  email, we store your email address, display name, and avatar URL securely in our
                  Supabase authentication database. We never receive or store your raw password.
                </li>
                <li>
                  <strong>Interaction Data:</strong> Comments, ratings, bookmarked albums, and creator
                  application status associated with your user ID.
                </li>
                <li>
                  <strong>Technical & Analytics Data:</strong> Anonymous metrics such as browser type,
                  device screen resolution, pages viewed, and approximate geographic region collected via
                  Google Analytics 4 (<code className="rounded bg-secondary px-1 text-xs">G-DYPBMB9T0P</code>).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Database className="h-5 w-5 text-primary" /> 2. How We Use Your Data
              </h2>
              <p className="mt-2">Your information is used strictly to:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs sm:text-sm">
                <li>Enable user authentication, account management, and profile customization.</li>
                <li>Allow interactive features like commenting, submitting ratings, and creating albums.</li>
                <li>Monitor performance, optimize image loading speed, and prevent abusive bot behavior.</li>
                <li>We do NOT sell, rent, or trade your personal information to third-party marketers.</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Cookie className="h-5 w-5 text-primary" /> 3. Cookies & Local Storage
              </h2>
              <p className="mt-2">
                GravureHub utilizes local browser storage and session cookies exclusively for:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs sm:text-sm">
                <li>Preserving your authenticated login session.</li>
                <li>Saving your preferred UI language (<code className="rounded bg-secondary px-1 text-xs">gh.lang</code>).</li>
                <li>Maintaining reading position and scroll state across album pages.</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Lock className="h-5 w-5 text-primary" /> 4. Security & Infrastructure
              </h2>
              <p className="mt-2">
                All communications between your browser and our servers are encrypted with modern
                TLS 1.3 / HTTPS certificates provided by Google Trust Services. Cloudflare CDN provides
                DDoS protection, enterprise-grade edge caching, and strict security headers.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <UserCheck className="h-5 w-5 text-primary" /> 5. Your Rights (Access & Deletion)
              </h2>
              <p className="mt-2">
                Under GDPR, CCPA, and international data privacy regulations, you have the right to
                request access to, correction of, or permanent deletion of your account and personal data.
                To request data deletion, reach out via our{" "}
                <Link to="/contact" className="text-primary underline">
                  Contact page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
