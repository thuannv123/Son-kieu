import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { Activity, ActivityCategory } from "@/types";
import { ACTIVITIES, CATEGORY_META } from "@/lib/mock-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Bảng Giá Vé",
  description:
    "Bảng giá vé tham quan, hoạt động tại Khu Du Lịch Sinh Thái Sơn Kiều, Trường Sơn, Quảng Trị. Giá tốt nhất, xác nhận tức thì.",
  alternates: { canonical: "/pricing" },
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

const COMBOS = [
  {
    title:     "Combo Khám Phá Thiên Nhiên",
    includes:  ["Combo Tham Quan + Tắm Suối", "Xe Điện Tham Quan"],
    saving:    "Tiết kiệm 15.000đ",
    price:     80000,
    highlight: "Phổ biến nhất",
    color:     "from-emerald-600 to-teal-600",
    glow:      "rgba(16,185,129,0.35)",
  },
  {
    title:     "Combo Hang Động & Hồ Suối",
    includes:  ["Tham Quan 3 Hang Động", "Combo Tham Quan + Tắm Suối"],
    saving:    "Tiết kiệm 25.000đ",
    price:     150000,
    highlight: "Trải nghiệm đầy đủ",
    color:     "from-slate-700 to-slate-900",
    glow:      "rgba(100,116,139,0.30)",
  },
  {
    title:     "Combo Gia Đình Trọn Gói",
    includes:  ["Combo Tham Quan + Tắm Suối", "Xe Điện Tham Quan", "Bữa ăn Ẩm Thực Địa Phương"],
    saving:    "Tiết kiệm 40.000đ",
    price:     220000,
    highlight: "Giá trị nhất",
    color:     "from-amber-500 to-orange-600",
    glow:      "rgba(245,158,11,0.30)",
  },
];

const NOTES = [
  { icon: "👤", text: "Giá áp dụng cho người lớn (trên 1m4)." },
  { icon: "🧒", text: "Trẻ em từ 1m – 1m4: 50.000đ/vé (Combo Tham Quan & Tắm Suối)." },
  { icon: "🎠", text: "Trẻ em dưới 1m: MIỄN PHÍ hoàn toàn." },
  { icon: "📅", text: "Giá có thể thay đổi vào dịp lễ, Tết — vui lòng xác nhận trước." },
  { icon: "💳", text: "Thanh toán online, tại quầy hoặc chuyển khoản." },
  { icon: "🔄", text: "Hoàn vé 100% nếu huỷ trước 24 giờ." },
  { icon: "☂️", text: "Tạm hoãn hoạt động ngoài trời khi có mưa lớn — đổi ngày miễn phí." },
];

const CAT_CONFIG: Record<ActivityCategory, {
  label: string; icon: string;
  gradient: string; glow: string;
  tagBg: string; tagText: string;
}> = {
  CAVE: {
    label:    "Hang Động",
    icon:     "🦇",
    gradient: "from-slate-700 to-slate-900",
    glow:     "rgba(100,116,139,0.25)",
    tagBg:    "bg-slate-100",
    tagText:  "text-slate-700",
  },
  LAKE: {
    label:    "Hồ & Suối",
    icon:     "🏊",
    gradient: "from-cyan-600 to-teal-700",
    glow:     "rgba(6,182,212,0.25)",
    tagBg:    "bg-cyan-50",
    tagText:  "text-cyan-700",
  },
  SIGHTSEEING: {
    label:    "Tham Quan",
    icon:     "🌄",
    gradient: "from-amber-500 to-orange-600",
    glow:     "rgba(245,158,11,0.25)",
    tagBg:    "bg-amber-50",
    tagText:  "text-amber-700",
  },
  DINING: {
    label:    "Ẩm Thực",
    icon:     "🍽️",
    gradient: "from-rose-500 to-orange-500",
    glow:     "rgba(244,63,94,0.25)",
    tagBg:    "bg-rose-50",
    tagText:  "text-rose-700",
  },
};

const CATEGORY_ORDER: ActivityCategory[] = ["CAVE", "LAKE", "SIGHTSEEING", "DINING"];

