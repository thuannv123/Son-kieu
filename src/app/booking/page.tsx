import type { Metadata } from "next";
import BookingForm from "@/components/booking/BookingForm";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ACTIVITIES, CATEGORY_META } from "@/lib/mock-data";
import type { Activity } from "@/types";
import PageHero from "@/components/ui/PageHero";

export const revalidate = 60;

export const metadata: Metadata = {
  title:       "Đặt Vé Khu Du Lịch Sơn Kiều | Vé Tham Quan Quảng Trị",
  description: "Đặt vé tham quan Khu Du Lịch Sinh Thái Sơn Kiều tại Trường Sơn, Quảng Trị. Chọn hoạt động hang động, hồ suối, ẩm thực và nhận mã QR xác nhận nhanh.",
  keywords:    ["đặt vé Sơn Kiều", "vé khu du lịch Sơn Kiều", "vé tham quan Quảng Trị", "đặt vé du lịch Quảng Trị"],
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
    <main className="min-h-screen bg-white">
      <PageHero
        title="Đặt Vé Tham Quan"
        eyebrow="Đặt Vé Trực Tuyến"
        subtitle="Hoàn thành trong 3 bước · Nhận QR check-in tức thì · Xác nhận tức thì"
        crumbs={[{ label: "Đặt Vé" }]}
        size="compact"
      />

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
