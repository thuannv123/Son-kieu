import Link from "next/link";

const STEPS = [
  {
    num:   "01",
    title: "Chọn Hoạt Động",
    desc:  "Duyệt hang động, hồ suối và tour tham quan. Xem ảnh, giá vé và hướng dẫn an toàn.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ),
  },
  {
    num:   "02",
    title: "Chọn Ngày & Số Khách",
    desc:  "Xem lịch trống theo thời gian thực. Chọn khung giờ phù hợp và số lượng người.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    num:   "03",
    title: "Thanh Toán An Toàn",
    desc:  "Chuyển khoản ngân hàng, ví điện tử hoặc thẻ. Xác nhận tức thì — không chờ đợi.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    num:   "04",
    title: "Nhận Mã QR",
    desc:  "Vé điện tử với mã QR độc nhất gửi ngay. Xuất trình tại cổng — không cần in giấy.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-20 text-center">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
            Đơn Giản & Nhanh Chóng
          </p>
          <h2 className="font-display text-[clamp(2.6rem,6vw,5rem)] font-normal italic
                         leading-[1.06] tracking-[0.04em] text-gray-950">
            Đặt Vé Trong 60 Giây
          </h2>
          <div className="my-7 flex items-center justify-center gap-4">
            <span className="block h-px w-14 bg-gray-200" />
            <span className="text-[#22c55e] opacity-60">✦</span>
            <span className="block h-px w-14 bg-gray-200" />
          </div>
          <p className="mx-auto max-w-sm text-[15px] font-light leading-[2] text-gray-400">
            Hoàn thành trên điện thoại — nhận QR tức thì, không cần in.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ num, title, desc, icon }) => (
            <div key={num}
              className="group relative flex flex-col bg-white p-8
                         transition-colors hover:bg-[#052e16]/[0.02]">

              {/* Number watermark */}
              <p className="pointer-events-none absolute right-5 top-4 select-none
                             font-display text-[5rem] font-normal italic leading-none
                             tracking-[0.04em] text-gray-50 transition-colors
                             group-hover:text-[#22c55e]/10">
                {num}
              </p>

              {/* Icon */}
              <div className="relative z-10 mb-6 flex h-12 w-12 items-center justify-center
                              border border-gray-200 text-[#052e16] transition-colors
                              group-hover:border-[#22c55e] group-hover:text-[#22c55e]">
                {icon}
              </div>

              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-gray-300 mb-2">
                Bước {num}
              </p>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-gray-900">
                {title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center gap-3">
          <Link href="/booking"
            className="inline-flex items-center gap-2.5 border border-[#052e16] bg-[#052e16]
                       px-9 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em]
                       text-white transition hover:bg-[#073d1e]"
            style={{ borderRadius: 0 }}>
            Bắt Đầu Đặt Vé
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <p className="text-[11px] uppercase tracking-[0.16em] text-gray-300">
            Xác nhận tức thì · Không cần tài khoản
          </p>
        </div>
      </div>
    </section>
  );
}
