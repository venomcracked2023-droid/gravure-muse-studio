import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const PATH = "/blog/top-10-gravure-idols-2024";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Top 10 Most Popular Japanese Gravure Idols in 2024";
const DESC =
  "The definitive ranking of the top 10 most popular Japanese gravure idols in 2024. Discover their styles, highlights, bestselling photobooks, and magazine covers.";
const PUBLISHED = "2026-06-22";

const IDOLS = [
  {
    rank: 1,
    name: "Ogura Yuka",
    nameJa: "小倉優香",
    born: "1998",
    style: "Sensual, sophisticated, versatile facial expressions",
    highlight:
      "Made a triumphant return to the gravure spotlight, frequently headlining prominent Japanese weekly covers such as Weekly Playboy and FLASH.",
    works: "Weekly Playboy, FLASH, solo photobooks",
  },
  {
    rank: 2,
    name: "Teramoto Rio",
    nameJa: "寺本莉緒",
    born: "2001",
    style: "Youthful, energetic, radiant smile",
    highlight:
      "A fast-rising talent and university student widely celebrated on social media for her infectious positive energy and captivating pictorials.",
    works: "Young Magazine, Weekly Young Jump",
  },
  {
    rank: 3,
    name: "Sawaguchi Aika",
    nameJa: "沢口愛華",
    born: "2002",
    style: "Sweet, feminine, perfectly balanced aesthetics",
    highlight:
      "Former Miss Magazine Grand Prix winner who remains one of the most prolific gravure models in Japan with consecutive magazine covers.",
    works: "Miss Magazine, Weekly Playboy, Young Magazine",
  },
  {
    rank: 4,
    name: "Nagasawa Marina",
    nameJa: "長澤茉里奈",
    born: "1995",
    style: "Cute, playful, beachside resort aesthetics",
    highlight:
      "A perennial fan favorite renowned for her youthful look and active engagement across fan conventions and handshake gatherings.",
    works: "Weekly Playboy, Young Jump, official photobooks",
  },
  {
    rank: 5,
    name: "Tomaru Sayaka",
    nameJa: "都丸紗也華",
    born: "1996",
    style: "Glamorous, mature, iconic proportions",
    highlight:
      "Celebrated across Asian fan communities for her breathtaking photo shoots and regular appearances in top weekly publications.",
    works: "FLASH, Weekly Playboy, Friday",
  },
  {
    rank: 6,
    name: "Kamikokuryo Moe",
    nameJa: "上國料萌衣",
    born: "1999",
    style: "Ethereal idol beauty, sparkling smile",
    highlight:
      "ANGERME (Hello! Project) idol who seamlessly blends live musical performances with acclaimed gravure modeling.",
    works: "Up to Boy, Young Magazine",
  },
  {
    rank: 7,
    name: "Iida Riho",
    nameJa: "飯田里穂",
    born: "1991",
    style: "Elegant, confident, mature grace",
    highlight:
      "Accomplished voice actress and singer who transitioned into gravure with refined elegance and mature charm.",
    works: "Weekly Playboy, Young Animal",
  },
  {
    rank: 8,
    name: "Asakawa Nana",
    nameJa: "浅川梨奈",
    born: "1999",
    style: "Charming, charismatic, multi-talented",
    highlight:
      "Former musical idol turned successful actress and model, sustaining an enthusiastic international fanbase.",
    works: "Young Magazine, Up to Boy",
  },
  {
    rank: 9,
    name: "Sekine Yuna",
    nameJa: "関根優那",
    born: "2000",
    style: "Fresh, vibrant, athletic beach charm",
    highlight:
      "Breakout model making waves with sun-kissed beach editorials and signature cheerful smiles.",
    works: "Young Jump, Weekly Young Magazine",
  },
  {
    rank: 10,
    name: "Sano Hinako",
    nameJa: "佐野ひなこ",
    born: "1994",
    style: "Chic, graceful, subtle sensuality",
    highlight:
      "Model, actress, and bestselling cookbook author admired for her versatile lifestyle image and timeless photobooks.",
    works: "VoCE, anan, Weekly Playboy",
  },
];

