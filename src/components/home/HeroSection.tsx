import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/types";

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function HeroSection({
  heroImageUrl = "/hero.jpg",
  activities = [],
}: {
  heroImageUrl?: string;
  activities?: Activity[];
}) {
  const featured = activities.filter(a => a.category !== "DINING").slice(0, 3);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Background */}
      <Image
        src={heroImageUrl}
        alt="Khu Du Lịch Sinh Thái Sơn Kiều"
        fill priority
        className="object-cover object-center"
        sizes="100vw"
        unoptimized={heroImageUrl.startsWith("http")}
      />

      {/* Deep dark overlay — Keemala style */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg," +
            "rgba(5,46,22,0.72) 0%," +
            "rgba(5,46,22,0.38) 45%," +
            "rgba(5,46,22,0.75) 100%)",
        }}
      />

      {/* ── Main content ─────────────────────────────────── */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center
                      justify-center px-4 pb-24 pt-36 text-center md:pb-36 md:pt-28">

        {/* Eyebrow — Keemala style */}
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.38em] text-white/50">
          Trường Sơn · Quảng Trị
        </p>

        {/* Signature heading — Keemala uses large italic display */}
        <h1 className="font-display text-[clamp(5rem,15vw,12rem)] font-normal italic
                       leading-[0.88] tracking-[0.04em] text-white">
          Sơn Kiều
        </h1>

        {/* Decorative divider — Keemala style */}
        <div className="my-8 flex items-center gap-4">
          <span className="block h-px w-16 bg-white/30" />
          <span className="text-[#22c55e] opacity-80">✦</span>
          <span className="block h-px w-16 bg-white/30" />
        </div>

        {/* Subtitle */}
        <p className="mx-auto max-w-lg text-[16px] font-light leading-[2] text-white/70">
          Một nơi trú ẩn giữa rừng, suối và hang động tự nhiên,
          <br className="hidden md:block" />
          dành cho những ngày muốn đi chậm lại.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/booking"
                className="inline-flex min-h-[46px] items-center gap-2.5 border border-white
                           bg-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.22em]
                           text-[#052e16] transition hover:bg-white/90">
            Đặt Vé Ngay
          </Link>
          <Link href="/activities"
                className="inline-flex min-h-[46px] items-center gap-2.5 border border-white/40
                           bg-transparent px-8 py-3 text-[11px] font-bold uppercase
                           tracking-[0.22em] text-white transition hover:bg-white/8">
            Khám Phá
            <ArrowIcon />
          </Link>
        </div>
      </div>

      {/* ── Booking bar — desktop only ───── */}
      <div className="absolute inset-x-4 bottom-8 z-20 mx-auto hidden max-w-5xl
                      overflow-hidden rounded-[80px] border border-white/50
                      bg-white/94 backdrop-blur-md md:block">
        <div className="grid gap-px bg-gray-100 md:grid-cols-[1fr_1fr_1fr_auto]">
          {[
            ["Điểm đến",    "Khu du lịch Sơn Kiều"                           ],
            ["Trải nghiệm", featured[0]?.name ?? "Hang động & suối tự nhiên" ],
            ["Giờ mở cửa",  "08:00 – 17:00"                                  ],
          ].map(([label, value]) => (
            <div key={label} className="bg-white px-6 py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#16a34a]">
                {label}
              </p>
              <p className="mt-0.5 truncate font-display text-[18px] font-normal
                             italic tracking-[0.03em] text-gray-900">
                {value}
              </p>
            </div>
          ))}
          <Link href="/booking"
                className="flex items-center justify-center gap-2 bg-[#16a34a]
                           px-7 py-4 text-[11px] font-bold uppercase tracking-[0.2em]
                           text-white transition hover:bg-[#15803d]">
            Book <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
