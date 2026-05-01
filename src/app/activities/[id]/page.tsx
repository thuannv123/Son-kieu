import { notFound }    from "next/navigation";
import type { Metadata } from "next";
import Link             from "next/link";
import Image            from "next/image";
import { supabaseAdmin } from "@/lib/supabase-admin";
import BookingButton    from "@/components/caves/BookingButton";
import MarkdownContent  from "@/components/ui/MarkdownContent";
import ReviewsSection   from "@/components/ui/ReviewsSection";
import Breadcrumb       from "@/components/ui/Breadcrumb";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CATEGORY_LABEL: Record<string, string> = {
  CAVE:        "Hang Động",
  LAKE:        "Hồ Bơi",
  SIGHTSEEING: "Tham Quan",
  DINING:      "Ẩm Thực",
};

const CATEGORY_ICON: Record<string, string> = {
  CAVE:        "🦇",
  LAKE:        "🏊",
  SIGHTSEEING: "🌄",
  DINING:      "🍽️",
};

async function getActivity(idOrSlug: string) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  if (isUUID) {
    const { data } = await supabaseAdmin.from("activities").select("*").eq("id", idOrSlug).maybeSingle();
    return data;
  }
  const { data } = await supabaseAdmin.from("activities").select("*").eq("slug", idOrSlug).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id }   = await params;
  const activity = await getActivity(id);
  if (!activity) return {};

  const description = activity.description?.slice(0, 155) ?? "";
  const url         = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonkieu.vn"}/activities/${activity.slug ?? activity.id}`;

  return {
    title:       activity.name,
    description,
    openGraph: {
      title:       `${activity.name} | Sơn Kiều`,
      description,
      url,
      images:      activity.image_url ? [{ url: activity.image_url }] : [],
      type:        "article",
    },
    alternates: { canonical: url },
  };
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { id }   = await params;
  const activity = await getActivity(id);

  if (!activity) notFound();

  const fmt = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const catLabel = CATEGORY_LABEL[activity.category] ?? activity.category;
  const catIcon  = CATEGORY_ICON[activity.category] ?? "📍";
  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonkieu.vn";
  const pageUrl  = `${siteUrl}/activities/${activity.slug ?? activity.id}`;

  /* JSON-LD structured data */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type":    "TouristAttraction",
    "name":     activity.name,
    "description": activity.description ?? "",
    "url":      pageUrl,
    ...(activity.image_url ? { "image": activity.image_url } : {}),
    "offers": {
      "@type":         "Offer",
      "price":         String(activity.price),
      "priceCurrency": "VND",
      "availability":  activity.is_active
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    "touristType": catLabel,
    "provider": {
      "@type": "Organization",
      "name":  "Khu Du Lịch Sinh Thái Sơn Kiều",
      "url":   siteUrl,
    },
  };

  return (
    <main className="min-h-screen pt-16">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className={`relative flex items-end overflow-hidden
        ${activity.image_url ? "h-[56vh] min-h-[320px]" : "h-64"}
        bg-gradient-to-br from-emerald-900 to-emerald-950`}>
        {activity.image_url && (
          <Image
            src={activity.image_url}
            alt={activity.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        {/* Back */}
        <div className="absolute left-4 top-4 md:left-6">
          <Link
            href={`/activities?cat=${activity.category.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5
                       text-[12px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/25">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            {catIcon} {catLabel}
          </Link>
        </div>

        {/* Title overlay */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-8 md:px-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {activity.duration_minutes && (
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[12px] font-semibold text-white backdrop-blur-sm">
                ⏱ {activity.duration_minutes} phút
              </span>
            )}
            {activity.max_per_slot && (
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[12px] font-semibold text-white backdrop-blur-sm">
                👥 Tối đa {activity.max_per_slot} khách/slot
              </span>
            )}
            {activity.difficulty_level && (
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[12px] font-semibold text-white backdrop-blur-sm">
                ⚡ {activity.difficulty_level}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-white drop-shadow md:text-4xl">{activity.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        {/* Price + booking */}
        <div className="mb-8 flex flex-col gap-4 overflow-hidden rounded-3xl bg-white px-6 py-5
                        shadow-[0_2px_20px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]
                        sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] text-gray-400">Giá vé</p>
            <p className="text-[26px] font-black text-emerald-700">
              {fmt(Number(activity.price))}
              <span className="text-[14px] font-normal text-gray-500"> / khách</span>
            </p>
          </div>
          <BookingButton activityId={activity.id} />
        </div>

        {/* Short description */}
        {activity.description && !activity.content && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">📖 Giới Thiệu</h2>
            <p className="whitespace-pre-line leading-relaxed text-gray-700">{activity.description}</p>
          </section>
        )}

        {/* Highlights */}
        {activity.highlights?.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">✨ Điểm Nổi Bật</h2>
            <ul className="grid gap-2 sm:grid-cols-3">
              {activity.highlights.map((h: string) => (
                <li key={h} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <span className="text-base">✓</span> {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Article content ── */}
        {activity.content && (
          <article className="mb-10">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin chi tiết</h2>
            </div>
            <MarkdownContent content={activity.content} />
          </article>
        )}

        {/* Safety */}
        {activity.safety_guideline && (
          <section className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="mb-3 text-lg font-bold text-amber-800">⚠️ Hướng Dẫn An Toàn</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-amber-700">
              {activity.safety_guideline}
            </p>
          </section>
        )}

        <div className="flex justify-center">
          <BookingButton activityId={activity.id} label="Đặt vé ngay" />
        </div>

        <ReviewsSection activityId={activity.id} />
      </div>
    </main>
  );
}
