import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase-admin";
import DishTabs from "@/components/dining/DishTabs";
import PageHero from "@/components/ui/PageHero";
import { WaveDown, WaveUp } from "@/components/ui/WaveDivider";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Ẩm Thực Sơn Kiều | Đặc Sản Rừng Núi Quảng Trị",
  description: "Thưởng thức ẩm thực bản địa tại Khu Du Lịch Sinh Thái Sơn Kiều: combo nướng than hoa, đặc sản rừng, món gia đình và thực đơn dành cho khách tham quan.",
  keywords:    ["ẩm thực Sơn Kiều", "đặc sản Quảng Trị", "đặc sản rừng", "nhà hàng khu du lịch Sơn Kiều"],
  alternates:  { canonical: "/dining" },
};

const FOOD_TIPS = [
  { num: "01", title: "Nướng than hoa",    tip: "Toàn bộ món nướng dùng than hoa tự nhiên — giữ nguyên hương vị đặc trưng của đặc sản rừng." },
  { num: "02", title: "Nguyên liệu tươi",  tip: "Gà, cá, tôm đều được lấy tươi trong ngày. Hỏi nhân viên về món đặc biệt theo mùa." },
  { num: "03", title: "Combo gia đình",    tip: "Combo Đặc Biệt phục vụ tốt cho 4–6 người. Đặt trước để nhà hàng chuẩn bị tốt nhất." },
  { num: "04", title: "Điều chỉnh độ cay", tip: "Ẩm thực miền Trung thường khá cay — hãy nói 'ít ớt' nếu chưa quen." },
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

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
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

      <PageHero
        title="Hương Vị Sơn Kiều"
        eyebrow="Ẩm Thực Bản Địa"
        subtitle="Combo nướng than hoa, đặc sản rừng núi và món lẻ đa dạng — tất cả được phục vụ ngay tại khu du lịch."
        crumbs={[{ label: "Ẩm Thực" }]}
        size="compact"
        cta={{ label: "Xem Thực Đơn", href: "#dishes" }}
      />

      {/* ── Dining Experiences ── */}
      {(diningActivities?.length ?? 0) > 0 && (
        <section id="experiences" className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-12 text-center">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
                Đặt chỗ ngay
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal italic
                             leading-[1.06] tracking-[0.04em] text-gray-950">
                Trải Nghiệm Ẩm Thực
              </h2>
              <div className="my-6 flex items-center justify-center gap-4">
                <span className="block h-px w-12 bg-gray-200" />
                <span className="text-[#22c55e] opacity-60">✦</span>
                <span className="block h-px w-12 bg-gray-200" />
              </div>
              <p className="mx-auto max-w-md text-[15px] font-light leading-[2] text-gray-400">
                Những trải nghiệm đặc biệt tại resort — đặt trước để đảm bảo suất.
              </p>
            </div>
            <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
              {diningActivities!.map((act, i) => (
                <div key={act.id}
                  className="group flex flex-col overflow-hidden bg-white
                             transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <div className="relative h-52 overflow-hidden bg-[#052e16]">
                    {act.image_url && (
                      <Image src={act.image_url} alt={act.name} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/70 via-black/10 to-transparent" />
                    <div className="absolute left-3 bottom-3 right-3 flex items-end justify-between gap-2">
                      <span className="border border-white/20 bg-[#052e16]/60 px-2.5 py-0.5
                                       text-[9px] font-bold uppercase tracking-[0.18em]
                                       text-white/85 backdrop-blur-sm"
                        style={{ borderRadius: 0 }}>
                        Ẩm thực
                      </span>
                      <span className="border border-[#22c55e]/50 bg-[#052e16]/70 px-3 py-1
                                       font-display text-[13px] font-normal italic text-[#22c55e]
                                       backdrop-blur-sm"
                        style={{ borderRadius: 0 }}>
                        {Number(act.price).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-[17px] font-normal italic leading-snug
                                   tracking-[0.03em] text-gray-900
                                   transition-colors group-hover:text-[#16a34a]">
                      {act.name}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-gray-500 line-clamp-2">
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
                          <span key={h} className="border border-emerald-100 bg-emerald-50 px-2.5 py-0.5
                                                    text-[10px] font-semibold text-emerald-700"
                            style={{ borderRadius: 0 }}>
                            {h}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <Link href={`/booking?activity=${act.id}`}
                      className="mt-4 flex w-full items-center justify-center gap-1.5
                                 bg-[#052e16] py-2.5 text-[12px] font-bold uppercase
                                 tracking-[0.16em] text-white transition hover:bg-[#073d1e]"
                      style={{ borderRadius: 0 }}>
                      Đặt chỗ ngay <ArrowRight />
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
        <section id="dishes" className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-12 text-center">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
                Thực đơn
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal italic
                             leading-[1.06] tracking-[0.04em] text-gray-950">
                Món Ăn Tại Sơn Kiều
              </h2>
              <div className="my-6 flex items-center justify-center gap-4">
                <span className="block h-px w-12 bg-gray-200" />
                <span className="text-[#22c55e] opacity-60">✦</span>
                <span className="block h-px w-12 bg-gray-200" />
              </div>
              <p className="mx-auto max-w-md text-[15px] font-light leading-[2] text-gray-400">
                Combo, đặc sản rừng, món lẻ và đồ uống — phục vụ ngay tại khu du lịch.
              </p>
            </div>
            <DishTabs dishes={dishes!} categories={categories ?? []} />
          </div>
        </section>
      )}

      {/* ── Food Tips (dark section) ── */}
      <WaveDown fill="#052e16" />
      <section className="bg-[#052e16] py-20">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-14 text-center">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Mẹo du lịch
            </p>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal italic
                           leading-[1.06] tracking-[0.04em] text-white">
              Ăn Như Người Địa Phương
            </h2>
            <div className="my-6 flex items-center justify-center gap-4">
              <span className="block h-px w-12 bg-white/20" />
              <span className="text-[#22c55e] opacity-70">✦</span>
              <span className="block h-px w-12 bg-white/20" />
            </div>
            <p className="mx-auto max-w-md text-[15px] font-light leading-[2] text-white/50">
              Bí quyết để có bữa ăn ngon nhất tại Sơn Kiều.
            </p>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {FOOD_TIPS.map(({ num, title, tip }) => (
              <div key={num}
                className="group flex flex-col bg-[#052e16] p-8
                           transition-colors hover:bg-[#073d1e]">
                <p className="mb-5 font-display text-[3.5rem] font-normal italic leading-none
                               tracking-[0.04em] text-white/10 transition-colors
                               group-hover:text-[#22c55e]/20">
                  {num}
                </p>
                <div className="mb-5 flex h-10 w-10 items-center justify-center
                                border border-white/20 text-white/50
                                transition-colors group-hover:border-[#22c55e]/50 group-hover:text-[#22c55e]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
                    <path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white
                               transition-colors group-hover:text-[#22c55e]">
                  {title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/50">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WaveUp fill="#052e16" />

      {/* ── Restaurants ── */}
      {(restaurants?.length ?? 0) > 0 && (
        <section id="restaurants" className="bg-white py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-12 text-center">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
                Địa điểm
              </p>
              <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-normal italic
                             leading-[1.06] tracking-[0.04em] text-gray-950">
                Nhà Hàng Được Đề Xuất
              </h2>
            </div>
            <div className="grid gap-px bg-gray-100 md:grid-cols-3">
              {restaurants!.map(r => (
                <div key={r.id}
                  className="group flex flex-col bg-white p-8
                             transition-colors hover:bg-[#052e16]/[0.02]">
                  {r.tag && (
                    <span className="mb-4 inline-flex border border-emerald-100 bg-emerald-50 px-3 py-0.5
                                     text-[10px] font-bold uppercase tracking-[0.16em] text-[#16a34a]"
                      style={{ borderRadius: 0 }}>
                      {r.tag}
                    </span>
                  )}
                  <h3 className="font-display text-[18px] font-normal italic text-gray-900
                                 transition-colors group-hover:text-[#16a34a]">
                    {r.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    {r.type}
                  </p>
                  <div className="mt-5 space-y-2 border-t border-gray-100 pt-5 text-[12px] text-gray-500">
                    {r.address && (
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="#16a34a" strokeWidth="2.5" className="shrink-0">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {r.address}
                      </div>
                    )}
                    {r.hours && (
                      <div className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="#16a34a" strokeWidth="2.5" className="shrink-0">
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
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
                  Blog
                </p>
                <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-normal italic
                               leading-[1.06] tracking-[0.04em] text-gray-950">
                  Bài Viết Về Ẩm Thực
                </h2>
              </div>
              <Link href="/blog?category=food"
                className="inline-flex shrink-0 items-center gap-2 border border-gray-200
                           px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em]
                           text-gray-600 transition hover:border-[#052e16] hover:text-[#052e16]"
                style={{ borderRadius: 0 }}>
                Xem tất cả <ArrowRight />
              </Link>
            </div>
            <div className="grid gap-px bg-gray-200 md:grid-cols-3">
              {foodPosts!.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white p-6
                             transition-colors hover:bg-[#052e16]/[0.02]">
                  <span className="mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#22c55e]">
                    Ẩm thực
                  </span>
                  <h3 className="font-display text-[16px] font-normal italic leading-snug
                                 tracking-[0.03em] text-gray-900 line-clamp-2
                                 transition-colors group-hover:text-[#16a34a]">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-[12px] leading-relaxed text-gray-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-[11px] text-gray-400">{post.author}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#16a34a]
                                     opacity-0 transition-opacity group-hover:opacity-100">
                      Đọc →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="bg-[#052e16] py-28 md:py-36">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
            Sẵn Sàng Thưởng Thức?
          </p>
          <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-normal italic
                         leading-[1.04] tracking-[0.04em] text-white">
            Đặt Bàn Tại Sơn Kiều
          </h2>
          <div className="my-8 flex items-center justify-center gap-4">
            <span className="block h-px w-16 bg-white/20" />
            <span className="text-[#22c55e] opacity-80">✦</span>
            <span className="block h-px w-16 bg-white/20" />
          </div>
          <p className="mx-auto max-w-xl text-[15px] font-light leading-[2] text-white/60">
            Đặt tour ngay hôm nay và nhận bản đồ ẩm thực địa phương cùng
            danh sách đặc sản theo mùa miễn phí.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/booking"
              className="inline-flex min-h-[48px] items-center gap-2.5 border border-white
                         bg-white px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]
                         text-[#052e16] transition hover:bg-white/90"
              style={{ borderRadius: 0 }}>
              Đặt Tour Ngay <ArrowRight />
            </Link>
            <Link href="/blog?category=food"
              className="inline-flex min-h-[48px] items-center gap-2.5 border border-white/30
                         bg-transparent px-9 py-3.5 text-[11px] font-bold uppercase
                         tracking-[0.22em] text-white transition hover:bg-white/10"
              style={{ borderRadius: 0 }}>
              Cẩm Nang Ẩm Thực
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 border-t border-white/8 pt-8">
            {["Nướng than hoa", "Đặc sản rừng", "Combo gia đình", "Đồ uống mát lạnh"].map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-[12px] text-white/40">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
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
