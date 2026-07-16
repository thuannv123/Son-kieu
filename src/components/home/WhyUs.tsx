const FEATURES = [
  {
    title: "Hướng Dẫn Viên Được Chứng Nhận",
    desc:  "Đội ngũ HDV chuyên nghiệp, cấp phép Bộ VHTTDL — nhiều năm kinh nghiệm dẫn tour hang động và sinh thái.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    title: "An Toàn Là Ưu Tiên Số 1",
    desc:  "Thiết bị bảo hộ chuẩn quốc tế, kiểm tra hàng ngày. Cảnh báo thời tiết tự động — sẵn sàng mọi tình huống.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    title: "Chuẩn Sinh Thái — Không Rác",
    desc:  "Cam kết bảo vệ hệ sinh thái. Giới hạn khách mỗi tour — không để lại gì ngoài những dấu chân.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3C17 3 10 5 7 12C5 17 8 21 12 21C16 21 19 17 19 13C19 9 16 7 13 8C11 8.5 10 10 11 12C12 14 15 13 15 11"/>
        <path d="M7 12C5 8 6 4 8 3"/>
      </svg>
    ),
  },
  {
    title: "Nhận QR Trong 60 Giây",
    desc:  "Chọn — thanh toán — nhận mã QR. Không cần in vé, không cần chờ xác nhận qua email.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3"  y="3"  width="7" height="7"/>
        <rect x="14" y="3"  width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3"  y="14" width="7" height="7"/>
      </svg>
    ),
  },
];

const TRUST = [
  "Xác nhận tức thì",
  "HDV được chứng nhận",
  "Hoàn vé dễ dàng",
  "Hỗ trợ 7 ngày/tuần",
];

export default function WhyUs() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">

          {/* ── Left — heading + intro + trust ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
              Tại Sao Chọn Chúng Tôi
            </p>
            <h2 className="font-display text-[clamp(2.2rem,4vw,3.3rem)] font-normal italic
                           leading-[1.08] tracking-[0.04em] text-gray-950">
              Trải Nghiệm<br />Đáng Tin Cậy
            </h2>
            <div className="my-7 flex items-center gap-4">
              <span className="block h-px w-12 bg-gray-200" />
              <span className="text-[#22c55e] opacity-60">✦</span>
            </div>
            <p className="max-w-sm text-[15px] font-light leading-[2] text-gray-500">
              Mỗi chuyến đi là một kỷ niệm đáng nhớ — chúng tôi đảm bảo an toàn,
              chất lượng và sự hài lòng tuyệt đối.
            </p>

            {/* Trust badges */}
            <div className="mt-10 grid max-w-sm grid-cols-2 gap-x-6 gap-y-4
                            border-t border-gray-100 pt-8">
              {TRUST.map(label => (
                <span key={label} className="flex items-center gap-2
                                             text-[11px] font-bold uppercase tracking-[0.14em] text-gray-500">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right — feature list ── */}
          <div className="border-t border-gray-200">
            {FEATURES.map(({ title, desc, icon }) => (
              <div key={title}
                className="group flex items-start gap-5 border-b border-gray-200 py-7
                           transition-all duration-300 hover:pl-2 md:py-8">
                <span className="mt-1 shrink-0 text-[#16a34a] transition-colors group-hover:text-[#22c55e]">
                  {icon}
                </span>
                <div>
                  <h3 className="font-display text-[1.35rem] font-normal italic leading-tight
                                 tracking-[0.02em] text-gray-950 transition-colors
                                 group-hover:text-[#16a34a]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.9] text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
