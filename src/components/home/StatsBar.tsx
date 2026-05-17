const STATS = [
  {
    value: "5,000+",
    label: "Lượt Khách",
    sub:   "đón tiếp mỗi năm",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    sub:   "từ 1,200+ khách",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    value: "3+",
    label: "Năm Hoạt Động",
    sub:   "liên tục & uy tín",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    value: "100%",
    label: "Hài Lòng",
    sub:   "cam kết hoàn tiền",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

export default function StatsBar() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-px bg-gray-100 md:grid-cols-4">
          {STATS.map(({ value, label, sub, icon }) => (
            <div key={label}
              className="group flex flex-col items-center gap-5 bg-white px-6 py-10
                         text-center transition-colors hover:bg-[#052e16]/[0.02]">

              <div className="flex h-10 w-10 items-center justify-center
                              border border-gray-200 text-[#052e16]/50
                              transition-colors group-hover:border-[#22c55e] group-hover:text-[#22c55e]">
                {icon}
              </div>

              <div>
                <p className="font-display text-[2.8rem] font-normal italic leading-none
                               tracking-[0.04em] text-[#052e16]">
                  {value}
                </p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700">
                  {label}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
