import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase-admin";
import DishTabs from "@/components/dining/DishTabs";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Ẩm Thực",
  description: "Thực đơn ẩm thực bản địa tại Khu Du Lịch Sinh Thái Sơn Kiều — combo nướng than hoa, đặc sản rừng và món lẻ phong phú.",
  alternates:  { canonical: "/dining" },
};

const FOOD_TIPS = [
  { icon: "🔥", title: "Nướng than hoa",    tip: "Toàn bộ món nướng dùng than hoa tự nhiên — giữ nguyên hương vị đặc trưng của đặc sản rừng." },
  { icon: "🌿", title: "Nguyên liệu tươi",  tip: "Gà, cá, tôm đều được lấy tươi trong ngày. Hỏi nhân viên về món đặc biệt theo mùa." },
  { icon: "👨‍👩‍👧", title: "Combo gia đình",    tip: "Combo Đặc Biệt phục vụ tốt cho 4–6 người. Đặt trước để nhà hàng chuẩn bị tốt nhất." },
  { icon: "🌶️", title: "Điều chỉnh độ cay", tip: "Ẩm thực miền Trung thường khá cay — hãy nói 'ít ớt' nếu chưa quen." },
];

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

export default async function DiningPage() {
  const [
    { data: dishes },
    { data: categories },
    { data: restaurants },
    { data: foodPosts },
    { data: diningActivities },
  ] = await Promise.all([
    supabaseAdmin.from("dishes").select("*").eq("is_active", true).order("sort_order").order("created_at"),
    supabaseAdmin.from("dish_categories").select("*").order("sort_order"),
    supabaseAdmin.from("restaurants").select("*").eq("is_active", true).order("sort_order").order("created_at"),
    supabaseAdmin.from("posts").select("id,title,slug,excerpt,author,published_at").eq("is_published", true).eq("category", "food").order("published_at", { ascending: false }).limit(3),
    supabaseAdmin
      .from("activities")
      .select("id,name,description,price,cover_gradient,image_url,rating,review_count,highlights,duration_minutes")
      .eq("is_active", true)
      .eq("category", "DINING")
      .order("name"),
  ]);

  return (
    <main className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16"
        style={{ background: "linear-gradient(150deg,#180800 0%,#2d1200 45%,#1a0900 100%)" }}>

        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse,rgba(249,115,22,0.15) 0%,transparent 70%)" }} />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle,rgba(251,191,36,0.08),transparent 70%)" }} />
        </div>

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="fdots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fdots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-20">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-center gap-2 text-[12px] text-white/40">
            <Link href="/" className="transition hover:text-white/70">Trang chủ</Link>
            <span>/</span>
            <span className="text-white/60">Ẩm thực</span>
          </div>

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10
                          bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                          tracking-[0.18em] text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
            Ẩm thực bản địa · Sơn Kiều
          </div>

          <h1 className="text-4xl font-black leading-none text-white md:text-[3.5rem]"
            style={{ letterSpacing: "-0.02em" }}>
            Hương Vị{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300
                             bg-clip-text text-transparent">
              Sơn Kiều
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-orange-100/60">
            Combo nướng than hoa, đặc sản rừng núi và món lẻ đa dạng — tất cả được phục vụ ngay tại khu du lịch.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#dishes"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3
                         text-[14px] font-bold text-white shadow-[0_4px_20px_rgba(249,115,22,0.4)]
                         transition hover:bg-orange-400 hover:-translate-y-0.5">
              Khám phá thực đơn
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            {(restaurants?.length ?? 0) > 0 && (
              <a href="#restaurants"
                className="inline-flex items-center gap-2 rounded-full border border-white/15
                           px-6 py-3 text-[14px] font-semibold text-white backdrop-blur-sm
                           transition hover:bg-white/10">
                Nhà hàng đề xuất
              </a>
            )}
          </div>

          {/* Stats strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6
                          border-t border-white/[0.07] pt-8">
            {[
              { val: `${dishes?.length ?? "20"}+`, label: "Món ăn" },
              { val: "100%",                        label: "Tươi sống" },
              { val: "4.9★",                        label: "Đánh giá" },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-[1.5rem] font-black text-white">{val}</span>
                <span className="text-[11px] text-white/40">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ── Dining Experiences ── */}
      {(diningActivities?.length ?? 0) > 0 && (
        <section id="experiences" className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
                Đặt chỗ ngay
              </p>
              <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
                Trải Nghiệm Ẩm Thực
              </h2>
              <p className="mt-2 text-[15px] text-gray-500">
                Những trải nghiệm đặc biệt tại resort — đặt trước để đảm bảo suất.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {diningActivities!.map(act => (
                <div key={act.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white
                             shadow-[0_2px_16px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.05]
                             transition-all duration-300 hover:-translate-y-1.5
                             hover:shadow-[0_16px_48px_rgba(249,115,22,0.12)]
                             hover:ring-orange-200/60">
                  <div className={`relative h-52 overflow-hidden bg-gradient-to-br
                    ${act.cover_gradient ?? "from-orange-800 via-amber-700 to-yellow-800"}`}>
                    {act.image_url && (
                      <Image src={act.image_url} alt={act.name} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-end justify-between gap-2">
                        <span className="rounded-full bg-white/15 px-2.5 py-0.5
                                         text-[11px] font-bold text-white backdrop-blur-sm">
                          🍽️ Ẩm thực
                        </span>
                        <span className="rounded-full bg-orange-500 px-3 py-1
                                         text-[12px] font-black text-white shadow-sm">
                          {Number(act.price).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-bold text-gray-900 leading-snug
                                   transition-colors group-hover:text-orange-600">
                      {act.name}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500 line-clamp-2 flex-1">
                      {act.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <StarIcon />
                        {Number(act.rating ?? 4.5).toFixed(1)}
                        <span className="text-gray-400">({act.review_count ?? 0})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon />
                        {act.duration_minutes ?? 60} phút
                      </span>
                    </div>
                    {(act.highlights as string[] | null)?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {(act.highlights as string[]).slice(0, 2).map((h: string) => (
                          <span key={h} className="rounded-full bg-orange-50 px-2.5 py-0.5
                                                    text-[10px] font-semibold text-orange-700
                                                    ring-1 ring-orange-100">
                            {h}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Link href={`/booking?activity=${act.id}`}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl
                                 bg-orange-500 py-2.5 text-[13px] font-bold text-white
                                 shadow-[0_4px_14px_rgba(249,115,22,0.30)]
                                 transition hover:bg-orange-400
                                 hover:shadow-[0_6px_20px_rgba(249,115,22,0.45)]">
                      Đặt chỗ ngay
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Dishes ── */}
      {(dishes?.length ?? 0) > 0 && (
        <section id="dishes" className="py-20"
          style={{ background: "linear-gradient(180deg,#fffaf5 0%,#fff7ed 50%,#fffaf5 100%)" }}>
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
                Thực đơn
              </p>
              <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
                Món Ăn Tại{" "}
                <span className="bg-gradient-to-r from-orange-500 to-amber-400
                                 bg-clip-text text-transparent">
                  Sơn Kiều
                </span>
              </h2>
              <p className="mt-2 text-[15px] text-gray-500">
                Combo, đặc sản rừng, món lẻ và đồ uống — phục vụ ngay tại khu du lịch.
              </p>
            </div>
            <DishTabs dishes={dishes!} categories={categories ?? []} />
          </div>
        </section>
      )}

      {/* ── Food Tips ── */}
      <section className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(160deg,#180800 0%,#2d1200 55%,#1a0900 100%)" }}>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse,rgba(249,115,22,0.08) 0%,transparent 70%)" }} />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">
              Mẹo du lịch
            </p>
            <h2 className="text-3xl font-black text-white md:text-4xl">
              Ăn Như Người Địa Phương
            </h2>
            <p className="mt-2 text-[15px] text-orange-100/50">
              Bí quyết để có bữa ăn ngon nhất tại Sơn Kiều.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FOOD_TIPS.map(({ icon, title, tip }) => (
              <div key={title}
                className="group relative overflow-hidden rounded-3xl border border-white/[0.08]
                           bg-white/[0.05] p-6 backdrop-blur-sm
                           transition-all duration-300 hover:-translate-y-1
                           hover:border-orange-500/30 hover:bg-white/[0.09]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl
                                border border-orange-500/20 bg-orange-500/10 text-2xl">
                  {icon}
                </div>
                <h3 className="text-[14px] font-bold text-white
                               transition-colors group-hover:text-orange-300">
                  {title}
                </h3>
                <p className="mt-2 text-[12px] leading-relaxed text-orange-100/50">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Restaurants ── */}
      {(restaurants?.length ?? 0) > 0 && (
        <section id="restaurants" className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-10 text-center">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-500">
                Địa điểm
              </p>
              <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
                Nhà Hàng Được Đề Xuất
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {restaurants!.map(r => (
                <div key={r.id}
                  className="group relative overflow-hidden rounded-3xl bg-white p-6
                             shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]
                             transition-all duration-300 hover:-translate-y-1
                             hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)]
                             hover:ring-orange-200/60">

                  {/* Top accent bar on hover */}
                  <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-3xl bg-gradient-to-r
                                  from-orange-400 to-amber-400 opacity-0 transition-opacity
                                  group-hover:opacity-100" />

                  {r.tag && (
                    <span className="mb-3 inline-block rounded-full bg-orange-50 px-3 py-0.5
                                     text-[11px] font-bold text-orange-600 ring-1 ring-orange-100">
                      {r.tag}
                    </span>
                  )}
                  <h3 className="font-black text-gray-900 transition-colors
                                 group-hover:text-orange-600">
                    {r.name}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-gray-400">{r.type}</p>

                  <div className="mt-4 space-y-2 text-[12px] text-gray-500">
                    {r.address && (
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="#f97316" strokeWidth="2.5" className="shrink-0">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {r.address}
                      </div>
                    )}
                    {r.hours && (
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="#f97316" strokeWidth="2.5" className="shrink-0">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {r.hours}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Food blog posts ── */}
      {(foodPosts?.length ?? 0) > 0 && (
        <section className="py-20"
          style={{ background: "linear-gradient(180deg,#f8fafc 0%,#f1f5f9 100%)" }}>
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Bài Viết Về Ẩm Thực</h2>
              <Link href="/blog?category=food"
                className="text-[13px] font-semibold text-orange-600 transition hover:text-orange-500">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {foodPosts!.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white p-5
                             ring-1 ring-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)]
                             transition-all hover:-translate-y-0.5
                             hover:shadow-[0_8px_28px_rgba(0,0,0,0.09)]
                             hover:ring-orange-200">
                  <span className="rounded-full bg-orange-50 px-2.5 py-0.5
                                   text-[11px] font-bold text-orange-600">
                    Ẩm thực
                  </span>
                  <h3 className="mt-2.5 font-bold text-gray-900 line-clamp-2
                                 transition-colors group-hover:text-orange-600">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-1.5 text-[12px] text-gray-500 line-clamp-2">{post.excerpt}</p>
                  )}
                  <p className="mt-3 text-[11px] text-gray-400">{post.author}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20"
        style={{ background: "linear-gradient(135deg,#180800 0%,#2d1200 55%,#1a0900 100%)" }}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-72 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
            style={{ background: "radial-gradient(ellipse,rgba(249,115,22,0.12) 0%,transparent 70%)" }} />
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <div className="mb-4 text-5xl">🍖</div>
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Sẵn Sàng Thưởng Thức?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-orange-100/60">
            Đặt tour ngay hôm nay và nhận bản đồ ẩm thực địa phương cùng danh sách đặc sản theo mùa miễn phí.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500
                         px-7 py-3.5 text-[14px] font-bold text-white
                         shadow-[0_4px_20px_rgba(249,115,22,0.40)]
                         transition hover:bg-orange-400 hover:-translate-y-0.5">
              Đặt tour ngay
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/blog?category=food"
              className="inline-flex items-center gap-2 rounded-full border border-white/15
                         px-7 py-3.5 text-[14px] font-semibold text-white backdrop-blur-sm
                         transition hover:bg-white/10">
              Đọc cẩm nang ẩm thực
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {["Nướng than hoa", "Đặc sản rừng", "Combo gia đình", "Đồ uống mát lạnh"].map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-[12px] text-orange-100/50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
