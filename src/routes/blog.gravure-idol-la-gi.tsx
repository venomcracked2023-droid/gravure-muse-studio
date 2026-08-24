import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const PATH = "/blog/gravure-idol-la-gi";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Gravure idol là gì? Định nghĩa, lịch sử & văn hoá gravure";
const DESC =
  "Gravure idol là gì? Tìm hiểu định nghĩa, nguồn gốc tại Nhật Bản, sự khác biệt với idol thông thường và sức ảnh hưởng của văn hoá gravure tại Việt Nam.";
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
          "gravure idol là gì, gravure là gì, gravure idol, người mẫu gravure, văn hoá gravure Nhật Bản",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: PUBLISHED },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESC,
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          inLanguage: "vi-VN",
          mainEntityOfPage: URL,
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
              name: "Gravure idol là gì?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Gravure idol (グラビアアイドル) là người mẫu Nhật Bản chuyên chụp ảnh tạp chí, photobook và DVD theo phong cách gợi cảm nhưng vẫn giữ hình ảnh trong sáng, không khoả thân.",
              },
            },
            {
              "@type": "Question",
              name: "Gravure khác gì idol thông thường?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Idol nhóm nhạc tập trung vào ca hát, nhảy và biểu diễn sân khấu, còn gravure idol lấy ảnh chụp – đặc biệt là bikini và trang phục nhẹ – làm hoạt động chính.",
              },
            },
            {
              "@type": "Question",
              name: "Gravure idol có phải nội dung 18+ không?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Không. Gravure thuộc dòng ảnh nghệ thuật – thời trang gợi cảm, được phát hành công khai trên các tạp chí phổ thông như Weekly Playboy hay Young Magazine và hoàn toàn khác với nội dung khiêu dâm.",
              },
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: `${SITE_URL}/blog/gravure-idol-la-gi`,
            },
            { "@type": "ListItem", position: 3, name: "Gravure idol là gì?", item: URL },
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
        {/* Visual Breadcrumb (Task 16) */}
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
          <span className="font-medium text-foreground">Gravure idol là gì?</span>
        </nav>

        <article className="md-content">
          <header className="not-prose mb-8 border-b border-border/60 pb-6">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Kiến thức &amp; Văn hoá
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Gravure idol là gì? Định nghĩa, lịch sử &amp; sức hút của văn hoá gravure
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Xuất bản: {PUBLISHED} · Tác giả: {SITE_NAME} Editorial Team · Thời gian đọc: ~5 phút
            </p>
          </header>

          <p className="lead">
            Nếu bạn từng lướt các trang ảnh Nhật Bản, theo dõi idol J-Pop hay đơn giản là bắt gặp
            cụm từ <strong>gravure idol</strong> (グラビアアイドル) trên mạng xã hội, bạn có thể đã
            tự hỏi:{" "}
            <em>
              Gravure thực chất là gì? Có phải là nội dung người lớn không? Tại sao lại phổ biến đến
              vậy?
            </em>
          </p>
          <p>
            Bài viết này sẽ giải thích toàn diện từ khái niệm, nguồn gốc lịch sử, sự khác nhau giữa
            gravure idol và idol thông thường, cho đến lý do hình thức này đang dần được đón nhận
            rộng rãi tại Việt Nam.
          </p>

          <h2>1. Định nghĩa: Gravure idol là gì?</h2>
          <p>
            Từ <strong>"gravure"</strong> bắt nguồn từ kỹ thuật in ấn <em>rotogravure</em> (in ống
            đồng) – một công nghệ in ảnh chất lượng cao từng được các tạp chí Nhật Bản sử dụng vào
            giữa thế kỷ 20. Theo thời gian, từ ngữ này chuyển nghĩa để chỉ những bức ảnh người mẫu
            được in trang trọng ở đầu hoặc giữa các tạp chí (trang màu glossy).
          </p>
          <p>
            <strong>Gravure idol (グラビアアイドル)</strong> là thuật ngữ chỉ những người mẫu nữ
            chuyên chụp ảnh cho các tạp chí giải trí, phát hành photobook (sách ảnh) và DVD hình
            ảnh. Phong cách đặc trưng của họ là diện bikini, đồ lót thời trang, trang phục cosplay
            hoặc đồ ngủ trong các khung cảnh tự nhiên (bãi biển, resort, phòng ngủ).
          </p>
          <p>
            <strong>Điểm cốt lõi:</strong> Gravure idol <em>không chụp ảnh khoả thân</em> và{" "}
            <em>không tham gia nội dung khiêu dâm</em>. Đây là dòng ảnh nghệ thuật gợi cảm nhẹ nhàng
            (soft glamour), tôn vinh nét đẹp hình thể, nụ cười và thần thái cuốn hút của người phụ
            nữ.
          </p>

          <h2>2. Nguồn gốc và lịch sử phát triển tại Nhật Bản</h2>
          <p>
            Văn hoá gravure bắt đầu định hình từ những năm 1970–1980 khi các tạp chí nam giới như{" "}
            <em>Weekly Playboy</em> (週刊プレイボーイ), <em>Weekly Young Jump</em> hay{" "}
            <em>Young Magazine</em> bắt đầu đưa ảnh người mẫu áo tắm lên trang bìa để thu hút độc
            giả.
          </p>
          <ul>
            <li>
              <strong>Thập niên 1980–1990:</strong> Giai đoạn bùng nổ của các "nữ hoàng áo tắm"
              (swimsuit queens). Nhiều gương mặt trở thành ngôi sao quốc dân.
            </li>
            <li>
              <strong>Thập niên 2000:</strong> Gravure trở thành bệ phóng sự nghiệp (stepping stone)
              quan trọng. Rất nhiều diễn viên, MC và ca sĩ nổi tiếng xuất thân từ gravure idol.
            </li>
            <li>
              <strong>Từ 2010 đến nay:</strong> Sự giao thoa mạnh mẽ giữa thế giới idol âm nhạc (như
              AKB48 Group, Sakamichi Series) và gravure. Các thành viên nhóm nhạc thường xuyên chụp
              gravure để tăng độ nhận diện cá nhân.
            </li>
          </ul>

          <h2>3. Sự khác nhau giữa Gravure Idol và các hình thức khác</h2>
          <ul>
            <li>
              <strong>Gravure idol vs. Idol âm nhạc:</strong> Idol âm nhạc tập trung ca hát và biểu
              diễn, còn gravure idol lấy hình ảnh photobook làm trọng tâm.
            </li>
            <li>
              <strong>Gravure idol vs. Người mẫu thời trang (Fashion model):</strong> Người mẫu thời
              trang hướng tới khán giả nữ và trang phục thương hiệu; gravure idol hướng tới thẩm mỹ
              gợi cảm, nét đẹp tự nhiên và cảm xúc gần gũi.
            </li>
            <li>
              <strong>Gravure idol vs. Diễn viên AV:</strong> Đây là hai ngành công nghiệp hoàn toàn
              tách biệt. Gravure idol xuất hiện trên truyền hình quốc gia và tạp chí đại chúng.
            </li>
          </ul>

          <h2>4. Các hình thức phát hành gravure phổ biến</h2>
          <ul>
            <li>
              <strong>Tạp chí tuần san / nguyệt san</strong>: Trang màu trung tâm và trang bìa.
            </li>
            <li>
              <strong>Photobook (Sách ảnh)</strong>: Tuyển tập ảnh nghệ thuật cao cấp, in ấn sắc
              nét.
            </li>
            <li>
              <strong>Digital Photobook (E-book) &amp; Cuộn dọc</strong>: Định dạng số tối ưu cho
              smartphone, hỗ trợ cuộn ảnh mượt mà.
            </li>
          </ul>

          <h2>5. Văn hoá Gravure tại Việt Nam &amp; Xu hướng cuộn dọc</h2>
          <p>
            Tại Việt Nam, sự quan tâm đến ảnh gravure nghệ thuật ngày càng gia tăng. Người xem hướng
            đến những bộ ảnh chỉn chu, góc máy thẩm mỹ và phong cách tôn vinh vẻ đẹp tự nhiên.
          </p>
          <p>
            <strong>GravureHub</strong> mang đến trải nghiệm cuộn dọc không giới hạn, tổng hợp các
            bộ ảnh gravure chất lượng cao từ người mẫu Hàn Quốc, Nhật Bản và Việt Nam.
          </p>

          <h2>6. Câu hỏi thường gặp (FAQ)</h2>
          <h3>Gravure idol có phải nội dung 18+?</h3>
          <p>
            Không. Gravure thuộc nhánh ảnh thời trang – nghệ thuật gợi cảm, được phát hành công khai
            trên các tạp chí chính thống tại Nhật.
          </p>
          <h3>Làm sao để xem ảnh gravure chất lượng cao?</h3>
          <p>
            Bạn có thể duyệt qua danh mục{" "}
            <Link to="/featured" className="text-primary hover:underline">
              Featured Albums
            </Link>{" "}
            hoặc{" "}
            <Link to="/latest" className="text-primary hover:underline">
              Latest Updates
            </Link>{" "}
            tại GravureHub.
          </p>

          {/* Author Bio Box (Task 13) */}
          <div className="not-prose mt-10 flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
              GH
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">GravureHub Editorial Team</h4>
              <p className="text-xs text-muted-foreground">
                Curating free, high-definition vertical-scroll gravure photo sets and model profiles
                since 2024.
              </p>
            </div>
          </div>

          {/* Related Articles & Internal Links (Task 13 & 14) */}
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
                  Top 10 gravure idol 2024 →
                </span>
                <span className="text-xs text-muted-foreground">
                  Bảng xếp hạng 10 người mẫu gravure nổi bật nhất tại Nhật Bản.
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
                  Khám phá các album ảnh gravure chất lượng cao cập nhật liên tục.
                </span>
              </Link>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
