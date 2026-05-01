import Image from "next/image";
import Link from "next/link";

const PILLARS = [
  {
    emoji: "🦇",
    label: "Hang động triệu năm",
    desc: "Thạch nhũ kỳ ảo, suối ngầm huyền bí hàng triệu năm tuổi",
    accent: "from-slate-500 to-slate-700",
    bg: "bg-slate-50",
    ring: "hover:ring-slate-200",
  },
  {
    emoji: "💎",
    label: "Suối Kiều ngọc bích",
    desc: "Làn nước trong mát quanh năm giữa lòng rừng già nguyên sinh",
    accent: "from-cyan-500 to-teal-600",
    bg: "bg-cyan-50",
    ring: "hover:ring-cyan-200",
  },
  {
    emoji: "🌿",
    label: "Văn hóa Bru-Vân Kiều",
    desc: "Trải nghiệm đời sống và văn hóa đồng bào thiểu số bản địa",
    accent: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    ring: "hover:ring-emerald-200",
  },
  {
    emoji: "🧘",
    label: "Detox hoàn toàn",
    desc: "Không wifi, không sóng — chỉ tiếng suối và gió rừng thuần túy",
    accent: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    ring: "hover:ring-violet-200",
  },
];

const QUICK_STATS = [
  { value: "2022", label: "Năm thành lập" },
  { value: "50km", label: "Từ trung tâm Đông Hà" },
  { value: "08–17h", label: "Giờ mở cửa" },
];

function StarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80";

export default function AboutSection({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full
                      bg-gradient-to-br from-emerald-50 to-teal-50 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full
                      bg-gradient-to-br from-emerald-50 to-transparent blur-2xl opacity-60" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* ── Left: Text ── */}
          <div>
            <p className="label mb-4">Về Sơn Kiều</p>

            <h2 className="text-4xl font-black leading-[1.1] text-gray-900 md:text-[2.8rem]">
              Liều thuốc{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-emerald-600 to-teal-500
                                 bg-clip-text text-transparent">
                  chữa lành
                </span>
                <span className="absolute -bottom-0.5 left-0 right-0 h-2.5 -rotate-1
                                 rounded-sm bg-emerald-100" />
              </span>
              {" "}tâm hồn
            </h2>

            <p className="mt-6 text-[15.5px] leading-[1.85] text-gray-500">
              Cái tên <strong className="text-gray-700">Sơn Kiều</strong> được ghép từ hang{" "}
              <strong className="text-gray-700">Sơn</strong> Bồi và suối{" "}
              <strong className="text-gray-700">Kiều</strong> — hai linh hồn của vùng đất này.
              Nằm giữa đại ngàn Trường Sơn, Quảng Ninh, tỉnh Quảng Trị, khu du lịch là nơi
              hội tụ của hang động triệu năm tuổi, dòng suối ngọc bích và đời sống văn hóa
              đồng bào Bru-Vân Kiều.
            </p>

            <p className="mt-4 text-[15.5px] leading-[1.85] text-gray-500">
              Đến đây, bạn buông bỏ điện thoại, quên đi nhịp sống ồn ào — chỉ còn tiếng suối
              rì rào, gió rừng mát lạnh và cảm giác bình yên hiếm có giữa thiên nhiên hoang sơ.
            </p>

            {/* Quick stats */}
            <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-gray-100 pt-7">
              {QUICK_STATS.map(({ value, label }) => (
                <div key={label} className="text-center sm:text-left">
                  <p className="text-[1.6rem] font-black leading-none text-gray-900">{value}</p>
                  <p className="mt-1 text-[11px] font-medium text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            <Link href="/about"
              className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold
                         text-emerald-700 transition-colors hover:text-emerald-900">
              Tìm hiểu thêm về Sơn Kiều
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* ── Right: Image mosaic ── */}
          <div className="relative">
            {/* Decorative dot cluster top-right */}
            <div className="pointer-events-none absolute -right-4 -top-4 grid grid-cols-4 gap-1.5 opacity-30">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              ))}
            </div>

            {/* Main image — offset to leave room for floating card */}
            <div className="relative mb-8 ml-auto h-[420px] w-[92%] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src={imageUrl || FALLBACK_IMAGE}
                alt="Cảnh quan Sơn Kiều"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={(imageUrl || FALLBACK_IMAGE).startsWith("http")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

              {/* Top-right open badge */}
              <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full
                              bg-black/30 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-white">Mở cửa hôm nay</span>
              </div>
            </div>

            {/* Floating rating card — sits below image, left-aligned */}
            <div className="absolute bottom-0 left-0 w-52 rounded-2xl bg-white px-4 py-4
                            shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.05]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center
                                rounded-xl bg-amber-50 text-2xl">
                  ⭐
                </div>
                <div>
                  <p className="text-[1.5rem] font-black leading-none text-gray-900">4.8</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">1,200+ đánh giá</p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="mt-1.5 text-[10px] font-medium text-gray-400">
                Được yêu thích nhất Quảng Trị
              </p>
            </div>

            {/* Decorative emerald circle */}
            <div className="pointer-events-none absolute -right-3 top-1/3 h-16 w-16
                            rounded-full bg-gradient-to-br from-emerald-300/30 to-teal-300/20 blur-xl" />
          </div>
        </div>

        {/* ── Pillars ── */}
        <div className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ emoji, label, desc, accent, bg, ring }) => (
            <div key={label}
              className={`group relative overflow-hidden rounded-2xl border border-gray-100
                          p-5 transition-all duration-300
                          hover:-translate-y-1 hover:shadow-lg ${ring} hover:ring-1`}>
              {/* Top accent gradient bar */}
              <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accent}
                               opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

              {/* Icon */}
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl
                               text-2xl ${bg} transition-all duration-300
                               group-hover:scale-110`}>
                {emoji}
              </div>

              <p className="text-[13.5px] font-bold text-gray-900">{label}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
