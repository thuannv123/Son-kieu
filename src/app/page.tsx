import Link from "next/link";
import HeroSection       from "@/components/home/HeroSection";
import StatsBar          from "@/components/home/StatsBar";
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

function isUnsafeWeather(code: number, windSpeed = 0, rainProbability = 0): boolean {
  // Open-Meteo WMO codes: thunderstorms and heavy rain are the risky cases
  // for water/cave/outdoor activities. Light cloud or brief drizzle should not
  // mark the whole resort as closed.
  const severeCodes = new Set([65, 67, 82, 95, 96, 99]);
  return severeCodes.has(code) || windSpeed >= 38 || rainProbability >= 80;
}

function wmoKey(c: number): WmoKey {
  if (c <= 1)               return "sunny";
  if (c <= 3)               return "cloudy";
  if (c >= 95)              return "storm";
  if (c >= 80 && c <= 82)   return "shower";
  if (c >= 61 && c <= 67)   return "rainy";
  if (c >= 51 && c <= 57)   return "shower";
  if (c >= 45 && c <= 48)   return "cloudy";
  return "shower";
}
function wmoLabel(c: number): string {
  if (c === 0) return "Nắng đẹp";
  if (c === 1) return "Quang đãng";
  if (c <=  3) return "Có mây";
  if (c <= 48) return "Sương mù";
  if (c <= 57) return "Mưa phùn";
  if (c <= 63) return "Có mưa";
  if (c <= 67) return "Mưa lớn";
  if (c <= 77) return "Mưa tuyết";
  if (c <= 81) return "Mưa rào";
  if (c === 82) return "Mưa rào mạnh";
  return "Có dông";
}
function wmoDesc(c: number): string {
  if (c === 0) return "Nắng đẹp, trời quang đãng";
  if (c === 1) return "Quang đãng, ít mây";
  if (c <=  3) return "Có mây, nắng xen kẽ";
  if (c <= 48) return "Sương mù, tầm nhìn hạn chế";
  if (c <= 57) return "Mưa phùn nhẹ";
  if (c <= 63) return "Trời có mưa";
  if (c <= 67) return "Mưa lớn, cần cẩn thận";
  if (c <= 77) return "Mưa tuyết";
  if (c <= 81) return "Mưa rào ngắn";
  if (c === 82) return "Mưa rào mạnh, hạn chế hoạt động nước";
  return "Dông sét, cần cẩn thận";
}
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=17.1893&longitude=106.5845" +
  "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
  "&daily=weather_code,temperature_2m_max,precipitation_probability_max&forecast_days=7&timezone=Asia%2FBangkok";
