import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Blog & Cẩm Nang Du Lịch",
  description: "Tin tức, cẩm nang du lịch và hướng dẫn khám phá hang động, hồ bơi thiên nhiên tại Khu Du Lịch Sinh Thái Sơn Kiều.",
  alternates:  { canonical: "/blog" },
};

const CAT_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  news:  { label: "Tin tức",  color: "text-blue-700",   bg: "bg-blue-50",   icon: "📰" },
  guide: { label: "Cẩm nang", color: "text-violet-700", bg: "bg-violet-50", icon: "🗺️" },
  food:  { label: "Ẩm thực",  color: "text-orange-700", bg: "bg-orange-50", icon: "🍖" },
  event: { label: "Sự kiện",  color: "text-rose-700",   bg: "bg-rose-50",   icon: "🎉" },
};

const CAT_GRADIENT: Record<string, string> = {
  news:  "from-blue-700 to-blue-950",
  guide: "from-violet-700 to-violet-950",
  food:  "from-orange-700 to-orange-950",
  event: "from-rose-700 to-rose-950",
};

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  let query = supabaseAdmin
    .from("posts")
    .select("id,title,slug,excerpt,category,author,published_at,cover_image")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (category) query = query.eq("category", category);

  const { data: posts } = await query;

  const featured = posts?.[0];
  const rest      = posts?.slice(1) ?? [];

  return (
    <main className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[380px] w-[650px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.12) 0%,transparent 70%)" }} />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bdots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bdots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-20">
          <div className="mb-6 flex items-center justify-center gap-2 text-[12px] text-white/40">
            <Link href="/" className="transition hover:text-white/70">Trang chủ</Link>
            <span>/</span>
            <span className="text-white/60">Blog</span>
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10
                          bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                          tracking-[0.18em] text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Blog &amp; Cẩm nang
          </div>

          <h1 className="text-4xl font-black leading-none text-white md:text-[3.2rem]">
            Khám Phá &amp;{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300
                             bg-clip-text text-transparent">
              Trải Nghiệm
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/50">
            Cẩm nang du lịch, kinh nghiệm khám phá hang động, ẩm thực rừng núi và tin tức mới nhất từ Sơn Kiều.
          </p>

          {/* Category filter */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <Link href="/blog"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px]
                          font-semibold transition-all duration-200 ${
                !category
                  ? "bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]"
                  : "border border-white/15 bg-white/[0.06] text-white/60 backdrop-blur-sm hover:bg-white/[0.12] hover:text-white"
              }`}>
              🌿 Tất cả
              {posts && (
                <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                  !category ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
                }`}>{posts.length}</span>
              )}
            </Link>
            {Object.entries(CAT_META).map(([key, meta]) => {
              const count = posts?.filter(p => p.category === key).length ?? 0;
              return (
                <Link key={key} href={`/blog?category=${key}`}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px]
                              font-semibold transition-all duration-200 ${
                    category === key
                      ? "bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]"
                      : "border border-white/15 bg-white/[0.06] text-white/60 backdrop-blur-sm hover:bg-white/[0.12] hover:text-white"
                  }`}>
                  {meta.icon} {meta.label}
                  {count > 0 && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                      category === key ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
                    }`}>{count}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ── Content ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-5xl space-y-10 px-4 pb-20 pt-10 md:px-6">

          {/* Featured */}
          {featured && (
            <Link href={`/blog/${featured.slug}`}
              className="group block overflow-hidden rounded-3xl bg-white
                         shadow-[0_2px_20px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]
                         transition-all duration-300 hover:-translate-y-1.5
                         hover:shadow-[0_16px_56px_rgba(0,0,0,0.12)] hover:ring-emerald-200/60">
              <div className="md:flex">
                {/* Cover */}
                <div className={`relative min-h-[240px] md:w-[45%] overflow-hidden
                  bg-gradient-to-br ${CAT_GRADIENT[featured.category] ?? "from-emerald-700 to-emerald-950"}`}>
                  {featured.cover_image && (
                    <Image src={featured.cover_image} alt={featured.title} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="45vw" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20
                                     px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm
                                     ring-1 ring-white/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Bài nổi bật
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center p-7 md:w-[55%]">
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold
                      ${CAT_META[featured.category]?.bg ?? "bg-gray-100"}
                      ${CAT_META[featured.category]?.color ?? "text-gray-600"}`}>
                      {CAT_META[featured.category]?.icon} {CAT_META[featured.category]?.label ?? featured.category}
                    </span>
                    {featured.published_at && (
                      <span className="text-[11px] text-gray-400">
                        {new Date(featured.published_at).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>

                  <h2 className="text-[22px] font-black leading-snug text-gray-900
                                 transition-colors group-hover:text-emerald-700">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-500 line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full
                                      bg-gradient-to-br from-emerald-400 to-teal-500
                                      text-[12px] font-bold text-white shadow-sm">
                        {featured.author?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-semibold text-gray-600">{featured.author}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[13px] font-semibold
                                     text-emerald-600 transition group-hover:gap-2">
                      Đọc bài <ArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white
                             shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]
                             transition-all duration-300 hover:-translate-y-1.5
                             hover:shadow-[0_12px_40px_rgba(0,0,0,0.11)]
                             hover:ring-emerald-200/60">

                  {/* Cover */}
                  <div className={`relative h-48 overflow-hidden bg-gradient-to-br
                    ${CAT_GRADIENT[post.category] ?? "from-emerald-700 to-emerald-950"}`}>
                    {post.cover_image && (
                      <Image src={post.cover_image} alt={post.title} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                    <div className="absolute left-3 top-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold
                        ${CAT_META[post.category]?.bg ?? "bg-gray-100/90"}
                        ${CAT_META[post.category]?.color ?? "text-gray-700"}`}>
                        {CAT_META[post.category]?.icon} {CAT_META[post.category]?.label ?? post.category}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-5">
                    {post.published_at && (
                      <p className="mb-2 text-[11px] text-gray-400">
                        {new Date(post.published_at).toLocaleDateString("vi-VN")}
                      </p>
                    )}
                    <h3 className="font-bold leading-snug text-gray-900 line-clamp-2
                                   transition-colors group-hover:text-emerald-700">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-gray-500 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full
                                        bg-gradient-to-br from-emerald-400 to-teal-500
                                        text-[10px] font-bold text-white">
                          {post.author?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] text-gray-400">{post.author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[12px] font-semibold
                                       text-emerald-600 transition group-hover:gap-1.5">
                        Đọc <ArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty */}
          {!posts?.length && (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-4xl">
                ✍️
              </div>
              <p className="mt-4 text-[16px] font-bold text-gray-700">Chưa có bài viết nào</p>
              <p className="mt-1 text-[14px] text-gray-400">Hãy quay lại sau nhé!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
