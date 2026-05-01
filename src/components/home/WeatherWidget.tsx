import Link from "next/link";

type WeatherKey = "sunny" | "cloudy" | "rainy" | "storm" | "shower";

interface DayForecast {
  date: string; icon: WeatherKey; label: string; temp: number; isSafe: boolean;
}

export interface WeatherDay {
  date: string; dayNum: number; month: number;
  icon: WeatherKey; label: string; temp: number; isSafe: boolean;
}
export interface WeatherData {
  current: { temp: number; humidity: number; wind: number; icon: WeatherKey; desc: string; isSafe: boolean; };
  forecast: WeatherDay[];
}

/* ── SVG icons ─────────────────────────────────────────────────────── */
const ICONS: Record<WeatherKey, { node: React.ReactNode; glow: string }> = {
  sunny: {
    glow: "rgba(251,191,36,0.55)",
    node: (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="13" fill="#fbbf24"/>
        {[0,45,90,135,180,225,270,315].map((deg,i) => (
          <line key={i}
            x1={32+20*Math.cos(deg*Math.PI/180)} y1={32+20*Math.sin(deg*Math.PI/180)}
            x2={32+27*Math.cos(deg*Math.PI/180)} y2={32+27*Math.sin(deg*Math.PI/180)}
            stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round"/>
        ))}
      </svg>
    ),
  },
  cloudy: {
    glow: "rgba(148,163,184,0.40)",
    node: (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="22" cy="28" r="10" fill="#fbbf24" opacity="0.9"/>
        {[0,45,90,135,180,225,270,315].map((deg,i) => (
          <line key={i}
            x1={22+14*Math.cos(deg*Math.PI/180)} y1={28+14*Math.sin(deg*Math.PI/180)}
            x2={22+18*Math.cos(deg*Math.PI/180)} y2={28+18*Math.sin(deg*Math.PI/180)}
            stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round"/>
        ))}
        <rect x="14" y="34" width="36" height="14" rx="7" fill="#cbd5e1"/>
        <rect x="20" y="28" width="28" height="14" rx="7" fill="#e2e8f0"/>
      </svg>
    ),
  },
  rainy: {
    glow: "rgba(96,165,250,0.45)",
    node: (
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="10" y="18" width="36" height="16" rx="8" fill="#94a3b8"/>
        <rect x="16" y="12" width="24" height="14" rx="7" fill="#cbd5e1"/>
        <line x1="20" y1="40" x2="18" y2="50" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="28" y1="40" x2="26" y2="50" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="36" y1="40" x2="34" y2="50" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  storm: {
    glow: "rgba(167,139,250,0.45)",
    node: (
      <svg viewBox="0 0 64 64" fill="none">
        <rect x="8" y="14" width="40" height="18" rx="9" fill="#64748b"/>
        <rect x="14" y="8" width="28" height="14" rx="7" fill="#94a3b8"/>
        <line x1="18" y1="38" x2="16" y2="46" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="36" y1="38" x2="34" y2="46" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round"/>
        <polyline points="30,34 24,46 30,46 22,58" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  shower: {
    glow: "rgba(125,211,252,0.45)",
    node: (
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="20" cy="22" r="8" fill="#fbbf24" opacity="0.85"/>
        <rect x="12" y="28" width="36" height="14" rx="7" fill="#94a3b8"/>
        <rect x="18" y="22" width="24" height="12" rx="6" fill="#cbd5e1"/>
        <line x1="20" y1="46" x2="18" y2="54" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="30" y1="46" x2="28" y2="54" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="40" y1="46" x2="38" y2="54" stroke="#7dd3fc" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

function Icon({ type, size }: { type: WeatherKey; size: number }) {
  const { node, glow } = ICONS[type];
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: glow }} />
      <div className="relative" style={{ width: size, height: size }}>{node}</div>
    </div>
  );
}

/* ── Data ───────────────────────────────────────────────────────────── */
const W = { icon: "sunny" as WeatherKey, desc: "Quang đãng, nắng đẹp", temp: 27, humidity: 65, wind: 12, isSafe: true };

const FORECAST: DayForecast[] = [
  { date:"T2", icon:"sunny",  label:"Nắng",    temp:28, isSafe:true  },
  { date:"T3", icon:"cloudy", label:"Ít mây",  temp:26, isSafe:true  },
  { date:"T4", icon:"rainy",  label:"Có mưa",  temp:22, isSafe:false },
  { date:"T5", icon:"storm",  label:"Dông",    temp:20, isSafe:false },
  { date:"T6", icon:"shower", label:"Mưa rào", temp:23, isSafe:false },
  { date:"T7", icon:"cloudy", label:"Ít mây",  temp:25, isSafe:true  },
  { date:"CN", icon:"sunny",  label:"Nắng đẹp",temp:29, isSafe:true  },
];

const FALLBACK = "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1600&auto=format&fit=crop&q=80";

function getDated() {
  const today = new Date();
  return FORECAST.map((d, i) => {
    const dt = new Date(today); dt.setDate(today.getDate() + i);
    return { ...d, dayNum: dt.getDate(), month: dt.getMonth() + 1 };
  });
}

/* ── Component ──────────────────────────────────────────────────────── */
export default function WeatherWidget({ bgUrl = "", weather }: { bgUrl?: string; weather?: WeatherData | null }) {
  const cur      = weather?.current ?? W;
  const forecast = weather?.forecast ?? getDated();
  const safeDays = forecast.filter(d => d.isSafe).length;
  const bg       = bgUrl || FALLBACK;

  return (
    <section className="relative flex min-h-[640px] flex-col justify-center overflow-hidden py-20">

      {/* Background — let it breathe */}
      <img src={bg} alt="" aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center" />

      {/* Overlay: very light at top, heavy at bottom */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.28) 35%, rgba(0,0,0,0.72) 100%)" }} />

      {/* Subtle side vignettes */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-40"
        style={{ background: "linear-gradient(to right,rgba(0,0,0,0.25),transparent)" }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40"
        style={{ background: "linear-gradient(to left,rgba(0,0,0,0.25),transparent)" }} />

      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto w-full max-w-3xl px-4 md:px-6">

        {/* ── Location badge ── */}
        <div className="mb-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20
                           bg-black/20 px-4 py-1.5 text-[11px] font-bold uppercase
                           tracking-[0.18em] text-white/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Trường Sơn · Quảng Trị · Thời tiết thực tế
          </span>
        </div>

        {/* ── Temperature hero ── */}
        <div className="flex flex-col items-center gap-0">
          <div className="flex items-center gap-5">
            <Icon type={cur.icon} size={88} />
            <div className="flex items-start">
              <span className="text-[7rem] font-black leading-none text-white drop-shadow-2xl
                               md:text-[8.5rem]">
                {cur.temp}
              </span>
              <span className="mt-5 text-[2rem] font-extralight text-white/40 md:mt-6">°C</span>
            </div>
          </div>

          {/* Condition text */}
          <p className="mt-2 text-[17px] font-medium tracking-wide text-white/85">
            {cur.desc}
          </p>

          {/* Stats row */}
          <div className="mt-5 flex items-center gap-1 text-white/60">
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5
                             text-[13px] backdrop-blur-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
              {cur.humidity}%
            </span>
            <span className="mx-1 text-white/25">·</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5
                             text-[13px] backdrop-blur-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
              </svg>
              {cur.wind} km/h
            </span>
            <span className="mx-1 text-white/25">·</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5
                             text-[13px] backdrop-blur-sm">
              UV thấp
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* ── 7-day forecast ── */}
        <div className="grid grid-cols-7 gap-1.5">
          {forecast.map((day) => (
            <div key={day.date}
              className={`group flex flex-col items-center gap-1 rounded-2xl py-3
                          backdrop-blur-sm transition-all duration-200
                          hover:-translate-y-1 ${
                day.isSafe
                  ? "bg-white/[0.10] hover:bg-white/[0.16]"
                  : "bg-red-950/40 hover:bg-red-950/60"
              }`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                {day.date}
              </p>
              <p className="text-[9px] text-white/35">{day.dayNum}/{day.month}</p>
              <Icon type={day.icon} size={30} />
              <p className={`text-[14px] font-black ${day.isSafe ? "text-white" : "text-red-300"}`}>
                {day.temp}°
              </p>
              <div className={`h-1 w-1 rounded-full ${day.isSafe ? "bg-emerald-400" : "bg-red-400"}`} />
            </div>
          ))}
        </div>

        {/* ── Safety + CTA strip ── */}
        <div className={`mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl
                         px-6 py-4 backdrop-blur-md sm:flex-row ${
          cur.isSafe
            ? "bg-emerald-500/[0.15] ring-1 ring-emerald-500/25"
            : "bg-red-500/[0.15] ring-1 ring-red-500/25"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
              cur.isSafe ? "bg-emerald-500/25" : "bg-red-500/25"
            }`}>
              {cur.isSafe ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              )}
            </div>
            <div>
              <p className={`text-[13px] font-black ${cur.isSafe ? "text-emerald-300" : "text-red-300"}`}>
                {cur.isSafe ? "Điều kiện AN TOÀN hôm nay" : "Cần cẩn thận hôm nay"}
              </p>
              <p className="text-[11px] text-white/50">
                {cur.isSafe ? "Tất cả hoạt động mở cửa" : "Tạm đóng hoạt động nước"} · {safeDays}/7 ngày tốt tuần này
              </p>
            </div>
          </div>
          <Link href="/booking"
            className={`shrink-0 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white
                         transition-all hover:-translate-y-0.5 ${
              cur.isSafe
                ? "bg-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.45)] hover:bg-emerald-400"
                : "bg-white/15 hover:bg-white/25"
            }`}>
            Đặt vé ngay →
          </Link>
        </div>

      </div>
    </section>
  );
}
