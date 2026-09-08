import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import {
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  Home,
  ArrowRight,
  Sparkles,
  Tag,
} from "lucide-react";

export const BLOG_POSTS = [
  {
    slug: "gravure-idol-la-gi",
    title: "What is a Gravure Idol? Comprehensive Definition, History & Culture Guide",
    desc: "Discover the origins, artistic aesthetics, top Japanese magazine publishers, career pathways, and the modern vertical-scroll photobook revolution in this definitive guide.",
    category: "Culture & History",
    date: "2026-06-09",
    readTime: "8 min read",
    author: "Editorial Team",
    image: `${SITE_URL}/og-default.jpg`,
    tags: ["Idol Culture", "Japan", "Photobooks", "History"],
  },
  {
    slug: "top-10-gravure-idols-2024",
    title: "Top 10 Most Popular Japanese Gravure Idols in 2024 (Rankings & Profiles)",
    desc: "Comprehensive ranking of the most sought-after Japanese gravure idols, cover stars, top photobook releases, and where to read their high-definition albums online.",
    category: "Rankings",
    date: "2026-06-22",
    readTime: "10 min read",
    author: "Editorial Team",
    image: `${SITE_URL}/og-default.jpg`,
    tags: ["Rankings", "Top Idols", "Weekly Playboy", "Young Magazine"],
  },
];

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
  head: () => {
    const title = `Gravure Guides & Editorial Articles — ${SITE_NAME}`;
    const desc =
      "In-depth articles, historical guides, ranking roundups, and culture analysis on Japanese and Asian gravure idol photobooks.";
    const url = `${SITE_URL}/blog`;
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
              { "@type": "ListItem", position: 2, name: "Blog", item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "GravureHub Blog & Articles",
            description: desc,
            url,
            numberOfItems: BLOG_POSTS.length,
            itemListElement: BLOG_POSTS.map((post, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/blog/${post.slug}`,
              name: post.title,
            })),
          }),
        },
      ],
    };
  },
});

function BlogIndexPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
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
          <span className="font-semibold text-foreground">Blog &amp; Articles</span>
        </nav>

        <header className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <BookOpen className="h-3.5 w-3.5" /> Editorial &amp; Insights
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            GravureHub Guides &amp; Articles
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore comprehensive guides, culture deep-dives, top idol rankings, and photography
            analyses curated by our editorial team.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col justify-between rounded-3xl border border-border/80 bg-card/50 p-6 backdrop-blur transition hover:border-primary/60 hover:bg-card/80 hover:shadow-lg sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-semibold text-primary">
                    <Sparkles className="h-3 w-3" /> {post.category}
                  </span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {post.readTime}
                    </span>
                  </div>
                </div>

                <h2 className="mt-4 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                  <Link to={`/blog/${post.slug}` as any}>{post.title}</Link>
                </h2>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {post.desc}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      <Tag className="h-2.5 w-2.5 text-primary" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">By {post.author}</span>
                <Link
                  to={`/blog/${post.slug}` as any}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:translate-x-1"
                >
                  Read Full Article <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14 rounded-3xl border border-primary/20 bg-gradient-to-r from-card/80 via-primary/5 to-card/80 p-6 sm:p-8 backdrop-blur text-center">
          <h2 className="text-lg font-bold text-foreground sm:text-xl">
            Looking for models and photobooks?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Explore our main library of high-definition vertical-scroll photobooks updated daily.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-full bg-gradient-brand px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition hover:scale-105"
            >
              Browse Model Library →
            </Link>
            <Link
              to="/featured"
              className="rounded-full border border-border bg-background/60 px-6 py-2.5 text-xs font-semibold text-foreground backdrop-blur hover:bg-secondary transition"
            >
              Featured Albums
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
