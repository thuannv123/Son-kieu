import type { Metadata } from "next";
import ActivityCard from "@/components/home/ActivityCard";
import { ACTIVITIES, CATEGORY_META } from "@/lib/mock-data";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Activity, ActivityCategory } from "@/types";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Hoạt Động",
  description: "Khám phá tất cả hoạt động tại Sơn Kiều: hang động triệu năm, hồ bơi thiên nhiên, tham quan rừng nguyên sinh, ẩm thực đặc sản.",
  alternates:  { canonical: "/activities" },
};

interface PageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function ActivitiesPage({ searchParams }: PageProps) {
  const { cat } = await searchParams;
  const activeCategory = (cat?.toUpperCase() ?? "ALL") as ActivityCategory | "ALL";

  const { data: rows } = await supabaseAdmin
    .from("activities")
    .select("id,slug,name,category,description,safety_guideline,difficulty_level,price,max_capacity,max_per_slot,cover_gradient,image_url,rating,review_count,highlights,duration_minutes")
    .eq("is_active", true)
    .order("category")
    .order("name");

  const activities: Activity[] = rows && rows.length > 0
    ? rows.map(r => ({
        id:              r.id,
        slug:            r.slug ?? undefined,
        name:            r.name,
        category:        r.category,
        description:     r.description ?? "",
        safetyGuideline: r.safety_guideline ?? "",
        difficultyLevel: r.difficulty_level ?? undefined,
        price:           Number(r.price),
        maxCapacity:     r.max_capacity,
        maxPerSlot:      r.max_per_slot,
        coverGradient:   r.cover_gradient ?? "from-emerald-800 via-emerald-700 to-teal-800",
        image_url:       r.image_url ?? undefined,
        rating:          Number(r.rating ?? 4.5),
        reviewCount:     r.review_count ?? 0,
        highlights:      r.highlights ?? [],
        durationMinutes: r.duration_minutes ?? 60,
      }))
    : ACTIVITIES;

  const categories = [...new Set(activities.map(a => a.category))].sort();
  const filterTabs = [
    { key: "ALL", label: "Tất Cả", icon: "🌿" },
    ...categories.map(c => ({
      key:   c,
      label: CATEGORY_META[c]?.label ?? c,
      icon:  CATEGORY_META[c]?.icon  ?? "📌",
    })),
  ];

  const filtered = activeCategory === "ALL"
    ? activities
    : activities.filter(a => a.category === activeCategory);

  return (
    <main className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>

        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.12) 0%,transparent 70%)" }} />
          <div className="absolute -right-20 top-10 h-64 w-64 rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle,rgba(52,211,153,0.08),transparent 70%)" }} />
        </div>

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="adots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#adots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-[12px] text-white/40">
            <Link href="/" className="transition hover:text-white/70">Trang chủ</Link>
            <span>/</span>
            <span className="text-white/60">Hoạt động</span>
          </div>

          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              {/* Location pill */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10
                              bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                              tracking-[0.18em] text-white/60 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Trường Sơn · Quảng Trị
              </div>

              <h1 className="text-4xl font-black leading-none text-white md:text-[3.2rem]">
                Khám Phá{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300
                                 bg-clip-text text-transparent">
                  Thiên Nhiên
                </span>
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                {activities.length} trải nghiệm độc đáo · hang động · hồ suối · sinh thái
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex shrink-0 items-center gap-4">
              {[
                { val: `${activities.length}+`, label: "Hoạt động" },
                { val: "4.8★", label: "Đánh giá" },
                { val: "5K+", label: "Du khách" },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center rounded-2xl border border-white/[0.08]
                                            bg-white/[0.04] px-4 py-3 text-center backdrop-blur-sm">
                  <span className="text-[1.2rem] font-black text-white">{val}</span>
                  <span className="text-[10px] text-white/40">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ── Filter + Grid ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-10 md:px-6">

          {/* Filter tabs */}
          <div className="mb-10 flex flex-wrap gap-2.5">
            {filterTabs.map(({ key, label, icon }) => {
              const isActive = activeCategory === key;
              const count = key === "ALL"
                ? activities.length
                : activities.filter(a => a.category === key).length;
              return (
                <Link
                  key={key}
                  href={key === "ALL" ? "/activities" : `/activities?cat=${key.toLowerCase()}`}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px]
                              font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]"
                      : "bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-white hover:ring-emerald-300 hover:text-emerald-700"
                  }`}
                >
                  <span className="text-[14px]">{icon}</span>
                  {label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Results label */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeCategory !== "ALL" && CATEGORY_META[activeCategory] ? (
                <>
                  <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${CATEGORY_META[activeCategory].color}`}>
                    {CATEGORY_META[activeCategory].icon} {CATEGORY_META[activeCategory].label}
                  </span>
                  <span className="text-[13px] text-gray-400">·</span>
                </>
              ) : null}
              <span className="text-[13px] text-gray-500">
                <span className="font-bold text-gray-800">{filtered.length}</span> hoạt động
              </span>
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((activity, i) => (
                <ActivityCard key={activity.id} activity={activity} featured={i === 0 && activeCategory === "ALL"} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-4xl">
                🔍
              </div>
              <p className="mt-4 text-[16px] font-bold text-gray-700">Không tìm thấy hoạt động</p>
              <p className="mt-1 text-[14px] text-gray-400">Thử chọn danh mục khác</p>
              <Link href="/activities"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600
                           px-6 py-2.5 text-[13px] font-bold text-white transition
                           hover:bg-emerald-500">
                Xem tất cả
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