const WMO_DAYS = ["CN","T2","T3","T4","T5","T6","T7"] as const;

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.khudulichsonkieu.vn";
const SOCIAL_IMAGE = `${SITE}/opengraph-image`;

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":       "TouristAttraction",
      "@id":         `${SITE}/#resort`,
      "name":        "Khu Du Lịch Sinh Thái Sơn Kiều",
      "description": "Khu du lịch sinh thái & homestay tại Trường Sơn, Quảng Ninh, tỉnh Quảng Trị — hang động triệu năm tuổi, hồ bơi thiên nhiên ngọc bích, rừng nguyên sinh.",
      "url":         SITE,
      "image":       SOCIAL_IMAGE,
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
      "logo":      `${SITE}/icon.png`,
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
    const todayCode = Number(d.weather_code?.[0] ?? c.weather_code);
    const todayRainProbability = Number(d.precipitation_probability_max?.[0] ?? 0);
    const currentCode = Number(c.weather_code);
    const currentWind = Number(c.wind_speed_10m ?? 0);
    const isTodaySafe =
      !isUnsafeWeather(currentCode, currentWind) &&
      !isUnsafeWeather(todayCode, currentWind, todayRainProbability);

    weatherData = {
      current: {
        temp:     Math.round(c.temperature_2m),
        humidity: Math.round(c.relative_humidity_2m),
        wind:     Math.round(c.wind_speed_10m),
        icon:     wmoKey(currentCode),
        desc:     isTodaySafe ? wmoDesc(currentCode) : wmoDesc(todayCode),
        isSafe:   isTodaySafe,
      },
      forecast: (d.time as string[]).map((dateStr: string, i: number) => {
        const dt   = new Date(dateStr + "T00:00:00");
        const code = Number(d.weather_code[i]);
        const rainProbability = Number(d.precipitation_probability_max?.[i] ?? 0);
        return {
          date:   i === 0 ? "HN" : WMO_DAYS[dt.getDay()],
          dayNum: dt.getDate(),
          month:  dt.getMonth() + 1,
          icon:   wmoKey(code),
          label:  wmoLabel(code),
          temp:   Math.round(d.temperature_2m_max[i]),
          isSafe: !isUnsafeWeather(code, 0, rainProbability),
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

      {/* 4 ── Featured activities */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Nổi Bật
            </p>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-normal italic
                           leading-[1.06] tracking-[0.04em] text-gray-950">
              Hoạt Động Được Yêu Thích
            </h2>
            <div className="my-7 flex items-center justify-center gap-4">
              <span className="block h-px w-14 bg-gray-200" />
              <span className="text-[#22c55e] opacity-60">✦</span>
              <span className="block h-px w-14 bg-gray-200" />
            </div>
            <p className="mx-auto max-w-sm text-[15px] font-light leading-[2] text-gray-400">
              Được hàng nghìn du khách tin chọn mỗi năm.
            </p>
            <div className="mt-8">
              <Link
                href="/activities"
                className="inline-flex items-center gap-2 border border-[#052e16]/20
                           px-7 py-3 text-[11px] font-bold uppercase tracking-[0.22em]
                           text-gray-700 transition hover:border-[#052e16] hover:text-[#052e16]"
                style={{ borderRadius: 0 }}
              >
                Xem Tất Cả <ArrowRightIcon />
              </Link>
            </div>
          </div>
          <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a, i) => <ActivityCard key={a.id} activity={a} featured={i === 0} />)}
          </div>
        </div>
      </section>

      {/* 5 ── Dining (dark section with waves) */}
      <DiningSection dishes={dishes ?? []} />

      {/* 6 ── Why us */}
      <WhyUs />

      {/* 7 ── Testimonials (dark section with waves) */}
      <Testimonials reviews={reviews} />

      {/* 8 ── Blog */}
      <BlogSection posts={posts ?? []} />

      {/* 9 ── Weather */}
      <WeatherWidget bgUrl={weatherBgUrl} weather={weatherData} />

      {/* 10 ── How it works */}
      <HowItWorks />

      {/* 11 ── Final CTA */}
      <section className="bg-[#052e16] py-28 md:py-36">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
            Book Your Journey
          </p>
          <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-normal italic
                         leading-[1.04] tracking-[0.04em] text-white">
            Thiên Nhiên Đang Chờ Bạn
          </h2>
          <div className="my-8 flex items-center justify-center gap-4">
            <span className="block h-px w-16 bg-white/20" />
            <span className="text-[#22c55e] opacity-80">✦</span>
            <span className="block h-px w-16 bg-white/20" />
          </div>
          <p className="mx-auto max-w-xl text-[16px] font-light leading-[2] text-white/60">
            Chọn ngày, chọn trải nghiệm và nhận vé điện tử để bắt đầu
            một chuyến đi nhẹ nhàng giữa rừng Sơn Kiều.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex min-h-[48px] items-center gap-2.5 border border-white
                         bg-white px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]
                         text-[#052e16] transition hover:bg-white/90"
              style={{ borderRadius: 0 }}
            >
              Đặt Vé Ngay <ArrowRightIcon />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[48px] items-center gap-2.5 border border-white/30
                         bg-transparent px-9 py-3.5 text-[11px] font-bold uppercase
                         tracking-[0.22em] text-white transition hover:bg-white/10"
              style={{ borderRadius: 0 }}
            >
              Liên Hệ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
