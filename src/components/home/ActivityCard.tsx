import Link from "next/link";
import Image from "next/image";
import type { Activity } from "@/types";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/mock-data";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24"
      fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "#d1d5db"}
      strokeWidth={filled ? "0" : "1.5"}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export default function ActivityCard({
  activity,
  featured = false,
}: {
  activity: Activity;
  featured?: boolean;
}) {
  const cat      = CATEGORY_META[activity.category];
  const diff     = activity.difficultyLevel ? DIFFICULTY_META[activity.difficultyLevel] : null;
  const detail   = `/activities/${activity.slug ?? activity.id}`;
  const fullStars = Math.floor(activity.rating);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white
                        shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]
                        transition-all duration-300 hover:-translate-y-2
                        hover:shadow-[0_20px_60px_rgba(0,0,0,0.13)]
                        hover:ring-emerald-200/60">

      {/* ── Cover ── */}
      <Link href={detail} className="relative block h-60 overflow-hidden bg-gradient-to-br"
        style={{ background: undefined }}>
        <div className={`absolute inset-0 bg-gradient-to-br ${activity.coverGradient}`} />
        {activity.image_url && (
          <Image
            src={activity.image_url}
            alt={activity.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {/* Layered gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5" />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm ${cat.color}`}>
            {cat.icon} {cat.label}
          </span>
          {diff && (
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-sm ${diff.color}`}>
              {activity.difficultyLevel}
            </span>
          )}
        </div>

        {/* Top-right: bestseller */}
        {featured && (
          <div className="absolute right-3 top-3">
            <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5
                             text-[10px] font-black text-amber-900 shadow-sm">
              ★ Phổ biến nhất
            </span>
          </div>
        )}

        {/* Bottom: title + duration */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between gap-2">
            <h3 className="text-[15px] font-black leading-tight text-white drop-shadow
                           transition-colors duration-200 line-clamp-2">
              {activity.name}
            </h3>
            <div className="flex shrink-0 items-center gap-1 rounded-full
                            bg-black/40 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
              <ClockIcon />
              <span>{activity.durationMinutes} phút</span>
            </div>
          </div>
        </div>

        {/* Hover overlay CTA */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20
                        opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5
                           text-[13px] font-bold text-gray-800 shadow-lg backdrop-blur-sm
                           translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
            Xem chi tiết <ArrowRight />
          </span>
        </div>
      </Link>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col p-5">

        <p className="line-clamp-2 text-[13px] leading-relaxed text-gray-500">
          {activity.description}
        </p>

        {/* Highlights */}
        {activity.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activity.highlights.slice(0, 2).map((h) => (
              <span key={h} className="inline-flex items-center gap-1 rounded-full
                                       bg-emerald-50 px-2.5 py-1
                                       text-[11px] font-medium text-emerald-700
                                       ring-1 ring-emerald-100">
                <CheckIcon />
                {h}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="mt-3.5 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} filled={i < fullStars} />
            ))}
          </div>
          <span className="text-[12px] font-bold text-gray-800">{activity.rating}</span>
          <span className="text-[11px] text-gray-400">({activity.reviewCount} đánh giá)</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4 mt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Giá từ</p>
            <p className="text-[19px] font-black leading-tight text-emerald-700">
              {new Intl.NumberFormat("vi-VN").format(activity.price)}
              <span className="text-[12px] font-normal text-gray-400">đ</span>
            </p>
            <p className="text-[10px] text-gray-400">/ khách</p>
          </div>
          <Link href={detail}
            className="inline-flex items-center gap-1.5 rounded-full
                       bg-emerald-600 px-5 py-2.5 text-[13px] font-bold text-white
                       transition-all duration-200 hover:bg-emerald-500 hover:gap-2.5
                       shadow-[0_4px_14px_rgba(16,185,129,0.30)]
                       hover:shadow-[0_6px_22px_rgba(16,185,129,0.45)]">
            Đặt ngay
            <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
