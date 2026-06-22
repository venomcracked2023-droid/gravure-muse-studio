import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const PATH = "/blog/top-10-gravure-idols-2024";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Top 10 gravure idol Nhật Bản nổi bật nhất 2024";
const DESC =
  "Bảng xếp hạng 10 gravure idol Nhật Bản hot nhất 2024. Khám phá nhan sắc, phong cách và những tạp chí, photobook đình đám của các người mẫu áo tắm hàng đầu.";
const PUBLISHED = "2026-06-22";

const IDOLS = [
  {
    rank: 1,
    name: "Ogura Yuka",
    nameJa: "小倉優香",
    born: "1998",
    style: "Gợi cảm, trưởng thành, biểu cảm đa dạng",
    highlight:
      "Trở lại đường đua gravure mạnh mẽ sau thời gian vắng bóng, liên tục xuất hiện trên các tạp chí lớn như Weekly Playboy và FLASH.",
    works: "Weekly Playboy, FLASH, photobook cá nhân",
  },
  {
    rank: 2,
    name: "Teramoto Rio",
    nameJa: "寺本莉緒",
    born: "2001",
    style: "Tươi trẻ, năng động, nụ cười rạng rỡ",
    highlight:
      "Nữ sinh viên kiêm người mẫu trẻ có sức hút mạnh trên mạng xã hội, được giới trẻ Nhật Bản yêu thích nhờ hình ảnh trong sáng nhưng vẫn quyến rũ.",
    works: "Young Magazine, Weekly Young Jump",
  },
  {
    rank: 3,
    name: "Sawaguchi Aika",
    nameJa: "沢口愛華",
    born: "2002",
    style: "Ngọt ngào, nữ tính, thân hình cân đối",
    highlight:
      "Từng đoạt giải Miss Magazine và là một trong những gương mặt đắt show nhất làng gravure với lịch xuất bản dày đặc.",
    works: "Miss Magazine, Weekly Playboy, Young Magazine",
  },
  {
    rank: 4,
    name: "Nagasawa Marina",
    nameJa: "長澤茉里奈",
    born: "1995",
    style: "Dễ thương, năng động, phong cách bikini bãi biển",
    highlight:
      "Gắn bó lâu dài với làng gravure, luôn duy trì độ phủ sóng ổn định trên các tạp chí và sự kiện handshake.",
    works: "Weekly Playboy, Young Jump, photobook",
  },
  {
    rank: 5,
    name: "Tomaru Sayaka",
    nameJa: "都丸紗也華",
    born: "1996",
    style: "Quyến rũ, trưởng thành, tỷ lệ cơ thể ấn tượng",
    highlight:
      "Nổi tiếng với những bộ bikini gợi cảm, thường xuyên lọt top tìm kiếm trên các diễn đàn gravure châu Á.",
    works: "FLASH, Weekly Playboy, Friday",
  },
  {
    rank: 6,
    name: "Kamikokuryo Moe",
    nameJa: "上國料萌衣",
    born: "1999",
    style: "Thần tượng xinh đẹp, nụ cười tỏa nắng",
    highlight:
      "Thành viên ANGERME (Hello! Project) song song hoạt động người mẫu gravure, thu hút fan nhờ vẻ ngoài thân thiện.",
    works: "Up to Boy, Young Magazine",
  },
  {
    rank: 7,
    name: "Iida Riho",
    nameJa: "飯田里穂",
    born: "1991",
    style: "Sang trọng, tự tin, gợi cảm có chừng mực",
    highlight:
      "Ca sĩ/lồng tiếng chuyển hướng gravure thành công, mang đến hình ảnh phụ nữ trưởng thành đầy cuốn hút.",
    works: "Weekly Playboy, Young Animal",
  },
  {
    rank: 8,
    name: "Asakawa Nana",
    nameJa: "浅川梨奈",
    born: "1999",
    style: "Dễ thương, trong sáng, đa tài",
    highlight:
      "Cựu thành viên idoll độc lập chuyển sang gravure và diễn xuất, duy trì lượng fan trung thành qua nhiều năm.",
    works: "Young Magazine, Up to Boy",
  },
  {
    rank: 9,
    name: "Sekine Yuna",
    nameJa: "関根優那",
    born: "2000",
    style: "Tươi mới, nữ sinh, năng động",
    highlight:
      "Gương mặt mới nổi trong làng gravure với phong cách thời trang bãi biển và nụ cười tỏa nắng đặc trưng.",
    works: "Young Jump, Weekly Young Magazine",
  },
  {
    rank: 10,
    name: "Sano Hinako",
    nameJa: "佐野ひなこ",
    born: "1994",
    style: "Thời trang, thanh lịch, gợi cảm tinh tế",
    highlight:
      "Người mẫu/đầu bếp kiêm gravure idol, tạo dấu ấn nhờ hình ảnh đa diện và sách nấu ăn bán chạy.",
    works: "VoCE, anan, Weekly Playboy",
  },
];

