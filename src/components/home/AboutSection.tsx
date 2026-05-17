import Image from "next/image";
import Link from "next/link";

const PILLARS = [
  {
    num: "01",
    label: "Hang Động Triệu Năm",
    desc: "Thạch nhũ kỳ ảo, suối ngầm huyền bí hàng triệu năm tuổi trong lòng đại ngàn Trường Sơn.",
  },
  {
    num: "02",
    label: "Suối Kiều Ngọc Bích",
    desc: "Làn nước trong mát quanh năm, trong vắt như ngọc bích giữa lòng rừng già nguyên sinh.",
  },
  {
    num: "03",
    label: "Văn Hóa Bru-Vân Kiều",
    desc: "Trải nghiệm đời sống và văn hóa đồng bào thiểu số bản địa còn vẹn nguyên nét xưa.",
  },
  {
    num: "04",
    label: "Detox Hoàn Toàn",
    desc: "Không wifi, không sóng — chỉ tiếng suối và gió rừng thuần túy, bình yên đến tận cùng.",
  },
];

const QUICK_STATS = [
  { value: "2022", label: "Năm thành lập" },
  { value: "50km", label: "Từ trung tâm Đông Hà" },
  { value: "08–17h", label: "Giờ mở cửa hàng ngày" },
];

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80";

export default function AboutSection({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="relative bg-white py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-start gap-16 lg:grid-cols-[5fr_6fr] lg:gap-20">

          {/* Left: Text */}
          <div>
            <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Về Sơn Kiều
            </p>

            <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-normal italic
                           leading-[1.06] tracking-[0.04em] text-gray-950">
              Nơi Trú Ẩn Giữa<br />Đại Ngàn Trường Sơn
            </h2>

            <div className="my-8 flex items-center gap-4">
              <span className="block h-px w-12 bg-gray-200" />
              <span className="text-[#22c55e] opacity-70">✦</span>
              <span className="block h-px w-12 bg-gray-200" />
            </div>

            <p className="text-[15.5px] leading-[2] text-gray-500">
              Cái tên <strong className="font-semibold text-gray-700">Sơn Kiều</strong> được ghép từ hang{" "}
              <strong className="font-semibold text-gray-700">Sơn</strong> Bồi và suối{" "}
              <strong className="font-semibold text-gray-700">Kiều</strong> — hai linh hồn của vùng đất này.
              Nằm giữa đại ngàn Trường Sơn, tỉnh Quảng Trị, khu du lịch là nơi hội tụ của hang động
              triệu năm tuổi, dòng suối ngọc bích và đời sống văn hóa đồng bào Bru-Vân Kiều.
            </p>

            <p className="mt-4 text-[15.5px] leading-[2] text-gray-500">
              Đến đây, bạn buông bỏ điện thoại, quên đi nhịp sống ồn ào — chỉ còn tiếng suối
              rì rào, gió rừng mát lạnh và cảm giác bình yên hiếm có giữa thiên nhiên hoang sơ.
            </p>

            {/* Quick stats */}
            <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-gray-100 pt-8">
              {QUICK_STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-[2rem] font-normal italic tracking-[0.04em] text-gray-900">
                    {value}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2.5 border border-[#052e16]
                         px-7 py-3 text-[11px] font-bold uppercase tracking-[0.22em]
                         text-[#052e16] transition hover:bg-[#052e16] hover:text-white"
              style={{ borderRadius: 0 }}
            >
              Tìm Hiểu Thêm
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="relative h-[560px] w-full overflow-hidden">
              <Image
                src={imageUrl || FALLBACK_IMAGE}
                alt="Cảnh quan Sơn Kiều"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={(imageUrl || FALLBACK_IMAGE).startsWith("http")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#052e16]/30 via-transparent to-transparent" />

              {/* Open badge */}
              <div className="absolute left-5 top-5 flex items-center gap-2
                              border border-white/30 bg-white/15 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  Đang mở cửa
                </span>
              </div>
            </div>

            {/* Floating rating */}
            <div className="absolute -bottom-5 right-0 w-56 border border-gray-100
                            bg-white px-5 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
              <div className="flex items-center gap-3">
                <p className="font-display text-[2.4rem] font-normal italic text-gray-900">4.8</p>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                    1,200+ đánh giá
                  </p>
                </div>
              </div>
              <p className="mt-1.5 text-[10px] text-gray-400">Được yêu thích nhất Quảng Trị</p>
            </div>
          </div>
        </div>

        {/* Pillars grid */}
        <div className="mt-28 grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ num, label, desc }) => (
            <div key={num}
              className="group bg-white p-8 transition-colors hover:bg-[#052e16]/[0.02]">
              <p className="mb-5 font-display text-[3.5rem] font-normal italic leading-none
                             tracking-[0.04em] text-gray-100 transition-colors
                             group-hover:text-[#22c55e]/25">
                {num}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">
                {label}
              </p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