export const Route = createFileRoute("/blog/top-10-gravure-idols-2024")({
  component: Page,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "top gravure idols 2024, japanese swimsuit models, famous gravure idols, gravure ranking 2024, ogura yuka, teramoto rio, sawaguchi aika",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "article:published_time", content: PUBLISHED },
      { property: "article:modified_time", content: PUBLISHED },
      {
        property: "article:tag",
        content: "gravure idol, Japanese models, swimsuit, Japanese magazines, photobooks",
      },
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
          image: `${SITE_URL}/og-default.jpg`,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          inLanguage: "en-US",
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          articleSection: "Gravure Idols",
          keywords: "gravure idol, Japanese swimsuit models, top gravure idols 2024",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Top 10 Japanese Gravure Idols 2024",
          itemListElement: IDOLS.map((i) => ({
            "@type": "ListItem",
            position: i.rank,
            name: `${i.nameJa} (${i.name})`,
            description: i.highlight,
          })),
        }),
      },
    ],
  }),
});

function Page() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link to="/blog/gravure-idol-la-gi" className="hover:text-primary">
            Blog
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Top 10 Gravure Idols 2024</span>
        </nav>

        <article className="md-content mt-4">
          <header>
            <h1>Top 10 Most Popular Japanese Gravure Idols in 2024</h1>
            <p className="text-sm text-muted-foreground">
              Updated: <time dateTime={PUBLISHED}>June 22, 2026</time> · GravureHub Editorial Team
            </p>
            <p className="lead">
              <strong>Gravure idol culture</strong> continues to captivate millions of fans worldwide.
              The year 2024 has seen legendary stars making high-profile comebacks alongside a dynamic
              influx of fresh, youthful talent. This ranking compiles the{" "}
              <strong>top 10 most influential Japanese gravure idols of 2024</strong> based on magazine cover
              frequencies, photobook sales volume, and digital engagement.
            </p>
          </header>

          <h2>Ranking Methodology &amp; Criteria</h2>
          <p>
            Our ranking evaluates multiple holistic factors beyond visual appeal: magazine cover frequency
            in top publications (Weekly Playboy, Young Magazine, Young Jump, FLASH, Friday), photobook and digital
            album sales metrics, online search trends across Asia, and overall cultural resonance among the global
            gravure community.
          </p>

          {IDOLS.map((idol) => (
            <section key={idol.rank} id={`rank-${idol.rank}`} className="scroll-mt-24">
              <h2>
                #{idol.rank}. {idol.nameJa} — {idol.name}
              </h2>
              <p>
                <strong>Born:</strong> {idol.born} · <strong>Style:</strong> {idol.style}
              </p>
              <p>{idol.highlight}</p>
              <p>
                <strong>Notable Works:</strong> {idol.works}.
              </p>
            </section>
          ))}

          <h2>The Growing Global Appeal of Gravure</h2>
          <p>
            With digital high-definition formats and modern reading platforms, gravure is now appreciated by an
            international audience that values natural aesthetics, fine-art lighting, and genuine charisma. Whether
            you are a long-time enthusiast or just exploring the genre, this list highlights the icons shaping the
            industry today.
          </p>

          <h2>Frequently Asked Questions</h2>
          <h3>How has the gravure idol scene shifted recently?</h3>
          <p>
            Recent years have seen greater cross-pollination between musical idol groups, mainstream voice acting,
            and digital photobooks, allowing models to reach global audiences faster than ever before.
          </p>

          <h3>Where can I view high-resolution gravure photo albums?</h3>
          <p>
            You can explore thousands of vertical-scrolling albums for free on{" "}
            <Link to="/" className="text-primary hover:underline">
              GravureHub
            </Link>
            , or read our in-depth guide on{" "}
            <Link to="/blog/gravure-idol-la-gi" className="text-primary hover:underline">
              what is a gravure idol
            </Link>{" "}
            to learn more.
          </p>

          {/* Author Bio Box */}
          <div className="not-prose mt-10 flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
              GH
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">GravureHub Editorial Team</h4>
              <p className="text-xs text-muted-foreground">
                Curating free, high-definition vertical-scroll gravure photo sets and model profiles since 2024.
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
                to="/blog/gravure-idol-la-gi"
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card/40 p-4 transition hover:border-primary/60 hover:bg-card"
              >
                <span className="text-xs font-semibold text-primary group-hover:underline">
                  What is a Gravure Idol? →
                </span>
                <span className="text-xs text-muted-foreground">
                  Origins, history, and key differences in gravure culture.
                </span>
              </Link>
              <Link
                to="/featured"
                className="group flex flex-col gap-1 rounded-xl border border-border bg-card/40 p-4 transition hover:border-primary/60 hover:bg-card"
              >
                <span className="text-xs font-semibold text-primary group-hover:underline">
                  Featured Albums Collection →
                </span>
                <span className="text-xs text-muted-foreground">
                  Explore curated high-definition photobooks on GravureHub.
                </span>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