export const Route = createFileRoute("/blog/top-10-gravure-idols-2024")({
  component: Page,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "top gravure idol 2024, người mẫu áo tắm nhật bản, gravure idol nổi tiếng, gravure idol là gì, bảng xếp hạng gravure idol" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: URL },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: PUBLISHED },
      { property: "article:modified_time", content: PUBLISHED },
      { property: "article:tag", content: "gravure idol, người mẫu Nhật Bản, bikini, tạp chí Nhật" },
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
          articleSection: "Gravure Idol",
          keywords: "gravure idol, người mẫu áo tắm Nhật Bản, top gravure idol 2024",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Top 10 gravure idol Nhật Bản 2024",
          itemListElement: IDOLS.map((i) => ({
            "@type": "ListItem",
            position: i.rank,
            name: `${i.nameJa} (${i.name})`,
            description: i.highlight,
          })),
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
              { "@type": "ListItem", position: 3, name: "Top 10 gravure idol 2024", item: URL },
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
          <Link to="/blog/gravure-idol-la-gi" className="hover:text-primary">Blog</Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Top 10 gravure idol 2024</span>
        </nav>

        <article className="md-content mt-4">
          <header>
            <h1>Top 10 gravure idol Nhật Bản nổi bật nhất 2024</h1>
            <p className="text-sm text-muted-foreground">
              Cập nhật: <time dateTime={PUBLISHED}>22/06/2026</time> · GravureHub
            </p>
            <p className="lead">
              <strong>Gravure idol</strong> luôn là chủ đề thu hút đông đảo người hâm mộ văn hoá Nhật Bản. Năm 2024
              chứng kiến sự trở lại của nhiều tên tuổi kỳ cựu lẫn sự bùng nổ của các gương mặt trẻ. Bài viết này tổng hợp
              <strong> top 10 gravure idol Nhật Bản nổi bật nhất 2024</strong>, dựa trên độ phủ sóng tạp chí, doanh số
              photobook và mức độ tương tác trên mạng xã hội — dành cho những ai đang tìm kiếm
              <em> người mẫu áo tắm Nhật Bản</em> hay đơn giản là muốn khám phá thêm về <em>gravure idol</em>.
            </p>
          </header>

          <h2>Tiêu chí xếp hạng</h2>
          <p>
            Bảng xếp hạng dưới đây không chỉ dựa vào nhan sắc mà còn xem xét các yếu tố: số lần xuất hiện trên tạp chí
            lớn (Weekly Playboy, Young Magazine, Young Jump, FLASH, Friday), doanh thu photobook/DVD, lượt tìm kiếm trên
            Google và mạng xã hội Nhật Bản, cũng như sức ảnh hưởng đến cộng đồng fan gravure quốc tế.
          </p>

          {IDOLS.map((idol) => (
            <section key={idol.rank} id={`rank-${idol.rank}`} className="scroll-mt-24">
              <h2>
                {idol.rank}. {idol.nameJa} — {idol.name}
              </h2>
              <p>
                <strong>Sinh năm:</strong> {idol.born} · <strong>Phong cách:</strong> {idol.style}
              </p>
              <p>{idol.highlight}</p>
              <p>
                <strong>Tác phẩm tiêu biểu:</strong> {idol.works}.
              </p>
            </section>
          ))}

          <h2>Tại sao bảng xếp hạng này quan trọng với người xem Việt Nam?</h2>
          <p>
            Cộng đồng yêu thích gravure tại Việt Nam ngày càng lớn. Nhiều người tìm kiếm từ khoá như
            <em> gravure idol là gì</em>, <em>người mẫu áo tắm Nhật Bản</em>, hay <em>top gravure idol</em> để khám phá
            những gương mặt mới. Bảng xếp hạng trên giúp bạn nhanh chóng nắm bắt xu hướng gravure 2024 và tìm được
            người mẫu phù hợp với gu thẩm mỹ của mình.
          </p>

          <h2>Câu hỏi thường gặp</h2>
          <h3>Top gravure idol 2024 có thay đổi nhiều so với 2023 không?</h3>
          <p>
            Có. Năm 2024 đánh dấu sự trở lại của Ogura Yuka và sự vươn lên của các gương mặt trẻ như Teramoto Rio và
            Sekine Yuna, trong khi các tên tuổi kỳ cựu như Nagasawa Marina và Tomaru Sayaka vẫn giữ vững phong độ.
          </p>

          <h3>Làm sao để xem ảnh gravure chất lượng cao?</h3>
          <p>
            Bạn có thể khám phá album cuộn dọc miễn phí tại{" "}
            <Link to="/" className="text-primary hover:underline">GravureHub</Link>, hoặc tìm đọc thêm bài giải thích{" "}
            <Link to="/blog/gravure-idol-la-gi" className="text-primary hover:underline">gravure idol là gì</Link> để
            hiểu rõ hơn về thể loại này.
          </p>

          <hr />
          <p className="text-sm text-muted-foreground">
            Bài viết được biên soạn bởi đội ngũ {SITE_NAME} nhằm cung cấp thông tin tham khảo về các gravure idol nổi
            bật tại Nhật Bản. Xếp hạng mang tính chủ quan dựa trên dữ liệu công khai và có thể thay đổi theo thời gian.
          </p>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
