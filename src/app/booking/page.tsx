import type { Metadata } from "next";
import BookingForm from "@/components/booking/BookingForm";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ACTIVITIES, CATEGORY_META } from "@/lib/mock-data";
import type { Activity } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Đặt Vé",
  description: "Đặt vé tham quan hang động, tắm hồ thiên nhiên và khám phá rừng nguyên sinh tại Sơn Kiều. Xác nhận tức thì, nhận QR code ngay.",
  alternates:  { canonical: "/booking" },
};

interface PageProps {
  searchParams: Promise<{ activityId?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const { activityId } = await searchParams;

  /* Fetch active activities + dishes from DB */
  const [{ data: rows }, { data: dishRows }] = await Promise.all([
    supabaseAdmin
      .from("activities")
      .select("id,name,category,description,safety_guideline,difficulty_level,price,max_capacity,max_per_slot,cover_gradient,image_url,rating,review_count,highlights,duration_minutes")
      .eq("is_active", true)
      .order("category")
      .order("name"),
    supabaseAdmin
      .from("dishes")
      .select("id,name,description,price,emoji,color,image_url")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  /* Map DB rows (snake_case) → Activity type (camelCase), fall back to mock data */
  const activities: Activity[] = rows && rows.length > 0
    ? rows.map(r => ({
        id:               r.id,
        name:             r.name,
        category:         r.category,
        description:      r.description ?? "",
        safetyGuideline:  r.safety_guideline ?? "",
        difficultyLevel:  r.difficulty_level ?? undefined,
        price:            Number(r.price),
        maxCapacity:      r.max_capacity,
        maxPerSlot:       r.max_per_slot,
        coverGradient:    r.cover_gradient ?? "from-emerald-800 via-emerald-700 to-teal-800",
        image_url:        r.image_url ?? undefined,
        rating:           Number(r.rating ?? 4.5),
        reviewCount:      r.review_count ?? 0,
        highlights:       r.highlights ?? [],
        durationMinutes:  r.duration_minutes ?? 60,
      }))
    : ACTIVITIES;

  /* Validate preselected id against fetched list */
  const preselected = activities.find(a => a.id === activityId)?.id;

  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[320px] w-[600px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[90px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.14) 0%,transparent 70%)" }} />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="bkdots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bkdots)" />
          </svg>
        </div>

        <div className="relative px-4 py-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10
                          bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                          tracking-[0.18em] text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Đặt vé trực tuyến
          </div>
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Đặt Vé{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Tham Quan
            </span>
          </h1>
          <p className="mt-2 text-[14px] text-white/50">Hoàn thành trong 3 bước · Nhận QR check-in tức thì</p>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-gray-50" />
      </div>

      <div className="py-10 px-4">
        <BookingForm
          activities={activities}
          categoryMeta={CATEGORY_META}
          preselectedActivityId={preselected}
          dishes={dishRows ?? []}
        />
      </div>
    </main>
  );
}
