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

        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.34em] text-[#22c55e]">
            Tại Sao Chọn Chúng Tôi
          </p>
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] font-normal italic
                         leading-[1.06] tracking-[0.04em] text-gray-950">
            Trải Nghiệm Đáng Tin Cậy
          </h2>
          <div className="my-7 flex items-center justify-center gap-4">
            <span className="block h-px w-14 bg-gray-200" />
            <span className="text-[#22c55e] opacity-60">✦</span>
            <span className="block h-px w-14 bg-gray-200" />
          </div>
          <p className="mx-auto max-w-lg text-[15px] font-light leading-[2] text-gray-400">
            Mỗi chuyến đi là một kỷ niệm đáng nhớ — chúng tôi đảm bảo an toàn,
            chất lượng và sự hài lòng tuyệt đối.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ title, desc, icon }) => (
            <div key={title}
              className="group relative flex flex-col bg-white p-8
                         transition-colors hover:bg-[#052e16]/[0.02]">

              {/* Icon */}
              <div className="mb-7 flex h-12 w-12 items-center justify-center
                              border border-gray-200 text-[#052e16]/60
                              transition-colors group-hover:border-[#22c55e] group-hover:text-[#22c55e]">
                {icon}
              </div>

              <h3 className="font-display text-[19px] font-normal italic leading-snug
                             tracking-[0.03em] text-gray-950
                             transition-colors group-hover:text-[#16a34a]">
                {title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-400">{desc}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3
                        border-t border-gray-100 pt-10">
          {TRUST.map(label => (
            <span key={label} className="flex items-center gap-2
                                         text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
