import Link from "next/link";
import Image from "next/image";

interface Post {
  id:           string;
  cover_image?: string | null;
  title:        string;
  slug:         string;
  excerpt:      string | null;
  category:     string;
  author:       string;
  published_at: string | null;
}

const CAT_LABEL: Record<string, string> = {
  news:  "Tin tức",
  guide: "Cẩm nang",
  food:  "Ẩm thực",
  event: "Sự kiện",
};

function formatViDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export default function BlogSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Blog & Cẩm Nang
            </p>
            <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-normal italic
                           leading-[1.06] tracking-[0.04em] text-gray-950">
              Khám Phá Trường Sơn
            </h2>
            <p className="mt-3 text-[15px] font-light leading-[2] text-gray-400">
              Tin tức mới nhất, hướng dẫn du lịch và câu chuyện từ Sơn Kiều.
            </p>
          </div>
          <Link href="/blog"
            className="inline-flex flex-shrink-0 items-center gap-2 border border-[#052e16]/20
                       px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em]
                       text-gray-700 transition hover:border-[#052e16] hover:text-[#052e16]"
            style={{ borderRadius: 0 }}>
            Xem Tất Cả <ArrowRight />
          </Link>
        </div>

        {/* Featured + side grid */}
        <div className="grid gap-px bg-gray-100 lg:grid-cols-5">

          {/* Featured — 3 cols */}
          <Link href={`/blog/${featured.slug}`}
            className="group flex flex-col overflow-hidden bg-white lg:col-span-3">

            {/* Cover */}
            <div className="relative h-80 overflow-hidden bg-[#052e16]">
              {featured.cover_image && (
                <Image src={featured.cover_image} alt={featured.title} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/70 via-[#052e16]/10 to-transparent" />

              {/* Featured badge */}
              <div className="absolute left-5 top-5">
                <span className="border border-white/25 bg-white/10 px-3 py-1
                                 text-[9px] font-bold uppercase tracking-[0.2em]
                                 text-white backdrop-blur-sm">
                  Bài nổi bật
                </span>
              </div>

              {/* Cat + date */}
              <div className="absolute bottom-5 left-5 flex items-center gap-3">
                <span className="border border-white/20 bg-white/10 px-2.5 py-0.5
                                 text-[9px] font-bold uppercase tracking-[0.18em]
                                 text-white backdrop-blur-sm">
                  {CAT_LABEL[featured.category] ?? featured.category}
                </span>
                {featured.published_at && (
                  <span className="text-[11px] text-white/60">
                    {formatViDate(featured.published_at)}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-7">
              <h3 className="font-display text-[22px] font-normal italic leading-snug
                             tracking-[0.03em] text-gray-950 transition-colors
                             group-hover:text-[#16a34a] line-clamp-2">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-gray-400 line-clamp-2">
                  {featured.excerpt}
                </p>
              )}
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                <p className="text-[12px] text-gray-400">{featured.author}</p>
                <span className="flex items-center gap-1.5 text-[11px] font-bold
                                 uppercase tracking-[0.18em] text-[#16a34a] transition
                                 group-hover:gap-2.5">
                  Đọc bài <ArrowRight />
                </span>
              </div>
            </div>
          </Link>

          {/* Side cards — 2 cols stacked */}
          <div className="flex flex-col gap-px bg-gray-100 lg:col-span-2">
            {rest.slice(0, 3).map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group flex overflow-hidden bg-white transition-colors hover:bg-gray-50">

                {/* Thumbnail */}
                <div className="relative w-28 shrink-0 overflow-hidden bg-[#052e16]">
                  {post.cover_image && (
                    <Image src={post.cover_image} alt={post.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="112px" />
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#22c55e]">
                        {CAT_LABEL[post.category] ?? post.category}
                      </span>
                    </div>
                    <h3 className="font-display text-[14px] font-normal italic leading-snug
                                   tracking-[0.03em] text-gray-900
                                   transition-colors group-hover:text-[#16a34a] line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[11px] text-gray-400">{post.author}</p>
                    {post.published_at && (
                      <p className="text-[10px] text-gray-300">
                        {new Date(post.published_at).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <Link href="/blog"
            className="inline-flex items-center gap-2.5 border border-gray-200
                       px-7 py-3 text-[11px] font-bold uppercase tracking-[0.2em]
                       text-gray-600 transition hover:border-[#052e16] hover:text-[#052e16]"
            style={{ borderRadius: 0 }}>
            Đọc Thêm Bài Viết <ArrowRight />
          </Link>
          <p className="text-[11px] uppercase tracking-[0.14em] text-gray-300">
            Cập nhật hàng tuần · Miễn phí đọc
          </p>
        </div>
      </div>
    </section>
  );
}
