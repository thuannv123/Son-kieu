import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Cẩm Nang Du Lịch Quảng Trị | Kinh Nghiệm Đi Sơn Kiều",
  description: "Cẩm nang du lịch Quảng Trị và kinh nghiệm đi Khu Du Lịch Sinh Thái Sơn Kiều: đường đi, lịch trình, hoạt động, ăn uống và mẹo tham quan.",
  keywords:    ["cẩm nang du lịch Quảng Trị", "kinh nghiệm đi Sơn Kiều", "du lịch Sơn Kiều", "địa điểm du lịch Quảng Trị"],
  alternates:  { canonical: "/blog" },
};

const CAT_META: Record<string, { label: string; icon: string }> = {
  news:  { label: "Tin tức",  icon: "📰" },
  guide: { label: "Cẩm nang", icon: "🗺️" },
  food:  { label: "Ẩm thực",  icon: "🍖" },
  event: { label: "Sự kiện",  icon: "🎉" },
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

      <PageHero
        title="Cẩm Nang Du Lịch"
        eyebrow="Blog · Sơn Kiều"
        subtitle="Kinh nghiệm khám phá hang động, ẩm thực rừng núi và tin tức mới nhất từ Sơn Kiều."
        crumbs={[{ label: "Blog" }]}
        size="compact"
      />

      {/* ── Content ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-10 md:px-6">

          {/* Category filter */}
          <div className="mb-10 flex flex-wrap gap-2">
            <Link href="/blog"
              className={`inline-flex items-center gap-2 border px-5 py-2.5 text-[11px]
                          font-bold uppercase tracking-[0.18em] transition-colors ${
                !category
                  ? "border-[#052e16] bg-[#052e16] text-white"
                  : "border-gray-200 bg-white text-gray-500 hover:border-[#052e16]/40 hover:text-[#052e16]"
              }`}
              style={{ borderRadius: 0 }}>
              Tất cả
              {posts && (
                <span className={`text-[10px] font-bold ${
                  !category ? "text-white/60" : "text-gray-400"
                }`}>{posts.length}</span>
              )}
            </Link>
            {Object.entries(CAT_META).map(([key, meta]) => {
              const count = posts?.filter(p => p.category === key).length ?? 0;
              return (
                <Link key={key} href={`/blog?category=${key}`}
                  className={`inline-flex items-center gap-2 border px-5 py-2.5 text-[11px]
                              font-bold uppercase tracking-[0.18em] transition-colors ${
                    category === key
                      ? "border-[#052e16] bg-[#052e16] text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:border-[#052e16]/40 hover:text-[#052e16]"
                  }`}
                  style={{ borderRadius: 0 }}>
                  {meta.label}
                  {count > 0 && (
                    <span className={`text-[10px] font-bold ${
                      category === key ? "text-white/60" : "text-gray-400"
                    }`}>{count}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Featured */}
          {featured && (
            <Link href={`/blog/${featured.slug}`}
              className="group mb-10 block overflow-hidden border border-gray-200 bg-white
                         transition-all duration-300 hover:border-[#052e16]/20
                         hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="md:flex">
                {/* Cover */}
                <div className="relative min-h-[240px] overflow-hidden bg-[#052e16] md:w-[45%]">
                  {featured.cover_image && (
                    <Image src={featured.cover_image} alt={featured.title} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="45vw" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4">
                    <span className="border border-white/30 bg-white/15 px-3 py-1
                                     text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm"
                      style={{ borderRadius: 0 }}>
                      Bài nổi bật
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center p-7 md:w-[55%]">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="border border-gray-200 px-2.5 py-0.5 text-[11px] font-bold
                                     uppercase tracking-[0.1em] text-[#052e16]"
                      style={{ borderRadius: 0 }}>
                      {CAT_META[featured.category]?.label ?? featured.category}
                    </span>
                    {featured.published_at && (
                      <span className="text-[11px] text-gray-400">
                        {new Date(featured.published_at).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-[22px] font-normal italic leading-snug text-gray-900
                                 transition-colors group-hover:text-[#052e16]">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-2 text-[13px] leading-relaxed text-gray-500 line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center
                                      bg-[#052e16] text-[12px] font-bold text-white">
                        {featured.author?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-semibold text-gray-600">{featured.author}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[13px] font-semibold
                                     text-[#052e16] transition group-hover:gap-2">
                      Đọc bài <ArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden bg-white
                             transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">

                  {/* Cover */}
                  <div className="relative h-48 overflow-hidden bg-[#052e16]">
                    {post.cover_image && (
                      <Image src={post.cover_image} alt={post.title} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                    <div className="absolute left-3 top-3">
                      <span className="border border-white/30 bg-white/15 px-2.5 py-0.5
                                       text-[11px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm"
                        style={{ borderRadius: 0 }}>
                        {CAT_META[post.category]?.label ?? post.category}
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
                    <h3 className="font-display text-[15px] font-normal italic leading-snug text-gray-900 line-clamp-2
                                   transition-colors group-hover:text-[#052e16]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-gray-500 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-6 w-6 items-center justify-center
                                        bg-[#052e16] text-[10px] font-bold text-white">
                          {post.author?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] text-gray-400">{post.author}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[12px] font-semibold
                                       text-[#052e16] transition group-hover:gap-1.5">
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
              <div className="flex h-20 w-20 items-center justify-center border border-gray-200 text-4xl">
                ✍️
              </div>
              <p className="mt-4 font-display text-[18px] font-normal italic text-gray-700">
                Chưa có bài viết nào
              </p>
              <p className="mt-1 text-[14px] text-gray-400">Hãy quay lại sau nhé!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
