import Link from "next/link";
import Image from "next/image";
import HeroSection       from "@/components/home/HeroSection";
import StatsBar          from "@/components/home/StatsBar";
import CategoryShowcase  from "@/components/home/CategoryShowcase";
import ActivityCard      from "@/components/home/ActivityCard";
import WhyUs             from "@/components/home/WhyUs";
import Testimonials      from "@/components/home/Testimonials";
import DiningSection     from "@/components/home/DiningSection";
import BlogSection       from "@/components/home/BlogSection";
import WeatherWidget, { type WeatherData } from "@/components/home/WeatherWidget";
import HowItWorks        from "@/components/home/HowItWorks";
import AboutSection      from "@/components/home/AboutSection";
import { ACTIVITIES } from "@/lib/mock-data";
import { supabaseAdmin }  from "@/lib/supabase-admin";
import type { Activity }  from "@/types";

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

export const revalidate = 60;

/* ── Weather helpers ─────────────────────────────────────── */
type WmoKey = "sunny" | "cloudy" | "rainy" | "storm" | "shower";
function wmoKey(c: number): WmoKey {
  if (c <= 1)               return "sunny";
  if (c <= 3)               return "cloudy";
  if (c >= 95)              return "storm";
  if (c >= 61 && c <= 67)   return "rainy";
  return "shower";
}
function wmoLabel(c: number): string {
  if (c === 0) return "Nắng đẹp";
  if (c === 1) return "Quang đãng";
  if (c <=  3) return "Ít mây";
  if (c <= 48) return "Sương mù";
  if (c <= 55) return "Mưa phùn";
  if (c <= 67) return "Có mưa";
  if (c <= 82) return "Mưa rào";
  return "Có dông";
}
function wmoDesc(c: number): string {
  if (c === 0) return "Nắng đẹp, trời quang đãng";
  if (c === 1) return "Quang đãng, ít mây";
  if (c <=  3) return "Có mây, nắng xen kẽ";
  if (c <= 48) return "Sương mù, tầm nhìn hạn chế";
  if (c <= 55) return "Mưa phùn nhẹ";
  if (c <= 67) return "Trời có mưa";
  if (c <= 82) return "Mưa rào, giông nhẹ";
  return "Dông bão, cần cẩn thận";
}
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=17.1893&longitude=106.5845" +
  "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
  "&daily=weather_code,temperature_2m_max&forecast_days=7&timezone=Asia%2FBangkok";
const WMO_DAYS = ["CN","T2","T3","T4","T5","T6","T7"] as const;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sonkieu.vn";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":       "TouristAttraction",
      "@id":         `${SITE}/#resort`,
      "name":        "Khu Du Lịch Sinh Thái Sơn Kiều",
      "description": "Khu du lịch sinh thái & homestay tại Trường Sơn, Quảng Ninh, tỉnh Quảng Trị — hang động triệu năm tuổi, hồ bơi thiên nhiên ngọc bích, rừng nguyên sinh.",
      "url":         SITE,
      "image":       `${SITE}/og.jpg`,
      "telephone":   "+84944911896",
      "address": {
        "@type":           "PostalAddress",
        "streetAddress":   "Trường Sơn, Quảng Ninh",
        "addressRegion":   "Quảng Trị",
        "addressCountry":  "VN",
      },
      "touristType":    ["Gia đình", "Sinh thái", "Khám phá thiên nhiên"],
      "potentialAction": {
        "@type":  "ReserveAction",
        "target": `${SITE}/booking`,
        "result": { "@type": "Reservation", "name": "Đặt vé hoạt động" },
      },
    },
    {
      "@type":     "Organization",
      "@id":       `${SITE}/#organization`,
      "name":      "Khu Du Lịch Sinh Thái Sơn Kiều",
      "url":       SITE,
      "logo":      `${SITE}/og.jpg`,
      "telephone": "+84944911896",
      "address": {
        "@type":           "PostalAddress",
        "streetAddress":   "Trường Sơn, Quảng Ninh",
        "addressRegion":   "Quảng Trị",
        "addressCountry":  "VN",
      },
      "sameAs": [],
    },
  ],
};

