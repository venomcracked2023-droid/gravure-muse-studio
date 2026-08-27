import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const PATH = "/blog/gravure-idol-la-gi";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "What is a Gravure Idol? Definition, History & Gravure Culture Explained";
const DESC =
  "What is a gravure idol? Explore the origins in Japan, differences from mainstream idols, aesthetic photobooks, and the modern vertical-scroll photography culture.";
const PUBLISHED = "2026-06-09";

export const Route = createFileRoute("/blog/gravure-idol-la-gi")({
  component: Page,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "what is a gravure idol, gravure idol definition, japanese gravure models, gravure photobooks, japanese idol culture, vertical scroll gravure",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "article:published_time", content: PUBLISHED },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "en", href: URL },
      { rel: "alternate", hrefLang: "vi", href: URL },
      { rel: "alternate", hrefLang: "x-default", href: URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
            { "@type": "ListItem", position: 3, name: TITLE, item: URL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESC,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          inLanguage: "en-US",
          mainEntityOfPage: URL,
          image: `${SITE_URL}/og-default.jpg`,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is a gravure idol?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "A gravure idol (グラビアアイドル) is a Japanese model who primarily models for magazines, photobooks, and visual media in swimsuits, casual wear, or lingerie with an emphasis on natural beauty, charisma, and soft glamour without explicit or adult content.",
              },
            },
            {
              "@type": "Question",
              name: "How is a gravure idol different from regular musical idols?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Musical idols primarily focus on singing, dancing, and stage performances, whereas gravure idols specialize in photography, printed photobooks, and digital pictorials.",
              },
            },
            {
              "@type": "Question",
              name: "Is gravure considered explicit adult content (18+)?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Gravure is a mainstream genre of sensual artistic and fashion portraiture published openly in mainstream national magazines like Weekly Playboy and Young Magazine, distinct from explicit adult entertainment.",
              },
            },
          ],
        }),
      },
    ],
  }),
});