function ActivityCard({ activity }: { activity: Activity }) {
  const cfg = CAT_CONFIG[activity.category as ActivityCategory] ?? CAT_CONFIG.SIGHTSEEING;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white
                    shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]
                    transition-all duration-300 hover:-translate-y-1
                    hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)]
                    hover:ring-emerald-200/60">

      {/* Image */}
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${cfg.gradient}`}>
        {activity.image_url ? (
          <Image
            src={activity.image_url}
            alt={activity.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
            {cfg.icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cfg.tagBg} ${cfg.tagText}`}>
          {cfg.icon} {cfg.label}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[14px] font-black text-white backdrop-blur-sm">
          {formatPrice(activity.price)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-black leading-snug text-gray-900
                         transition-colors group-hover:text-emerald-700">
            {activity.name}
          </h3>
          <div className="shrink-0 text-right">
            <p className="text-[17px] font-black text-gray-900">{formatPrice(activity.price)}</p>
            <p className="text-[10px] text-gray-400">/ người</p>
          </div>
        </div>

        <p className="text-[12px] leading-relaxed text-gray-500 line-clamp-2">{activity.description}</p>

        <div className="flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.tagBg} ${cfg.tagText}`}>
            ⏱ {formatDuration(activity.durationMinutes)}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.tagBg} ${cfg.tagText}`}>
            👥 Tối đa {activity.maxPerSlot}/suất
          </span>
          {activity.difficultyLevel && (
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.tagBg} ${cfg.tagText}`}>
              ⚡ {activity.difficultyLevel}
            </span>
          )}
        </div>

        {activity.highlights.length > 0 && (
          <ul className="space-y-1">
            {activity.highlights.slice(0, 3).map(h => (
              <li key={h} className="flex items-center gap-1.5 text-[12px] text-gray-600">
                <span className="text-emerald-500">✓</span> {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-2">
          <Link href={`/booking?activity=${activity.id}`}
            className="block w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-center
                       text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(16,185,129,0.25)]
                       transition hover:bg-emerald-500 hover:shadow-[0_4px_14px_rgba(16,185,129,0.40)]">
            Đặt Ngay
          </Link>
        </div>
      </div>
    </div>
  );
}


export default async function PricingPage() {
  let activities: Activity[] = [];
  let fetchFailed = false;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/activities`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw: Record<string, unknown>[] = await res.json();
    activities = raw.map(r => ({
      id:              String(r.id ?? ""),
      slug:            r.slug ? String(r.slug) : undefined,
      name:            String(r.name ?? ""),
      category:        String(r.category ?? "SIGHTSEEING") as ActivityCategory,
      description:     String(r.description ?? ""),
      safetyGuideline: String(r.safety_guideline ?? ""),
      difficultyLevel: r.difficulty_level as Activity["difficultyLevel"] ?? undefined,
      price:           Number(r.price ?? 0),
      maxCapacity:     Number(r.max_capacity ?? 0),
      maxPerSlot:      Number(r.max_per_slot ?? 0),
      coverGradient:   String(r.cover_gradient ?? "from-emerald-800 to-teal-800"),
      image_url:       r.image_url ? String(r.image_url) : undefined,
      rating:          Number(r.rating ?? 4.5),
      reviewCount:     Number(r.review_count ?? 0),
      highlights:      Array.isArray(r.highlights) ? r.highlights.map(String) : [],
      durationMinutes: Number(r.duration_minutes ?? 60),
    }));
  } catch {
    fetchFailed = true;
    activities = ACTIVITIES;
  }

  const grouped = activities.reduce<Partial<Record<ActivityCategory, Activity[]>>>((acc, a) => {
    const cat = a.category as ActivityCategory;
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(a);
    return acc;
  }, {});

  const hasActivities = activities.length > 0;

  return (
    <main className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[380px] w-[650px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.12) 0%,transparent 70%)" }} />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="prdots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#prdots)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-20">
          <div className="mb-6 flex items-center justify-center gap-2 text-[12px] text-white/40">
            <Link href="/" className="transition hover:text-white/70">Trang chủ</Link>
            <span>/</span>
            <span className="text-white/60">Bảng giá</span>
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10
                          bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase
                          tracking-[0.18em] text-white/60 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Giá vé · Sơn Kiều
          </div>

          <h1 className="text-4xl font-black leading-none text-white md:text-[3.2rem]">
            Bảng Giá{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Minh Bạch
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-white/50">
            Giá rõ ràng, không phát sinh — đặt trước để đảm bảo suất tham quan.
          </p>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { label: "Từ", value: "20.000đ", sub: "/ người" },
              { label: "Trẻ em dưới 1m", value: "Miễn phí", sub: "" },
              { label: "Đặt vé", value: "24/7", sub: "trực tuyến" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center rounded-2xl border border-white/[0.08]
                                            bg-white/[0.04] px-6 py-3 text-center backdrop-blur-sm">
                <p className="text-[11px] text-emerald-400/70 uppercase tracking-wide">{s.label}</p>
                <p className="text-[1.4rem] font-black text-white">{s.value}</p>
                {s.sub && <p className="text-[11px] text-white/40">{s.sub}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Fetch failed banner */}
      {fetchFailed && (
        <div className="border-b border-amber-200 bg-amber-50 py-3">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <p className="text-center text-[13px] text-amber-700">
              ⚠️ Không thể tải dữ liệu mới nhất — đang hiển thị bảng giá tham khảo. Gọi{" "}
              <a href="tel:0857086588" className="font-bold underline">0857 086 588</a> để xác nhận.
            </p>
          </div>
        </div>
      )}

      {/* Activities grid */}
      <div className="bg-white">
        <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-[22px] font-black text-gray-900">Hoạt Động & Giá Vé</h2>
              <p className="mt-0.5 text-[13px] text-gray-400">{activities.length} hoạt động · Giá / người</p>
            </div>
            {/* Category legend */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {CATEGORY_ORDER.filter(cat => grouped[cat]).map(cat => {
                const cfg = CAT_CONFIG[cat];
                return (
                  <span key={cat} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${cfg.tagBg} ${cfg.tagText}`}>
                    {cfg.icon} {cfg.label}
                  </span>
                );
              })}
            </div>
          </div>

          {hasActivities ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORY_ORDER.flatMap(cat => grouped[cat] ?? []).map(a => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-4xl">
                🌿
              </div>
              <p className="mt-4 text-[16px] font-bold text-gray-700">Chưa có hoạt động nào.</p>
              <p className="mt-1 text-[14px] text-gray-400">
                Vui lòng gọi{" "}
                <a href="tel:0857086588" className="font-bold text-emerald-600">0857 086 588</a>{" "}
                để hỏi thêm.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Combo deals */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200
                            bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase
                            tracking-[0.18em] text-emerald-700">
              Tiết Kiệm Hơn
            </div>
            <h2 className="text-[28px] font-black text-gray-900 md:text-[2rem]">Gói Combo Ưu Đãi</h2>
            <p className="mt-2 text-[14px] text-gray-500">Kết hợp nhiều hoạt động — trải nghiệm trọn vẹn hơn với giá tốt hơn</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {COMBOS.map(combo => (
              <div key={combo.title}
                className="flex flex-col overflow-hidden rounded-3xl bg-white
                           shadow-[0_2px_16px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]
                           transition-all hover:-translate-y-1
                           hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)]">
                <div className={`relative overflow-hidden bg-gradient-to-br ${combo.color} p-6 text-white`}
                  style={{ boxShadow: `inset 0 -1px 0 rgba(255,255,255,0.1)` }}>
                  <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {combo.highlight}
                  </span>
                  <h3 className="mt-2 text-[16px] font-black">{combo.title}</h3>
                  <p className="mt-1.5 text-[24px] font-black">{formatPrice(combo.price)}</p>
                  <p className="text-[12px] text-white/70">{combo.saving}</p>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">Bao gồm:</p>
                  <ul className="flex-1 space-y-2">
                    {combo.includes.map(item => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-gray-700">
                        <span className="mt-0.5 text-emerald-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/booking"
                    className="mt-5 block w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-center
                               text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(16,185,129,0.25)]
                               transition hover:bg-emerald-500 hover:shadow-[0_4px_14px_rgba(16,185,129,0.40)]">
                    Đặt Combo Này
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[12px] text-gray-400">
            * Combo chưa có trong hệ thống đặt vé. Gọi{" "}
            <a href="tel:0857086588" className="font-medium text-emerald-600">0857 086 588</a>{" "}
            để đặt combo trực tiếp.
          </p>
        </div>
      </section>

      {/* Notes */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="rounded-3xl bg-gray-50 p-8 ring-1 ring-black/[0.04]">
            <h2 className="mb-6 text-[18px] font-black text-gray-900">📋 Lưu Ý Quan Trọng</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {NOTES.map(note => (
                <div key={note.text}
                  className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3
                             shadow-[0_1px_8px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.03]">
                  <span className="shrink-0 text-lg">{note.icon}</span>
                  <p className="text-[13px] leading-relaxed text-gray-700">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>
        <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
          <h2 className="text-[28px] font-black text-white md:text-[2rem]">
            Sẵn Sàng{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Khám Phá?
            </span>
          </h2>
          <p className="mt-3 text-[15px] text-white/50">
            Đặt vé ngay hôm nay — xác nhận tức thì, nhận QR code qua SMS &amp; email.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/booking"
              className="rounded-full bg-emerald-600 px-8 py-3.5 text-[14px] font-bold text-white
                         shadow-[0_4px_20px_rgba(16,185,129,0.40)] transition hover:bg-emerald-500">
              Đặt Vé Ngay
            </Link>
            <a href="tel:0857086588"
              className="rounded-full border border-white/15 bg-white/[0.06] px-8 py-3.5
                         text-[14px] font-bold text-white backdrop-blur-sm transition hover:bg-white/[0.12]">
              Gọi 0857 086 588
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
