import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { FileText, ShieldAlert, Scale, Copyright, AlertTriangle, ChevronRight, Home } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => {
    const title = `Terms of Service — ${SITE_NAME}`;
    const desc =
      "Terms and conditions of use for GravureHub (duahaumanga.com). Copyright disclosures, 18+ content disclaimer, user conduct, and DMCA procedures.";
    const url = `${SITE_URL}/terms`;
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
        { rel: "alternate", hrefLang: "vi", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "x-default", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Điều khoản dịch vụ", item: url },
            ],
          }),
        },
      ],
    };
  },
});

function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">Terms of Service</span>
        </nav>

        <div className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur sm:p-10">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Terms of Service
              </h1>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Last updated: June 2026 · Official Terms for GravureHub (duahaumanga.com)
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <FileText className="h-5 w-5 text-primary" /> 1. Acceptance of Terms
              </h2>
              <p className="mt-2">
                By accessing or browsing <strong>{SITE_NAME}</strong> (accessible via the domain{" "}
                <code className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">
                  duahaumanga.com
                </code>
                ), you agree to be bound by these Terms of Service, all applicable laws, and
                regulations. If you do not agree with any of these terms, you are prohibited from
                using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <AlertTriangle className="h-5 w-5 text-primary" /> 2. Age Requirement & Content Notice (18+)
              </h2>
              <p className="mt-2">
                GravureHub curates artistic gravure photography, fashion photobooks, and model visual
                sets from Asian models (Japan, Korea, Vietnam, etc.). This content is intended
                strictly for users aged <strong>18 and older</strong> (or the age of majority in your
                jurisdiction). All models featured on this platform are consenting adults of legal age
                at the time of production.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Copyright className="h-5 w-5 text-primary" /> 3. Intellectual Property & DMCA Procedure
              </h2>
              <p className="mt-2">
                All model photos, magazine spreads, and photobooks are the intellectual property of
                their respective photographers, publishers, production agencies, and models. GravureHub
                acts as a curation index and vertical-scroll viewer for promotional and appreciation
                purposes.
              </p>
              <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm">
                <strong className="text-foreground">DMCA / Copyright Takedown Notice:</strong>
                <p className="mt-1">
                  If you are a copyright owner or an authorized agent and believe that any content
                  hosted or linked on this site infringes upon your copyright, please contact us
                  immediately with detailed evidence via our{" "}
                  <Link to="/contact" className="text-primary underline">
                    Contact page
                  </Link>{" "}
                  or Telegram{" "}
                  <a
                    href="https://t.me/+8xnMvFtjulkyNzE1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    @GravureHubSupport
                  </a>
                  . We commit to removing any infringing material within 24–48 hours upon receipt of a
                  valid notice.
                </p>
              </div>
            </section>

            <section>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <ShieldAlert className="h-5 w-5 text-primary" /> 4. User Conduct & Community Guidelines
              </h2>
              <p className="mt-2">When utilizing comments, ratings, and account features on GravureHub, you agree NOT to:</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs sm:text-sm">
                <li>Post defamatory, abusive, harassing, or hate-speech comments targeting models or other users.</li>
                <li>Attempt to bypass security measures, scrape content excessively, or disrupt server infrastructure.</li>
                <li>Post unsolicited commercial messages (spam), phishing links, or malicious code.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Disclaimer of Warranties</h2>
              <p className="mt-2">
                The materials on GravureHub are provided on an "as is" and "as available" basis. GravureHub
                makes no warranties, expressed or implied, regarding uptime, accuracy, or uninterrupted
                access.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. Modifications to Terms</h2>
              <p className="mt-2">
                GravureHub reserves the right to revise these Terms of Service at any time without prior
                notice. By using this website, you agree to be bound by the current version of these Terms.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
