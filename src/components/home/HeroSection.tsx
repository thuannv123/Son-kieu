import Link from "next/link";
import Image from "next/image";
import type { Activity } from "@/types";

function MapPinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  );
}

const CAT_LABEL: Record<string, string> = {
  CAVE:        "Hang Động",
  LAKE:        "Hồ & Suối",
  SIGHTSEEING: "Tham Quan",
};

const CAT_GRADIENT: Record<string, string> = {
  CAVE:        "from-slate-900 to-emerald-950",
  LAKE:        "from-cyan-950 to-teal-900",
  SIGHTSEEING: "from-amber-950 to-yellow-900",
};

export default function HeroSection({
  heroImageUrl = "/hero.jpg",
  activities = [],
}: {
  heroImageUrl?: string;
  activities?: Activity[];
}) {
  const featured = activities.filter(a => a.category !== "DINING").slice(0, 3);
  const [mainCard, ...miniCards] = featured;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">

      {/* ── Background ── */}
      <Image
        src={heroImageUrl}
        alt="Khu Du Lịch Sinh Thái Sơn Kiều"
        fill priority
        className="object-cover object-center"
        sizes="100vw"
        unoptimized={heroImageUrl.startsWith("http")}
      />

      {/* Directional overlay: left heavy → image shows on right (desktop) */}
      <div className="absolute inset-0 hidden lg:block"
        style={{ background: "linear-gradient(105deg,rgba(2,10,4,0.93) 0%,rgba(2,10,4,0.82) 35%,rgba(2,10,4,0.45) 60%,rgba(2,10,4,0.10) 100%)" }} />
      {/* Mobile: bottom heavy */}
      <div className="absolute inset-0 lg:hidden"
        style={{ background: "linear-gradient(to top,rgba(2,10,4,0.97) 0%,rgba(2,10,4,0.78) 45%,rgba(2,10,4,0.30) 100%)" }} />
      {/* Top vignette for navbar readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/55 to-transparent" />

      {/* Dot grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hdots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hdots)" />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 md:px-6 md:pt-32 md:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px] lg:gap-14">

          {/* Left: Copy */}
          <div>
            {/* Location pill */}
            <div className="mb-7 inline-flex items-center gap-2.5 rounded-full
                            border border-emerald-600/30 bg-emerald-950/55
                            px-4 py-1.5 backdrop-blur-sm">
              <span className="text-emerald-400"><MapPinIcon /></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-300">
                Trường Sơn · Quảng Trị
              </span>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.9rem,6.5vw,5.4rem)] font-black leading-[1.02] tracking-[-0.03em] text-white">
              Thiên Nhiên
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300
                               bg-clip-text text-transparent">
                Hoang Sơ
              </span>
              <br />
              Sơn Kiều
            </h1>

            <p className="mt-6 max-w-[460px] text-[15px] leading-[1.9] text-gray-400 md:text-[15.5px]">
              Thám hiểm hang động triệu năm tuổi, tắm hồ nước ngọc bích trong lành
              và đắm chìm giữa rừng nguyên sinh đại ngàn — tất cả trong một điểm đến.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/booking"
                className="group inline-flex items-center gap-2.5 rounded-full bg-emerald-500
                           px-7 py-3.5 text-[14px] font-bold text-white
                           shadow-[0_0_32px_rgba(16,185,129,0.35)]
                           transition-all duration-200 hover:bg-emerald-400
                           hover:-translate-y-0.5 hover:shadow-[0_0_48px_rgba(16,185,129,0.5)]">
                <TicketIcon />
                Đặt Vé Ngay
              </Link>
              <Link href="/activities"
                className="group inline-flex items-center gap-2 rounded-full
                           border border-white/15 bg-white/[0.07] px-7 py-3.5
                           text-[14px] font-bold text-white backdrop-blur-sm
                           transition-all duration-200 hover:bg-white/[0.13] hover:-translate-y-0.5">
                Khám Phá
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRightIcon />
                </span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/[0.08] pt-10">
              {[
                { value: "4.8★", label: "Đánh giá",   sub: "từ 1,200+ khách" },
                { value: "5K+",  label: "Lượt khách",  sub: "mỗi năm" },
                { value: "3+",   label: "Hoạt động",   sub: "sinh thái" },
              ].map(({ value, label, sub }) => (
                <div key={label}>
                  <p className="text-[1.9rem] font-black leading-none text-white">{value}</p>
                  <p className="mt-1 text-[12px] font-semibold text-gray-300">{label}</p>
                  <p className="text-[10px] text-gray-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Activity cards */}
          <div className="hidden lg:flex flex-col gap-3">

            {/* Main card — tall */}
            {mainCard && (
              <Link href="/activities"
                className="group relative h-[252px] overflow-hidden rounded-3xl
                           ring-1 ring-white/10 transition-all duration-300
                           hover:ring-emerald-500/40 hover:-translate-y-1
                           hover:shadow-[0_20px_48px_rgba(0,0,0,0.55)]">
                <div className={`absolute inset-0 bg-gradient-to-br ${CAT_GRADIENT[mainCard.category] ?? "from-slate-900 to-emerald-950"}`} />
                {mainCard.image_url && (
                  <Image src={mainCard.image_url} alt={mainCard.name} fill
                    className="object-cover opacity-55 transition-transform duration-700 group-hover:scale-105"
                    sizes="400px" unoptimized={mainCard.image_url.startsWith("http")} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

                {/* Category tag */}
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-black/40 px-2.5 py-1
                                   text-[10px] font-bold uppercase tracking-wider
                                   text-white/70 backdrop-blur-sm">
                    {CAT_LABEL[mainCard.category] ?? mainCard.category}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Hoạt động nổi bật
                  </p>
                  <p className="mt-1 text-[17px] font-black leading-snug text-white">
                    {mainCard.name}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-emerald-300">
                      {mainCard.price.toLocaleString("vi-VN")}đ / người
                    </p>
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1
                                     text-[11px] font-bold text-emerald-300
                                     ring-1 ring-emerald-500/30
                                     transition-all group-hover:bg-emerald-500 group-hover:text-white group-hover:ring-emerald-400">
                      Xem ngay →
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Mini cards — 2-col grid */}
            {miniCards.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {miniCards.map(card => (
                  <Link href="/activities" key={card.id}
                    className="group relative h-[132px] overflow-hidden rounded-2xl
                               ring-1 ring-white/10 transition-all duration-300
                               hover:ring-emerald-500/30 hover:-translate-y-0.5
                               hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${CAT_GRADIENT[card.category] ?? "from-slate-900 to-emerald-950"}`} />
                    {card.image_url && (
                      <Image src={card.image_url} alt={card.name} fill
                        className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                        sizes="190px" unoptimized={card.image_url.startsWith("http")} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                        {CAT_LABEL[card.category]}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[12.5px] font-bold leading-snug text-white">
                        {card.name}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-emerald-300">
                        {card.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Open status */}
            <div className="flex items-center gap-2.5 rounded-2xl
                            border border-emerald-800/30 bg-emerald-950/40
                            px-4 py-2.5 backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[12px] font-medium text-emerald-300">
                Đang mở cửa · 08:00 – 17:00
              </span>
              <span className="ml-auto rounded-full bg-emerald-900/60 px-2.5 py-0.5
                               text-[10px] font-bold text-emerald-400">
                Hôm nay ✓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center
                      gap-1.5 animate-bounce text-white/25">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em]">Cuộn xuống</span>
        <ChevronDownIcon />
      </div>
    </section>
  );
}
