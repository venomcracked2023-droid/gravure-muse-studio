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
      { name: "keywords", content: "gravure idol là gì, gravure là gì, gravure idol, người mẫu gravure, văn hoá gravure Nhật Bản" },
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
            { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
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
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <span>Blog</span>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Gravure idol là gì?</span>
        </nav>

        <article className="md-content mt-4">
          <header>
            <h1>Gravure idol là gì? Định nghĩa, lịch sử và văn hoá gravure</h1>
            <p className="text-sm text-muted-foreground">
              Cập nhật: <time dateTime={PUBLISHED}>09/06/2026</time> · GravureHub
            </p>
            <p className="lead">
              <strong>Gravure idol</strong> (グラビアアイドル, <em>gurabia aidoru</em>) là người mẫu Nhật Bản
              chuyên chụp ảnh tạp chí, photobook và DVD theo phong cách gợi cảm – thời trang, nhưng vẫn giữ
              hình ảnh trong sáng và không thuộc nội dung 18+. Bài viết này giải thích chi tiết
              <em> gravure là gì</em>, nguồn gốc tại Nhật Bản, sự khác biệt với idol nhóm nhạc, và cách trào lưu
              này lan rộng tại Việt Nam.
            </p>
          </header>

          <h2>1. Gravure là gì?</h2>
          <p>
            Thuật ngữ <strong>“gravure”</strong> bắt nguồn từ <em>photogravure</em> – kỹ thuật in ảnh trên giấy
            chất lượng cao được sử dụng phổ biến trong tạp chí Nhật Bản từ giữa thế kỷ 20. Theo thời gian,
            từ này được dùng để chỉ riêng <strong>thể loại ảnh người mẫu nữ mặc bikini, đồ bơi hoặc trang phục
            gợi cảm</strong> in trên các trang đầu của tạp chí giải trí. Khi internet phát triển, gravure mở
            rộng ra photobook, DVD/Blu-ray và các bộ ảnh số phát hành trực tuyến.
          </p>

          <h2>2. Gravure idol là gì?</h2>
          <p>
            <strong>Gravure idol</strong> là những người mẫu chuyên nghiệp lấy việc chụp ảnh gravure làm hoạt
            động chính. Họ thường được các công ty quản lý talent ký hợp đồng, xuất hiện đều đặn trên những
            tạp chí lớn như <em>Weekly Playboy</em>, <em>Young Magazine</em>, <em>Young Jump</em>,
            <em> FLASH</em> hay <em>Friday</em>. Một gravure idol điển hình có ba đặc trưng:
          </p>
          <ul>
            <li><strong>Hình ảnh khoẻ khoắn, tươi sáng</strong> – tập trung vào nụ cười, vóc dáng, ánh nắng và bãi biển.</li>
            <li><strong>Trang phục bikini hoặc đồ bơi</strong> – yếu tố nhận diện thương hiệu của thể loại này.</li>
            <li><strong>Không khoả thân</strong> – gravure được phát hành đại chúng, hoàn toàn khác với nội dung khiêu dâm (AV).</li>
          </ul>

          <h2>3. Lịch sử gravure tại Nhật Bản</h2>
          <p>
            Gravure idol bắt đầu hình thành từ <strong>cuối thập niên 1960</strong> với những “bikini idol”
            đầu tiên xuất hiện trên Weekly Playboy. Đến <strong>thập niên 1980–1990</strong>, gravure trở
            thành ngành công nghiệp riêng nhờ sự bùng nổ của photobook (写真集 – <em>shashinshū</em>) và video
            ca nhạc kết hợp ảnh người mẫu. Những tên tuổi như Yoko Ishino, Rie Miyazawa, Yoko Mitsuya hay
            sau này là Sayumi Michishige, Ai Shinozaki, Yumi Sugimoto, Mai Shiraishi… đã giúp gravure trở
            thành một nhánh chính của văn hoá đại chúng Nhật Bản.
          </p>

          <h2>4. Phân biệt gravure idol với các thể loại khác</h2>
          <table>
            <thead>
              <tr><th>Thể loại</th><th>Hoạt động chính</th><th>Mức độ gợi cảm</th></tr>
            </thead>
            <tbody>
              <tr><td>Idol nhóm nhạc (AKB48, Nogizaka46…)</td><td>Ca hát, nhảy, biểu diễn</td><td>Trung tính</td></tr>
              <tr><td>Gravure idol</td><td>Chụp ảnh tạp chí, photobook, DVD</td><td>Bikini, đồ bơi – gợi cảm nhưng có chừng mực</td></tr>
              <tr><td>Race queen / Campaign girl</td><td>Mẫu sự kiện, đường đua</td><td>Gần với gravure</td></tr>
              <tr><td>AV idol</td><td>Phim người lớn</td><td>Nội dung 18+ – khác hoàn toàn gravure</td></tr>
            </tbody>
          </table>

          <h2>5. Văn hoá gravure tại Việt Nam</h2>
          <p>
            Từ khoảng <strong>2015 trở đi</strong>, làn sóng gravure du nhập Việt Nam thông qua các diễn đàn
            ảnh, fanpage Nhật Bản và xu hướng <em>“ảnh cuộn dọc”</em> trên điện thoại. Nhiều người mẫu Việt
            bắt đầu chụp theo phong cách gravure Nhật: bikini bãi biển, đồ bơi mùa hè, ánh sáng mềm và bố cục
            tạp chí. Cộng đồng người xem Việt thường tìm theo các từ khoá như:
          </p>
          <ul>
            <li><em>gravure idol là gì</em></li>
            <li><em>gravure là gì</em></li>
            <li><em>người mẫu gravure Việt Nam</em></li>
            <li><em>ảnh gravure cuộn dọc</em></li>
          </ul>
          <p>
            <strong>GravureHub</strong> là một trong những thư viện gravure cuộn dọc dành riêng cho người
            xem Việt – tuyển chọn album chất lượng cao, sắp xếp theo người mẫu và cập nhật mỗi ngày.
          </p>

          <h2>6. Câu hỏi thường gặp</h2>
          <h3>Gravure idol có phải nội dung 18+?</h3>
          <p>
            Không. Gravure thuộc nhánh ảnh thời trang – nghệ thuật gợi cảm, được phát hành công khai trên các
            tạp chí dành cho mọi lứa tuổi trưởng thành tại Nhật. Nội dung 18+ thuộc về <em>AV idol</em> – một
            ngành hoàn toàn riêng biệt.
          </p>
          <h3>Người mẫu gravure kiếm thu nhập từ đâu?</h3>
          <p>
            Chủ yếu từ nhuận ảnh tạp chí, doanh thu photobook, DVD, sự kiện bắt tay (handshake event), tài
            trợ thương hiệu và gần đây là nền tảng số như Instagram, OnlyFans phiên bản hợp pháp tại Nhật.
          </p>
          <h3>Làm sao để ngắm gravure chất lượng cao?</h3>
          <p>
            Bạn có thể xem album cuộn dọc miễn phí tại <Link to="/" className="text-primary hover:underline">GravureHub</Link>,
            hoặc khám phá danh sách <Link to="/featured" className="text-primary hover:underline">người mẫu nổi bật</Link> và
            các <Link to="/latest" className="text-primary hover:underline">album mới cập nhật</Link>.
          </p>

          <hr />
          <p className="text-sm text-muted-foreground">
            Bài viết được biên soạn bởi đội ngũ {SITE_NAME} nhằm cung cấp thông tin tham khảo về văn hoá
            gravure Nhật Bản và Việt Nam.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}