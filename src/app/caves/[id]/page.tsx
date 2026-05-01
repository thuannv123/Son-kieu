import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import PanoramaViewer from "@/components/caves/PanoramaViewer";
import BookingButton from "@/components/caves/BookingButton";
import { getActivityById, DIFFICULTY_META } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id }   = await params;
  const activity = getActivityById(id);
  if (!activity) return {};
  return {
    title:       `${activity.name} | Sơn Kiều`,
    description: activity.description.slice(0, 155),
  };
}

export default async function CaveDetailPage({ params }: PageProps) {
  const { id }   = await params;
  const activity = getActivityById(id);

  if (!activity || activity.category !== "CAVE") notFound();

  const diff = activity.difficultyLevel ? DIFFICULTY_META[activity.difficultyLevel] : null;

  return (
    <main className="min-h-screen pt-16">
      {/* Hero */}
      <div className={`relative flex h-[56vh] min-h-[320px] items-end overflow-hidden
                       bg-gradient-to-br ${activity.coverGradient}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        {/* Back */}
        <div className="absolute left-4 top-4 md:left-6">
          <Link href="/activities?cat=CAVE"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5
                       text-[12px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/25">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            🦇 Hang Động
          </Link>
        </div>

        {/* Title overlay */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-8 md:px-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {diff && (
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[12px] font-semibold text-white backdrop-blur-sm">
                ⚡ {activity.difficultyLevel}
              </span>
            )}
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-[12px] font-semibold text-white backdrop-blur-sm">
              ⏱ {activity.durationMinutes} phút
            </span>
            <span className="rounded-full bg-white/20 px-3 py-0.5 text-[12px] font-semibold text-white backdrop-blur-sm">
              👥 Tối đa {activity.maxPerSlot} khách/slot
            </span>
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
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(activity.price)}
              <span className="text-[14px] font-normal text-gray-500"> / khách</span>
            </p>
            <div className="mt-1 flex items-center gap-1 text-[12px] text-amber-500">
              {"★".repeat(Math.floor(activity.rating))}
              <span className="ml-1 font-semibold text-gray-700">{activity.rating}</span>
              <span className="text-gray-400">({activity.reviewCount} đánh giá)</span>
            </div>
          </div>
          <BookingButton activityId={activity.id} />
        </div>

        {/* 360° viewer */}
        {activity.virtualTourUrl && (
          <section className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-gray-900">🌐 Tham Quan 360°</h2>
            <PanoramaViewer src={activity.virtualTourUrl} title={activity.name} />
          </section>
        )}

        {/* Highlights */}
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">✨ Điểm Nổi Bật</h2>
          <ul className="grid gap-2 sm:grid-cols-3">
            {activity.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <span className="text-base">✓</span> {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-gray-900">📖 Giới Thiệu</h2>
          <p className="whitespace-pre-line leading-relaxed text-gray-700">{activity.description}</p>
        </section>

        {/* Safety guidelines */}
        <section className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-3 text-lg font-bold text-amber-800">⚠️ Hướng Dẫn An Toàn</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-amber-700">
            {activity.safetyGuideline}
          </p>
        </section>

        {/* Bottom CTA */}
        <div className="flex justify-center">
          <BookingButton activityId={activity.id} label="Đặt vé tham quan hang" />
        </div>
      </div>
    </main>
  );
}
