import type { Metadata } from "next";
import ActivityCard from "@/components/home/ActivityCard";
import { ACTIVITIES, CATEGORY_META } from "@/lib/mock-data";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Activity, ActivityCategory } from "@/types";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Hoạt Động Du Lịch Sơn Kiều | Hang Động, Hồ Suối, Tham Quan",
  description: "Khám phá các hoạt động tại Khu Du Lịch Sinh Thái Sơn Kiều, Quảng Trị: tham quan hang động, tắm hồ suối tự nhiên, xe điện, check-in và ẩm thực bản địa.",
  keywords:    ["hoạt động Sơn Kiều", "hang động Quảng Trị", "hồ suối tự nhiên Quảng Trị", "khu du lịch sinh thái Sơn Kiều"],
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

      <PageHero
        title="Khám Phá Thiên Nhiên"
        eyebrow="Trường Sơn · Quảng Trị"
        subtitle={`${activities.length} trải nghiệm độc đáo · hang động · hồ suối · sinh thái`}
        crumbs={[{ label: "Hoạt Động" }]}
        size="compact"
      />

      {/* ── Filter + Grid ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 md:px-6">

          {/* Filter tabs */}
          <div className="mb-10 flex flex-wrap gap-2">
            {filterTabs.map(({ key, label }) => {
              const isActive = activeCategory === key;
              const count = key === "ALL"
                ? activities.length
                : activities.filter(a => a.category === key).length;
              return (
                <Link
                  key={key}
                  href={key === "ALL" ? "/activities" : `/activities?cat=${key.toLowerCase()}`}
                  className={`inline-flex items-center gap-2 border px-5 py-2.5 text-[11px]
                              font-bold uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? "border-[#052e16] bg-[#052e16] text-white"
                      : "border-gray-200 bg-white text-gray-500 hover:border-[#052e16]/40 hover:text-[#052e16]"
                  }`}
                  style={{ borderRadius: 0 }}
                >
                  {label}
                  <span className={`text-[10px] font-bold ${
                    isActive ? "text-white/60" : "text-gray-400"
                  }`}>
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Results label */}
          <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-5">
            {activeCategory !== "ALL" && CATEGORY_META[activeCategory] ? (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#22c55e]">
                {CATEGORY_META[activeCategory].label}
              </span>
            ) : null}
            <span className="text-[12px] text-gray-400">
              <span className="font-bold text-gray-700">{filtered.length}</span> hoạt động
            </span>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((activity, i) => (
                <ActivityCard key={activity.id} activity={activity} featured={i === 0 && activeCategory === "ALL"} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-24 text-center">
              <p className="font-display text-[1.6rem] font-normal italic text-gray-300">
                Không tìm thấy hoạt động
              </p>
              <p className="mt-2 text-[13px] text-gray-400">Thử chọn danh mục khác</p>
              <Link href="/activities"
                className="mt-8 inline-flex items-center gap-2 border border-[#052e16]
                           px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em]
                           text-[#052e16] transition hover:bg-[#052e16] hover:text-white"
                style={{ borderRadius: 0 }}>
                Xem tất cả
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