function Page() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-6">
        {/* Visual Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-muted-foreground">Blog</span>
          <span>&gt;</span>
          <span className="font-medium text-foreground">What is a Gravure Idol?</span>
        </nav>

        <article className="md-content">
          <header className="not-prose mb-8 border-b border-border/60 pb-6">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Culture &amp; Insights
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              What is a Gravure Idol? Definition, History &amp; the Allure of Gravure Culture
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Published: {PUBLISHED} · Author: {SITE_NAME} Editorial Team · Read time: ~5 min
            </p>
          </header>

          <p className="lead">
            If you have ever browsed Japanese photo collections, followed J-Pop idols, or come across
            the term <strong>gravure idol</strong> (グラビアアイドル) on social media, you might have wondered:{" "}
            <em>
              What exactly is gravure? Is it adult content? Why is it so immensely popular across Asia and worldwide?
            </em>
          </p>
          <p>
            This comprehensive guide explores the definition, historical origins, key differences between
            gravure and other entertainment industries, and why vertical-scroll photography is revolutionizing
            how fans enjoy gravure photobooks today.
          </p>

          <h2>1. Definition: What is a Gravure Idol?</h2>
          <p>
            The word <strong>"gravure"</strong> originates from the printing technique <em>rotogravure</em>—a
            high-fidelity intaglio photo printing process utilized by Japanese weekly magazines in the mid-20th
            century. Over time, the term shifted in popular Japanese culture to refer to glossy pictorial centerfolds
            and model photo spreads.
          </p>
          <p>
            A <strong>gravure idol (グラビアアイドル, gurabia aidoru)</strong> is a model who specializes in posing
            for popular entertainment magazines, digital photobooks, and image videos. Common themes feature
            swimwear (bikinis), fashionable lingerie, cosplay outfits, or cozy loungewear in picturesque settings
            such as tropical beaches, luxury resorts, and aesthetic indoor studios.
          </p>
          <p>
            <strong>Core Distinction:</strong> Gravure idols <em>do not pose nude</em> and{" "}
            <em>do not participate in explicit adult videos</em>. Gravure is centered on soft glamour, radiant smiles,
            artistic body aesthetics, and approachable girl-next-door charm.
          </p>

          <h2>2. Origins & Historical Evolution in Japan</h2>
          <p>
            The modern gravure phenomenon took shape in the 1970s and 1980s when prominent Japanese men's and youth magazines—such as{" "}
            <em>Weekly Playboy</em> (週刊プレイボーイ), <em>Weekly Young Jump</em>, and <em>Young Magazine</em>—began
            featuring swimsuit models on their covers and color insert pages to boost readership.
          </p>
          <ul>
            <li>
              <strong>1980s–1990s:</strong> The golden era of "swimsuit queens" (水着クイーン), where top models became household names and television celebrities.
            </li>
            <li>
              <strong>2000s:</strong> Gravure cemented itself as a prestigious stepping stone into mainstream entertainment, launching the careers of numerous renowned actresses, TV show hosts, and voice actors.
            </li>
            <li>
              <strong>2010s to Present:</strong> Strong synergy between musical idol groups (such as AKB48 Group and Sakamichi Series) and gravure publications, alongside digital photobooks optimized for mobile screens.
            </li>
          </ul>

          <h2>3. Key Differences: Gravure vs. Other Entertainment Genres</h2>
          <ul>
            <li>
              <strong>Gravure Idols vs. Musical Idols:</strong> Musical idols primarily perform live songs and dance choreography, while gravure idols focus primarily on high-fashion photo shoots and visual curation.
            </li>
            <li>
              <strong>Gravure Idols vs. High-Fashion Models:</strong> High-fashion models emphasize runway couture and designer garments for female audiences; gravure models focus on natural charisma, sensual beauty, and accessible charm.
            </li>
            <li>
              <strong>Gravure Idols vs. Adult Entertainment:</strong> These are completely distinct industries. Gravure idols appear on national television, mainstream billboards, and family-friendly press.
            </li>
          </ul>

          <h2>4. Popular Gravure Formats & Media</h2>
          <ul>
            <li>
              <strong>Weekly &amp; Monthly Magazines</strong>: Featured cover models, glossy centerfold spreads, and exclusive promotional posters.
            </li>
            <li>
              <strong>Deluxe Photobooks</strong>: Premium hardcover art books captured by celebrated professional photographers.
            </li>
            <li>
              <strong>Digital Photobooks &amp; Vertical Scroll</strong>: Modern high-definition digital sets tailored for smooth, immersive smartphone reading.
            </li>
          </ul>

          <h2>5. The Global Rise of Gravure & Vertical Scroll Experience</h2>
          <p>
            Worldwide appreciation for Asian aesthetic photography continues to expand. Fans value high production standards, delicate lighting, and natural visual storytelling.
          </p>
          <p>
            <strong>GravureHub</strong> elevates this experience by providing an uninterrupted, vertical-scrolling reader featuring high-definition photobooks from Japanese, Korean, and Vietnamese models.
          </p>

          <h2>6. Frequently Asked Questions (FAQ)</h2>
          <h3>Is gravure considered 18+ explicit content?</h3>
          <p>
            No. Gravure belongs to the soft glamour and artistic fashion photography sphere and is sold openly in mainstream bookstores throughout Japan and Asia.
          </p>
          <h3>Where can I view high-definition gravure albums?</h3>
          <p>
            You can browse curated collections on our{" "}
            <Link to="/featured" className="text-primary hover:underline">
              Featured Albums
            </Link>{" "}
            or check out the newest updates in{" "}
            <Link to="/latest" className="text-primary hover:underline">
              Latest Updates
            </Link>{" "}
            on GravureHub.
          </p>

          {/* Author Bio Box */}
          <div className="not-prose mt-10 flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
              GH
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">GravureHub Editorial Team</h4>
              <p className="text-xs text-muted-foreground">
                Curating free, high-definition vertical-scroll gravure photobooks and model profiles since 2024.
              </p>
            </div>
          </div>

          {/* Related Articles & Internal Links */}
          <div className="not-prose mt-8 border-t border-border pt-6">
            <h3 className="text-base font-semibold text-foreground">
              Related Articles &amp; Collections
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Link
                to="/blog/top-10-gravure-idols-2024"
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card/40 p-4 transition hover:border-primary/60 hover:bg-card"
              >
                <span className="text-xs font-semibold text-primary group-hover:underline">
                  Top 10 Gravure Idols in 2024 →
                </span>
                <span className="text-xs text-muted-foreground">
                  The definitive ranking of the top 10 most influential gravure models in Japan.
                </span>
              </Link>
              <Link
                to="/featured"
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card/40 p-4 transition hover:border-primary/60 hover:bg-card"
              >
                <span className="text-xs font-semibold text-primary group-hover:underline">
                  Featured Albums →
                </span>
                <span className="text-xs text-muted-foreground">
                  Explore high-definition gravure albums updated daily.
                </span>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
