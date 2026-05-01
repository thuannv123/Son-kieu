const STATS = [
  {
    value: "5,000+",
    label: "Lượt Khách",
    sub: "đón tiếp mỗi năm",
    gradient: "from-emerald-300 to-teal-200",
    glow: "rgba(16,185,129,0.15)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    value: "4.8★",
    label: "Điểm Đánh Giá",
    sub: "từ 1,200+ khách",
    gradient: "from-yellow-300 to-amber-200",
    glow: "rgba(234,179,8,0.13)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    value: "3+",
    label: "Năm Hoạt Động",
    sub: "liên tục & uy tín",
    gradient: "from-sky-300 to-cyan-200",
    glow: "rgba(14,165,233,0.13)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    value: "100%",
    label: "Hài Lòng",
    sub: "cam kết hoàn tiền",
    gradient: "from-violet-300 to-purple-200",
    glow: "rgba(139,92,246,0.13)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

export default function StatsBar() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.06]"
      style={{ background: "linear-gradient(180deg,#081510 0%,#0a1c14 100%)" }}>

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      {/* Center radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-[700px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 70%)" }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map(({ value, label, sub, gradient, glow, icon }, i) => (
            <div key={i} className="group relative flex flex-col items-center gap-4 px-4 py-12 text-center md:px-8">

              {/* Divider (gradient, skips last on each row) */}
              {i % 2 !== 1 && i !== STATS.length - 1 && (
                <div className="absolute right-0 top-[20%] h-[60%] w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
              )}
              {i === 1 && (
                <div className="absolute right-0 top-[20%] hidden h-[60%] w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent md:block" />
              )}
              {i === 2 && (
                <div className="absolute right-0 top-[20%] hidden h-[60%] w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent md:block" />
              )}

              {/* Icon with glow */}
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl
                              text-emerald-400 ring-1 ring-white/[0.08]
                              transition-all duration-300 group-hover:scale-105"
                style={{
                  background: `rgba(255,255,255,0.04)`,
                  boxShadow: `0 0 20px ${glow}`,
                }}>
                {icon}
              </div>

              {/* Value — gradient text */}
              <div>
                <p className={`bg-gradient-to-r ${gradient} bg-clip-text text-[2.6rem] font-black leading-none text-transparent`}>
                  {value}
                </p>
                <p className="mt-2 text-[13px] font-bold text-gray-200">{label}</p>
                <p className="mt-0.5 text-[11px] text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
    </section>
  );
}
