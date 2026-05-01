import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "Chọn Hoạt Động",
    desc:  "Duyệt hang động, hồ suối và tour tham quan. Xem ảnh, giá vé và hướng dẫn an toàn.",
    color: "from-violet-500 to-purple-600",
    ring:  "ring-violet-200",
    num:   "text-violet-100",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
  },
  {
    step: "02",
    title: "Chọn Ngày & Số Khách",
    desc:  "Xem lịch trống theo thời gian thực. Chọn khung giờ phù hợp và số lượng người.",
    color: "from-blue-500 to-cyan-500",
    ring:  "ring-blue-200",
    num:   "text-blue-100",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    step: "03",
    title: "Thanh Toán An Toàn",
    desc:  "Chuyển khoản ngân hàng, ví điện tử hoặc thẻ. Xác nhận tức thì — không chờ đợi.",
    color: "from-emerald-500 to-teal-500",
    ring:  "ring-emerald-200",
    num:   "text-emerald-100",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    step: "04",
    title: "Nhận Mã QR",
    desc:  "Vé điện tử với mã QR độc nhất gửi ngay. Xuất trình tại cổng — không cần in giấy.",
    color: "from-orange-500 to-rose-500",
    ring:  "ring-orange-200",
    num:   "text-orange-100",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3"  y="3"  width="7" height="7"/>
        <rect x="14" y="3"  width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3"  y="14" width="7" height="7"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gray-50/60 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24
                      bg-gradient-to-b from-white/60 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <p className="label mb-3">Đơn giản &amp; Nhanh chóng</p>
          <h2 className="text-3xl font-black text-gray-900 md:text-4xl">
            Đặt vé trong{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500
                             bg-clip-text text-transparent">
              60 giây
            </span>
          </h2>
          <p className="mt-3 text-[15px] text-gray-500">
            Hoàn thành trên điện thoại — nhận QR tức thì, không cần in.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-10 md:grid-cols-4 md:gap-6">

          {/* Gradient connector line */}
          <div className="absolute left-[calc(12.5%+27px)] right-[calc(12.5%+27px)] top-[27px]
                          hidden h-px md:block"
            style={{ background: "linear-gradient(to right,#c4b5fd,#93c5fd,#6ee7b7,#fdba74)" }} />

          {STEPS.map(({ step, title, desc, color, ring, num, icon }) => (
            <div key={step} className="group relative flex flex-col items-center text-center">

              {/* Step circle */}
              <div className={`relative z-10 flex h-[54px] w-[54px] items-center justify-center
                              rounded-2xl bg-gradient-to-br ${color} shadow-lg
                              transition-transform duration-300
                              group-hover:-translate-y-1 group-hover:scale-110`}>
                {icon}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color}
                                 blur-[12px] opacity-40 -z-10 scale-110`} />
              </div>

              <span className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Bước {step}
              </span>

              {/* Content card */}
              <div className={`relative mt-3 w-full overflow-hidden rounded-2xl bg-white px-4 py-4
                               shadow-[0_2px_16px_rgba(0,0,0,0.06)] ring-1 ring-gray-100
                               transition-all duration-300
                               group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]
                               group-hover:ring-1 ${ring}`}>
                <span className={`pointer-events-none absolute right-2 top-0 select-none
                                  text-[52px] font-black leading-none opacity-[0.07] ${num}`}>
                  {step}
                </span>
                <h3 className="text-[14px] font-bold text-gray-900">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-3">
          <Link href="/booking"
            className="inline-flex items-center gap-2.5 rounded-full bg-emerald-600
                       px-8 py-3.5 text-[14px] font-bold text-white shadow-lg
                       transition-all duration-200 hover:bg-emerald-500 hover:-translate-y-0.5
                       hover:shadow-[0_8px_24px_rgba(16,185,129,0.35)]">
            Bắt Đầu Đặt Vé
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <p className="text-[12px] text-gray-400">Xác nhận tức thì · Không cần tài khoản</p>
        </div>
      </div>
    </section>
  );
}