export default async function HomePage() {
  const weatherPromise = fetch(WEATHER_URL, { next: { revalidate: 1800 } })
    .then(r => r.ok ? r.json() : null).catch(() => null);

  const [{ data: activityRows }, { data: posts }, { data: dishes }, { data: heroSetting }, { data: weatherSetting }, { data: aboutSetting }, { data: reviewRows }] = await Promise.all([
    supabaseAdmin
      .from("activities")
      .select("id,name,category,description,safety_guideline,difficulty_level,price,max_capacity,max_per_slot,cover_gradient,image_url,rating,review_count,highlights,duration_minutes")
      .eq("is_active", true)
      .order("category")
      .order("name"),
    supabaseAdmin
      .from("posts")
      .select("id,title,slug,excerpt,category,author,published_at,cover_image")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(4),
    supabaseAdmin
      .from("dishes")
      .select("id,name,description,price,tag,emoji,color,image_url")
      .eq("is_active", true)
      .order("sort_order")
      .limit(4),
    supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "hero_image_url")
      .maybeSingle(),
    supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "weather_bg_url")
      .maybeSingle(),
    supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "about_image_url")
      .maybeSingle(),
    supabaseAdmin
      .from("reviews")
      .select("id, guest_name, rating, comment, created_at")
      .eq("is_approved", true)
      .gte("rating", 4)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const heroImageUrl    = heroSetting?.value    ?? "/hero.jpg";
  const weatherBgUrl    = weatherSetting?.value ?? "";
  const aboutImageUrl   = aboutSetting?.value   ?? undefined;
  const reviews         = reviewRows ?? [];

  const weatherRaw = await weatherPromise;
  let weatherData: WeatherData | null = null;
  if (weatherRaw?.current && weatherRaw?.daily) {
    const c = weatherRaw.current;
    const d = weatherRaw.daily;
    weatherData = {
      current: {
        temp:     Math.round(c.temperature_2m),
        humidity: Math.round(c.relative_humidity_2m),
        wind:     Math.round(c.wind_speed_10m),
        icon:     wmoKey(c.weather_code),
        desc:     wmoDesc(c.weather_code),
        isSafe:   c.weather_code <= 3,
      },
      forecast: (d.time as string[]).map((dateStr: string, i: number) => {
        const dt   = new Date(dateStr + "T00:00:00");
        const code = d.weather_code[i] as number;
        return {
          date:   i === 0 ? "HN" : WMO_DAYS[dt.getDay()],
          dayNum: dt.getDate(),
          month:  dt.getMonth() + 1,
          icon:   wmoKey(code),
          label:  wmoLabel(code),
          temp:   Math.round(d.temperature_2m_max[i]),
          isSafe: code <= 3,
        };
      }),
    };
  }

  const activities: Activity[] = activityRows && activityRows.length > 0
    ? activityRows.map(r => ({
        id:              r.id,
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

  const featured = activities.filter(a => a.category !== "DINING").slice(0, 3);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* 1 ── Hero */}
      <HeroSection heroImageUrl={heroImageUrl} activities={activities} />

      {/* 2 ── Stats bar */}
      <StatsBar />

      {/* 3 ── About */}
      <AboutSection imageUrl={aboutImageUrl} />

      {/* 4 ── Explore by category */}
      {/* <CategoryShowcase activities={activities} /> */}

      {/* 4 ── Featured activities */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="label mb-3">Nổi bật</p>
              <h2 className="text-4xl font-black leading-tight text-gray-900 md:text-[2.6rem]">
                Hoạt Động Được{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500
                                 bg-clip-text text-transparent">
                  Yêu Thích
                </span>
              </h2>
              <p className="mt-2 text-[15px] text-gray-500">
                Được hàng nghìn du khách tin chọn mỗi năm.
              </p>
            </div>
            <Link href="/activities"
              className="inline-flex flex-shrink-0 items-center gap-1.5 text-[13px]
                         font-semibold text-emerald-700 transition-colors hover:text-emerald-900">
              Xem tất cả <ArrowRightIcon />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a, i) => <ActivityCard key={a.id} activity={a} featured={i === 0} />)}
          </div>
        </div>
      </section>
      

      {/* 7 ── Dining */}
      <DiningSection dishes={dishes ?? []} />

      {/* 5 ── Why us */}
      <WhyUs />

      {/* 6 ── Testimonials */}
      <Testimonials reviews={reviews} />

      {/* 8 ── Blog */}
      <BlogSection posts={posts ?? []} />

      {/* 9 ── Weather */}
      <WeatherWidget bgUrl={weatherBgUrl} weather={weatherData} />

      {/* 10 ── How it works */}
      <HowItWorks />

      {/* 11 ── CTA */}
      <section className="relative overflow-hidden py-28 md:py-36"
        style={{ background: "linear-gradient(145deg,#030f05 0%,#071a0b 45%,#04120a 100%)" }}>

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px,#4ade80 1px,transparent 0)", backgroundSize: "36px 36px" }} />

        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full blur-[120px]"
            style={{ background: "rgba(16,185,129,0.10)" }} />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full blur-[100px]"
            style={{ background: "rgba(20,184,166,0.07)" }} />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
            style={{ background: "rgba(22,163,74,0.08)" }} />
        </div>

        {/* Top + bottom accent lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">

            {/* ── Left: Content ── */}
            <div>
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full
                              border border-emerald-700/40 bg-emerald-950/60
                              px-4 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                  Đặt vé chỉ mất 3 phút
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-5xl font-black leading-[1.05] text-white md:text-6xl lg:text-[4rem]">
                Thiên Nhiên<br />
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-green-300
                                 bg-clip-text text-transparent">
                  Đang Chờ
                </span>{" "}Bạn
              </h2>

              <p className="mt-6 max-w-lg text-[15px] leading-[1.85] text-gray-400">
                Hang động triệu năm, hồ suối ngọc bích, rừng nguyên sinh đại ngàn —
                tất cả chỉ cách một cú click. Đặt ngay hôm nay, trải nghiệm ngay cuối tuần này.
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/booking"
                  className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500
                             px-8 py-4 text-[15px] font-bold text-white
                             shadow-[0_0_40px_rgba(16,185,129,0.40)]
                             transition-all duration-200 hover:bg-emerald-400
                             hover:-translate-y-0.5 hover:shadow-[0_0_56px_rgba(16,185,129,0.55)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  Đặt Vé Ngay
                </Link>
                <Link href="/activities"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20
                             bg-white/[0.06] px-8 py-4 text-[15px] font-bold text-white
                             backdrop-blur-sm transition-all duration-200
                             hover:bg-white/[0.12] hover:-translate-y-0.5">
                  Xem Hoạt Động
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>

              {/* Trust row */}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-white/[0.07] pt-8">
                {[
                  "Xác nhận tức thì",
                  "Thanh toán bảo mật",
                  "Hoàn vé dễ dàng",
                  "Hỗ trợ 7 ngày/tuần",
                ].map(label => (
                  <span key={label} className="flex items-center gap-1.5 text-[12.5px] text-gray-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right: Stacked activity photo cards ── */}
            <div className="relative hidden h-[480px] lg:block">

              {/* Card 1 — top, rotated right */}
              {featured[0] && (
                <div className="absolute right-4 top-0 w-[230px] rotate-[3deg] overflow-hidden
                                rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                                ring-1 ring-white/10 transition-transform duration-500 hover:rotate-0">
                  <div className="relative h-[155px]"
                    style={{ background: featured[0].coverGradient ? `linear-gradient(135deg,#0f172a,#1e3a2f)` : "#0f172a" }}>
                    {featured[0].image_url && (
                      <Image src={featured[0].image_url} alt={featured[0].name} fill
                        className="object-cover opacity-80" sizes="230px"
                        unoptimized={featured[0].image_url.startsWith("http")} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Hang Động</p>
                      <p className="text-[13px] font-bold text-white">{featured[0].name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 2 — middle, straight */}
              {featured[1] && (
                <div className="absolute right-10 top-[160px] w-[250px] overflow-hidden
                                rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]
                                ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]">
                  <div className="relative h-[165px]"
                    style={{ background: "#0c2340" }}>
                    {featured[1]?.image_url && (
                      <Image src={featured[1].image_url} alt={featured[1].name} fill
                        className="object-cover opacity-80" sizes="250px"
                        unoptimized={featured[1].image_url.startsWith("http")} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Hồ & Suối</p>
                      <p className="text-[13px] font-bold text-white">{featured[1]?.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Card 3 — bottom, rotated left */}
              {featured[2] && (
                <div className="absolute right-2 top-[336px] w-[220px] -rotate-[2deg] overflow-hidden
                                rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                                ring-1 ring-white/10 transition-transform duration-500 hover:rotate-0">
                  <div className="relative h-[148px]"
                    style={{ background: "#3a2800" }}>
                    {featured[2]?.image_url && (
                      <Image src={featured[2].image_url} alt={featured[2].name} fill
                        className="object-cover opacity-80" sizes="220px"
                        unoptimized={featured[2].image_url.startsWith("http")} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Tham Quan</p>
                      <p className="text-[13px] font-bold text-white">{featured[2]?.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating QR confirmed badge */}
              <div className="absolute -left-4 top-[220px] w-[168px] rounded-2xl bg-white
                              p-4 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center
                                  rounded-xl bg-emerald-500 text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/>
                      <rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-gray-900">Vé QR</p>
                    <p className="text-[10px] text-gray-400">Nhận ngay tức thì</p>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-bold text-emerald-700">Xác nhận trong 60s</p>
                </div>
              </div>

              {/* Decorative dot cluster */}
              <div className="pointer-events-none absolute -right-2 top-1/2 grid grid-cols-3 gap-1.5 opacity-20">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
