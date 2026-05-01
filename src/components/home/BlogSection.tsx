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

const CAT_META: Record<string, { label: string; color: string; bg: string }> = {
  news:  { label: "Tin tức",  color: "text-blue-700",   bg: "bg-blue-50"   },
  guide: { label: "Cẩm nang", color: "text-violet-700", bg: "bg-violet-50" },
  food:  { label: "Ẩm thực",  color: "text-orange-700", bg: "bg-orange-50" },
  event: { label: "Sự kiện",  color: "text-rose-700",   bg: "bg-rose-50"   },
};

const CAT_GRADIENT: Record<string, string> = {
  news:  "from-blue-700  to-blue-950",
  guide: "from-violet-700 to-violet-950",
  food:  "from-orange-700 to-orange-950",
  event: "from-rose-700   to-rose-950",
};

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function formatViDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogSection({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(180deg,#f8fafc 0%,#f1f5f9 60%,#f8fafc 100%)" }}>

      {/* Top/bottom accent lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle,#bfdbfe,transparent 70%)" }} />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl opacity-15"
        style={{ background: "radial-gradient(circle,#c7d2fe,transparent 70%)" }} />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">

        {/* ── Header ── */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              Blog &amp; Cẩm nang
            </p>
            <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
              Khám Phá{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Trường Sơn
              </span>
            </h2>
            <p className="mt-2 text-[15px] text-gray-500">
              Tin tức mới nhất, hướng dẫn du lịch và câu chuyện từ Sơn Kiều.
            </p>
          </div>
          <Link href="/blog"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full
                       border border-emerald-200 bg-white px-4 py-2 text-[13px]
                       font-semibold text-emerald-700 shadow-sm transition
                       hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800">
            Xem tất cả <ArrowRight />
          </Link>
        </div>

        {/* ── Featured + side grid ── */}
        <div className="grid gap-5 lg:grid-cols-5">

          {/* Featured — 3 cols */}
          <Link href={`/blog/${featured.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl bg-white
                       shadow-[0_2px_20px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]
                       transition-all duration-300 hover:-translate-y-1.5
                       hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] lg:col-span-3">

            {/* Cover */}
            <div className={`relative h-60 bg-gradient-to-br
              ${CAT_GRADIENT[featured.category] ?? "from-emerald-700 to-emerald-950"} overflow-hidden`}>
              {featured.cover_image && (
                <Image src={featured.cover_image} alt={featured.title} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Featured badge */}
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20
                                 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm
                                 ring-1 ring-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Bài nổi bật
                </span>
              </div>

              {/* Category + date at bottom */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="rounded-full bg-white/15 px-2.5 py-0.5
                                 text-[11px] font-bold text-white backdrop-blur-sm">
                  {CAT_META[featured.category]?.label ?? featured.category}
                </span>
                {featured.published_at && (
                  <span className="text-[11px] text-white/70">
                    {formatViDate(featured.published_at)}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-[20px] font-black leading-snug text-gray-900
                             transition-colors group-hover:text-emerald-700 line-clamp-2">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-gray-500 line-clamp-2">
                  {featured.excerpt}
                </p>
              )}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[12px] text-gray-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full
                                  bg-gradient-to-br from-emerald-400 to-teal-500
                                  text-[11px] font-bold text-white shadow-sm">
                    {featured.author?.charAt(0).toUpperCase()}
                  </div>
                  {featured.author}
                </div>
                <span className="flex items-center gap-1 text-[13px] font-semibold
                                 text-emerald-600 transition group-hover:gap-2">
                  Đọc bài <ArrowRight />
                </span>
              </div>
            </div>
          </Link>

          {/* Side cards — 2 cols stacked */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {rest.slice(0, 3).map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group flex overflow-hidden rounded-2xl bg-white
                           shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]
                           transition-all duration-300 hover:-translate-y-0.5
                           hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:ring-emerald-200">

                {/* Thumbnail */}
                <div className={`relative w-28 shrink-0 bg-gradient-to-b
                  ${CAT_GRADIENT[post.category] ?? "from-emerald-700 to-emerald-950"} overflow-hidden`}>
                  {post.cover_image && (
                    <Image src={post.cover_image} alt={post.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="112px" />
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold
                        ${CAT_META[post.category]?.bg ?? "bg-gray-100"}
                        ${CAT_META[post.category]?.color ?? "text-gray-600"}`}>
                        {CAT_META[post.category]?.label ?? post.category}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-bold leading-snug text-gray-900
                                   transition-colors group-hover:text-emerald-700 line-clamp-3">
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

        {/* ── CTA ── */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <Link href="/blog"
            className="inline-flex items-center gap-2.5 rounded-full bg-white
                       border border-gray-200 px-7 py-3 text-[13px] font-bold text-gray-700
                       shadow-sm transition-all hover:border-emerald-300
                       hover:shadow-[0_6px_20px_rgba(16,185,129,0.12)] hover:text-emerald-700
                       hover:-translate-y-0.5">
            Đọc thêm bài viết <ArrowRight />
          </Link>
          <p className="text-[11px] text-gray-400">Cập nhật hàng tuần · Miễn phí đọc</p>
        </div>
      </div>
    </section>
  );
}
