import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_URL, SITE_BRAND_FULL } from "@/lib/seo";
import {
  ShieldAlert,
  Mail,
  FileCheck,
  Clock,
  AlertTriangle,
  ChevronRight,
  Home,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/dmca")({
  component: DmcaPage,
  head: () => {
    const title = `DMCA Copyright Policy & Takedown Notices — ${SITE_NAME}`;
    const desc =
      "DMCA Copyright Policy, intellectual property rights, and designated copyright agent contact for GravureHub (duahaumanga.com).";
    const url = `${SITE_URL}/dmca`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
      ],
      links: [
        { rel: "canonical", href: url },
        { rel: "alternate", hrefLang: "en", href: url },
        { rel: "alternate", hrefLang: "vi", href: url },
        { rel: "alternate", hrefLang: "ja", href: url },
        { rel: "alternate", hrefLang: "zh", href: url },
        { rel: "alternate", hrefLang: "ko", href: url },
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
              { "@type": "ListItem", position: 2, name: "DMCA Policy", item: url },
            ],
          }),
        },
      ],
    };
  },
});

function DmcaPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-semibold text-foreground">DMCA Copyright Policy</span>
        </nav>

        <header className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <ShieldAlert className="h-3.5 w-3.5" /> Intellectual Property Protection
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            DMCA Copyright Notice &amp; Takedown Policy
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            GravureHub ({SITE_BRAND_FULL}) respects the intellectual property rights of creators,
            photographers, publishers, and models.
          </p>
        </header>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
          <section className="rounded-3xl border border-border/80 bg-card/50 p-6 backdrop-blur sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground sm:text-xl">
              <FileCheck className="h-5 w-5 text-primary" /> 1. Overview &amp; Safe Harbor
              Compliance
            </h2>
            <p className="mt-3 text-muted-foreground">
              GravureHub operates as an online content indexer and viewing platform in compliance
              with the Digital Millennium Copyright Act (17 U.S.C. § 512, "DMCA"). It is our policy
              to respond expeditiously to clear, valid notices of alleged copyright infringement in
              accordance with applicable intellectual property laws.
            </p>
            <p className="mt-2 text-muted-foreground">
              If you believe that your copyrighted work has been copied, linked, or made accessible
              on GravureHub in a manner that constitutes copyright infringement, please submit a
              formal DMCA notification to our designated copyright agent below.
            </p>
          </section>

          <section className="rounded-3xl border border-primary/30 bg-primary/5 p-6 backdrop-blur sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-primary sm:text-xl">
              <Mail className="h-5 w-5" /> 2. Designated Copyright Agent Contact
            </h2>
            <p className="mt-3 text-muted-foreground">
              All DMCA notices, counter-notices, and copyright inquiries should be directed to our
              designated agent:
            </p>
            <div className="mt-4 rounded-2xl border border-border bg-card/80 p-4 font-mono text-xs sm:text-sm space-y-1 text-foreground">
              <div>
                <strong>Designated Agent:</strong> GravureHub Copyright Compliance Team
              </div>
              <div>
                <strong>Website:</strong> duahaumanga.com
              </div>
              <div>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:contact@duahaumanga.com"
                  className="text-primary underline hover:text-primary/80"
                >
                  contact@duahaumanga.com
                </a>
              </div>
              <div>
                <strong>Telegram Support:</strong>{" "}
                <a
                  href="https://t.me/+8xnMvFtjulkyNzE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80"
                >
                  @duahaumanga_support
                </a>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border/80 bg-card/50 p-6 backdrop-blur sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground sm:text-xl">
              <CheckCircle2 className="h-5 w-5 text-primary" /> 3. Required Information for DMCA
              Notices
            </h2>
            <p className="mt-3 text-muted-foreground">
              To be effective under 17 U.S.C. § 512(c)(3), your notification must be in writing and
              contain substantially the following:
            </p>
            <ol className="mt-4 space-y-2 list-decimal pl-5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Identification of the copyrighted work</strong>{" "}
                claimed to have been infringed, or a representative list of such works.
              </li>
              <li>
                <strong className="text-foreground">Identification of the material</strong> that is
                claimed to be infringing, including the specific URL(s) on duahaumanga.com so we can
                locate the item expeditiously.
              </li>
              <li>
                <strong className="text-foreground">Contact information</strong> of the complaining
                party (name, address, telephone number, and email address).
              </li>
              <li>
                <strong className="text-foreground">A statement of good faith belief</strong> that
                use of the material in the manner complained of is not authorized by the copyright
                owner, its agent, or the law.
              </li>
              <li>
                <strong className="text-foreground">A statement of accuracy</strong> under penalty
                of perjury, that the information in the notification is accurate, and that you are
                authorized to act on behalf of the owner of the exclusive right that is allegedly
                infringed.
              </li>
              <li>
                <strong className="text-foreground">A physical or electronic signature</strong> of a
                person authorized to act on behalf of the copyright owner.
              </li>
            </ol>
          </section>

          <section className="rounded-3xl border border-border/80 bg-card/50 p-6 backdrop-blur sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground sm:text-xl">
              <Clock className="h-5 w-5 text-primary" /> 4. Response Time &amp; Takedown Procedure
            </h2>
            <p className="mt-3 text-muted-foreground">
              Upon receiving a bona fide notification complying with the requirements above,
              GravureHub will:
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5 text-xs sm:text-sm text-muted-foreground">
              <li>Review the notice within 24–48 business hours.</li>
              <li>Remove or disable access to the infringing material promptly.</li>
              <li>Notify the content provider/uploader regarding the removal.</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-border/80 bg-card/50 p-6 backdrop-blur sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground sm:text-xl">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> 5. Counter-Notification &amp;
              Repeat Infringers
            </h2>
            <p className="mt-3 text-muted-foreground">
              If a content provider believes the material was removed by mistake or
              misidentification, they may file a counter-notification pursuant to 17 U.S.C. §
              512(g)(3).
            </p>
            <p className="mt-2 text-muted-foreground">
              GravureHub maintains a strict repeat infringer policy and will terminate or block
              access for repeat copyright offenders under appropriate circumstances.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition"
          >
            ← Return to GravureHub Home
          </Link>
        </div>
      </main>
    </div>
  );
}
