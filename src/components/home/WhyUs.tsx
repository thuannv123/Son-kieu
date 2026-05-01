const FEATURES = [
  {
    title:    "Hướng Dẫn Viên Được Chứng Nhận",
    desc:     "Đội ngũ HDV chuyên nghiệp, cấp phép Bộ VHTTDL — nhiều năm kinh nghiệm dẫn tour hang động và sinh thái.",
    gradient: "from-blue-500 to-indigo-600",
    glow:     "rgba(99,102,241,0.35)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    title:    "An Toàn Là Ưu Tiên Số 1",
    desc:     "Thiết bị bảo hộ chuẩn quốc tế, kiểm tra hàng ngày. Cảnh báo thời tiết tự động — sẵn sàng mọi tình huống.",
    gradient: "from-emerald-500 to-teal-600",
    glow:     "rgba(16,185,129,0.35)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    title:    "Chuẩn Sinh Thái — Không Rác",
    desc:     "Cam kết bảo vệ hệ sinh thái. Giới hạn khách mỗi tour — không để lại gì ngoài những dấu chân.",
    gradient: "from-green-500 to-emerald-600",
    glow:     "rgba(34,197,94,0.35)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3C17 3 10 5 7 12C5 17 8 21 12 21C16 21 19 17 19 13C19 9 16 7 13 8C11 8.5 10 10 11 12C12 14 15 13 15 11"/>
        <path d="M7 12C5 8 6 4 8 3"/>
      </svg>
    ),
  },
  {
    title:    "Nhận QR Trong 60 Giây",
    desc:     "Chọn — thanh toán — nhận mã QR. Không cần in vé, không cần chờ xác nhận qua email.",
    gradient: "from-violet-500 to-purple-600",
    glow:     "rgba(139,92,246,0.35)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3"  y="3"  width="7" height="7"/><rect x="14" y="3"  width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3"  y="14" width="7" height="7"/>
      </svg>
    ),
  },
];

const TRUST = ["Xác nhận tức thì", "HDV được chứng nhận", "Hoàn vé dễ dàng", "Hỗ trợ 7 ngày/tuần"];

export default function WhyUs() {
  return (
    <section className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(160deg,#0d2018 0%,#102416 55%,#0b1c12 100%)" }}>

      {/* Accent lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      {/* Radial center glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[900px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.07) 0%,transparent 70%)" }} />
      </div>

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wdots" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wdots)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            Tại sao chọn chúng tôi
          </p>
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Trải Nghiệm Đáng Tin Cậy
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-gray-400">
            Mỗi chuyến đi là một kỷ niệm đáng nhớ —
            chúng tôi đảm bảo an toàn, chất lượng và sự hài lòng tuyệt đối.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ title, desc, gradient, glow, icon }, i) => (
            <div key={title}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.12]
                         bg-white/[0.06] p-6 backdrop-blur-sm
                         transition-all duration-300 hover:-translate-y-1.5
                         hover:border-white/[0.20] hover:bg-white/[0.10]">

              {/* Icon with glow */}
              <div className={`relative mb-5 flex h-12 w-12 items-center justify-center
                              rounded-2xl bg-gradient-to-br ${gradient}`}
                style={{ boxShadow: `0 0 24px ${glow}` }}>
                {icon}
              </div>

              <h3 className="text-[14px] font-bold leading-snug text-white
                             transition-colors group-hover:text-emerald-300">
                {title}
              </h3>
              <p className="mt-2.5 text-[13px] leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3
                        border-t border-white/[0.06] pt-10">
          {TRUST.map(label => (
            <span key={label} className="flex items-center gap-2 text-[12px] text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
