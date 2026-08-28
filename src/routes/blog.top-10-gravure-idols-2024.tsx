import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const PATH = "/blog/top-10-gravure-idols-2024";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Top 10 Most Popular Japanese Gravure Idols in 2024 (Definitive Ranking)";
const DESC =
  "The definitive 2024 ranking of the top 10 most popular Japanese gravure idols. Explore their career milestones, bestselling photobooks, signature aesthetic styles, and magazine covers.";
const PUBLISHED = "2026-06-22";

const IDOLS = [
  {
    rank: 1,
    name: "Yuka Ogura",
    nameJa: "小倉優香",
    born: "1998 · Chiba Prefecture",
    style: "Sensual, sophisticated, versatile editorial expression",
    bio: "Hailed as the 'Real Figure' queen upon her debut, Yuka Ogura captivated the gravure world with her flawless proportions and natural screen presence. After a brief hiatus, her triumphant return in 2024 dominated the covers of Weekly Playboy and FLASH, setting new benchmarks for mature, refined glamour.",
    highlight:
      "Headline cover star across multiple top weekly magazines in 2024, commanding record-breaking digital photobook downloads.",
    works: "Weekly Playboy, FLASH, solo photobooks 'Graduation' and digital specials",
  },
  {
    rank: 2,
    name: "Rio Teramoto",
    nameJa: "寺本莉緒",
    born: "2001 · Hiroshima Prefecture",
    style: "Youthful, energetic, vibrant sunshine smile",
    bio: "Rio Teramoto combines the irresistible charm of an energetic university student with breathtaking visual dynamism. A prominent theater actress and social media personality, Rio frequently headlines Young Magazine and Weekly Young Jump, bringing infectious positivity and athletic poise to every photo shoot.",
    highlight:
      "Overwhelming social media engagement and consecutive bestselling photobooks published by Kodansha.",
    works: "Young Magazine, Weekly Young Jump, official photobook 'CURIOSITY'",
  },
  {
    rank: 3,
    name: "Aika Sawaguchi",
    nameJa: "沢口愛華",
    born: "2003 · Aichi Prefecture",
    style: "Classic Japanese sweetheart, delicate elegance",
    bio: "As the historic winner of the prestigious Miss Magazine 2018 Grand Prix, Aika Sawaguchi has evolved into one of the most prolific gravure stars in modern publishing history. Known for her timeless, angelic features and classic Japanese beauty, she has appeared on over 100 magazine covers.",
    highlight:
      "Recognized as the 'Cover Girl Queen' with an unmatched record of consecutive appearances in national weekly publications.",
    works: "Miss Magazine, Weekly Playboy, Young Magazine, photobooks 'Graves' & 'Sawayaka'",
  },
  {
    rank: 4,
    name: "Marina Nagasawa",
    nameJa: "長澤茉里奈",
    born: "1995 · Saitama Prefecture",
    style: "Playful, ageless cuteness, resort lifestyle",
    bio: "Affectionately known to fans as 'Marichu', Marina Nagasawa is famous for her astonishingly youthful appearance and vibrant personality. A professional mahjong player, model, and internet star, Marina bridges traditional Japanese gravure with modern digital fandom and international convention appearances.",
    highlight:
      "A perennial global favorite celebrated for sold-out fan gatherings, cosplay photobooks, and crossover pop culture appeal.",
    works: "Weekly Playboy, Young Jump, official photobooks 'Babel' & 'Glow'",
  },
  {
    rank: 5,
    name: "Sayaka Tomaru",
    nameJa: "都丸紗也華",
    born: "1996 · Gunma Prefecture",
    style: "Glamorous, mature, iconic silhouette",
    bio: "Sayaka Tomaru has long been celebrated across East Asia as a golden standard of classic gravure modeling. Her editorial spreads in FLASH, Weekly Playboy, and Friday are revered for their cinematic lighting, European and tropical resort backdrops, and timeless allure.",
    highlight:
      "Sustained popularity over a decade, headlining major summer and winter special magazine issues across Japan.",
    works: "FLASH, Weekly Playboy, Friday, solo photobooks 'Tomaru-shiki' & 'Haru'",
  },
  {
    rank: 6,
    name: "Moe Kamikokuryo",
    nameJa: "上國料萌衣",
    born: "1999 · Kumamoto Prefecture",
    style: "Ethereal, crystal-clear idol beauty",
    bio: "As the leader of the celebrated Hello! Project idol group ANGERME, Moe Kamikokuryo seamlessly bridges live musical performance and high-fashion gravure. Her sparkling eyes, ethereal porcelain complexion, and refined charm have made her a beloved muse for both male and female audiences.",
    highlight:
      "Regularly featured in high-fashion and idol editorial magazines including Up to Boy and BIS.",
    works: "Up to Boy, Young Magazine, ANGERME visual books",
  },
  {
    rank: 7,
    name: "Riho Iida",
    nameJa: "飯田里穂",
    born: "1991 · Saitama Prefecture",
    style: "Sophisticated, confident, mature grace",
    bio: "Renowned globally as the voice behind beloved anime icons, Riho Iida entered the gravure arena with consummate poise and maturity. Her photobooks highlight elegant interior settings, moody evening portraiture, and confident femininity.",
    highlight:
      "Successfully established a bridge between the anime voice acting industry and high-end gravure publishing.",
    works: "Weekly Playboy, Young Animal, solo commemorative photobooks",
  },
  {
    rank: 8,
    name: "Nana Asakawa",
    nameJa: "浅川梨奈",
    born: "1999 · Saitama Prefecture",
    style: "Charismatic, expressive, crossover star",
    bio: "Initially dubbed the 'Once in a Thousand Years' gravure prodigy, Nana Asakawa has transitioned seamlessly into a mainstream film and television actress. Her gravure spreads are celebrated for their dramatic expressiveness and narrative depth.",
    highlight:
      "Star of numerous Japanese television dramas, maintaining an active and enthusiastic international following.",
    works: "Young Magazine, Up to Boy, photobooks 'Nana' & 'Natsu'",
  },
  {
    rank: 9,
    name: "Yuna Sekine",
    nameJa: "関根優那",
    born: "1994 · Saitama Prefecture",
    style: "Athletic, sun-kissed, radiant optimism",
    bio: "A former idol group member turned stage actress, Yuna Sekine captivates audiences with her sun-drenched beach shoots, athletic fitness, and signature dazzling smile. Her 2024 editorial sets in Okinawa and Hawaii generated massive buzz.",
    highlight:
      "Breakout digital sales metrics and strong engagement across Asian visual photography forums.",
    works: "Young Jump, Weekly Young Magazine, digital photobook collections",
  },
  {
    rank: 10,
    name: "Hinako Sano",
    nameJa: "佐野ひなこ",
    born: "1994 · Tokyo",
    style: "Chic, graceful, subtle Parisian glamour",
    bio: "Hinako Sano is a multifaceted model, television personality, and bestselling lifestyle author. Renowned for her incredible waistline aesthetics and refined style, Hinako's photobooks feature exquisite styling and international scenic shoots.",
    highlight:
      "A veteran icon who continues to set trends in beauty, wellness, and tasteful aesthetic portraiture.",
    works: "VoCE, anan, Weekly Playboy, anniversary photobook 'Evolution'",
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
          "top gravure idols 2024, japanese swimsuit models, famous gravure idols, gravure ranking 2024, yuka ogura, rio teramoto, aika sawaguchi, marina nagasawa, sayaka tomaru",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { property: "og:locale", content: "en_US" },
      { property: "article:published_time", content: PUBLISHED },
      { property: "article:modified_time", content: "2026-08-28T00:00:00.000Z" },
      {
        property: "article:tag",
        content:
          "gravure idol, Japanese models, swimsuit, Japanese magazines, photobooks, 2024 ranking",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "alternate", hrefLang: "en", href: URL },
      { rel: "alternate", hrefLang: "vi", href: URL },
      { rel: "alternate", hrefLang: "ja", href: URL },
      { rel: "alternate", hrefLang: "zh", href: URL },
      { rel: "alternate", hrefLang: "ko", href: URL },
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
          dateModified: "2026-08-28T00:00:00.000Z",
          inLanguage: "en-US",
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          articleSection: "Gravure Idols",
          keywords: "gravure idol, Japanese swimsuit models, top gravure idols 2024, ranking",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Top 10 Japanese Gravure Idols 2024",
          numberOfItems: IDOLS.length,
          itemListElement: IDOLS.map((i) => ({
            "@type": "ListItem",
            position: i.rank,
            name: `${i.nameJa} (${i.name})`,
            description: i.bio,
          })),
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
              name: "Who is the top gravure idol in 2024?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yuka Ogura leads the 2024 ranking following her historic comeback, dominating national magazine covers such as Weekly Playboy and FLASH alongside unprecedented digital photobook sales.",
              },
            },
            {
              "@type": "Question",
              name: "What criteria were used to determine the top 10 gravure idol rankings?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Rankings are based on a balanced analysis of magazine cover frequencies (Weekly Playboy, Young Magazine, Young Jump, FLASH, Friday), official photobook print and digital sales volumes, online engagement across Asia, and overall pop culture influence.",
              },
            },
            {
              "@type": "Question",
              name: "Where can I view high-definition photobooks of these models?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You can explore thousands of free, high-definition vertical-scroll photobook albums on GravureHub (gravurehub.me).",
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
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              2024 Annual Ranking
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Top 10 Most Popular Japanese Gravure Idols in 2024
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Updated: <time dateTime="2026-08-28">August 2026</time> · Author: {SITE_NAME}{" "}
              Editorial Team · Read time: ~10 min
            </p>
            <p className="lead mt-4">
              <strong>Japanese gravure idol culture</strong> experienced an extraordinary
              renaissance throughout 2024. Marked by triumphant comebacks from iconic superstars
              alongside a dynamic wave of breakout prodigies, the industry produced some of the most
              artistically celebrated photobooks of the modern era.
            </p>
          </header>

          <h2>Ranking Methodology &amp; Evaluation Criteria</h2>
          <p>
            Curating the top 10 gravure idols requires examining multifaceted metrics across
            Japan&apos;s publishing ecosystem:
          </p>
          <ul>
            <li>
              <strong>Magazine Cover Frequency:</strong> Regular appearances across premier weekly
              periodicals including <em>Weekly Playboy</em> (Shueisha), <em>Young Magazine</em>{" "}
              (Kodansha), <em>Weekly Young Jump</em>, <em>FLASH</em>, and <em>FRIDAY</em>.
            </li>
            <li>
              <strong>Commercial Photobook Sales:</strong> Certified print runs and verified digital
              sales figures on major e-book platforms.
            </li>
            <li>
              <strong>Digital &amp; Social Resonance:</strong> Engagement metrics across Twitter/X,
              Instagram, and international fan communities throughout East and Southeast Asia.
            </li>
            <li>
              <strong>Artistic Versatility:</strong> The ability to embody diverse concepts ranging
              from sunlit tropical beaches to moody, high-fashion urban aesthetics.
            </li>
          </ul>

          <hr className="my-8 border-border/60" />

          {/* Idols List */}
          {IDOLS.map((idol) => (
            <section
              key={idol.rank}
              id={`rank-${idol.rank}`}
              className="scroll-mt-24 my-8 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Rank #{idol.rank}
                  </span>
                  <h2 className="text-xl font-bold text-foreground mt-0.5">
                    {idol.nameJa} — {idol.name}
                  </h2>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Top {idol.rank}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Origin:</strong> {idol.born} · <strong>Signature Style:</strong>{" "}
                {idol.style}
              </p>
              <p className="text-sm leading-relaxed text-foreground/90 mt-3">{idol.bio}</p>
              <div className="mt-4 rounded-xl bg-secondary/30 p-3 text-xs space-y-1">
                <p>
                  <strong>2024 Highlight:</strong> {idol.highlight}
                </p>
                <p>
                  <strong>Signature Works:</strong> {idol.works}
                </p>
              </div>
            </section>
          ))}

          <h2>Key Trends Defining the Gravure Industry Today</h2>
          <p>Three overarching trends characterized the 2024 gravure season:</p>
          <ol>
            <li>
              <strong>Digital-First &amp; Vertical-Scroll Photobooks:</strong> Major publishers now
              release simultaneous digital-exclusive photobooks optimized for smartphone screens,
              reaching global fans instantly without geographic constraints.
            </li>
            <li>
              <strong>Crossover from Mainstream Idol Franchises:</strong> Active members of
              Nogizaka46, Sakurazaka46, AKB48, and Hello! Project routinely release solo gravure
              albums that rival mainstream commercial bestsellers.
            </li>
            <li>
              <strong>Cosplay &amp; Subculture Fusion:</strong> Professional cosplayers and virtual
              streamers have established massive presence in mainstream print media, broadening the
              demographic appeal of gravure.
            </li>
          </ol>

          <h2>Frequently Asked Questions (FAQ)</h2>
          <h3>Who is currently the most popular gravure idol in Japan?</h3>
          <p>
            Yuka Ogura and Rio Teramoto consistently top popularity rankings and digital download
            metrics due to their widespread media presence and versatile appeal.
          </p>
          <h3>How often are new photobooks released?</h3>
          <p>
            Top weekly magazines publish new issues every Monday and Friday in Japan, with dozens of
            digital photobook collections released monthly.
          </p>
          <h3>Where can I view high-definition gravure photobooks?</h3>
          <p>
            You can read thousands of high-definition gravure photobooks with smooth vertical
            scrolling for free on{" "}
            <Link to="/" className="text-primary hover:underline font-semibold">
              GravureHub
            </Link>
            . Check out our curated{" "}
            <Link to="/featured" className="text-primary hover:underline font-semibold">
              Featured Albums
            </Link>{" "}
            or learn more in our article on{" "}
            <Link
              to="/blog/gravure-idol-la-gi"
              className="text-primary hover:underline font-semibold"
            >
              What is a Gravure Idol?
            </Link>
            .
          </p>

          {/* Author Bio Box */}
          <div className="not-prose mt-10 flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
              GH
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">GravureHub Editorial Team</h4>
              <p className="text-xs text-muted-foreground">
                Providing expert rankings, cultural insights, and high-definition photobook archives
                for gravure enthusiasts worldwide.
              </p>
            </div>
          </div>

          {/* Related Articles */}
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
                  Complete history, definition, and culture breakdown.
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
                  Explore top-rated gravure photobooks updated daily.
                </span>
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
