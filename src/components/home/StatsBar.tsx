const STATS = [
  { value: "5,000+", label: "Lượt khách",   sub: "đón tiếp mỗi năm"               },
  { value: "4.8",    label: "Điểm đánh giá", sub: "từ 1,200+ khách",  star: true   },
  { value: "3+",     label: "Năm hoạt động", sub: "liên tục & uy tín"              },
  { value: "100%",   label: "Hài lòng",      sub: "cam kết hoàn tiền"              },
];

export default function StatsBar() {
  return (
    <section className="bg-[#052e16]">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map(({ value, label, sub, star }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-2.5 py-14 text-center md:py-16
                ${i > 0 ? "md:border-l md:border-white/10" : ""}
                ${i === 1 ? "border-l border-white/10" : ""}
                ${i >= 2 ? "border-t border-white/10 md:border-t-0" : ""}`}
            >
              <p className="flex items-start justify-center font-display text-[3.4rem]
                            font-normal italic leading-none tracking-[0.04em] text-white
                            md:text-[3.9rem]">
                {value}
                {star && (
                  <svg className="ml-1.5 mt-2" width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                )}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#22c55e]">
                {label}
              </p>
              <p className="text-[12px] font-light tracking-wide text-white/40">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
