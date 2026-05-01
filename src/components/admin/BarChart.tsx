interface BarChartProps {
  data:      { label: string; value: number }[];
  currency?: boolean;
  color?:    string;
  height?:   number;
}

function fmtShort(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}k`;
  return String(v);
}

function labelStep(total: number) {
  if (total <= 10) return 1;
  if (total <= 20) return 2;
  if (total <= 35) return 4;
  if (total <= 60) return 7;
  return 10;
}

export default function BarChart({
  data,
  currency = false,
  color    = "emerald",
  height   = 160,
}: BarChartProps) {
  const max  = Math.max(...data.map((d) => d.value), 1);
  const step = labelStep(data.length);

  const cfg = {
    emerald: { bar: "#10b981", glow: "rgba(16,185,129,0.12)", top: "#34d399" },
    blue:    { bar: "#3b82f6", glow: "rgba(59,130,246,0.12)",  top: "#60a5fa" },
    purple:  { bar: "#8b5cf6", glow: "rgba(139,92,246,0.12)", top: "#a78bfa" },
  }[color] ?? { bar: "#10b981", glow: "rgba(16,185,129,0.12)", top: "#34d399" };

  return (
    <div className="relative select-none" style={{ height }}>

      {/* Horizontal grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pb-7 pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-full border-t border-gray-100" />
        ))}
      </div>

      {/* Bars */}
      <div className="relative flex h-full items-end gap-2 pb-7">
        {data.map(({ label, value }) => {
          const pct    = (value / max) * 100;
          const fmtTip = currency
            ? new Intl.NumberFormat("vi-VN").format(value) + "đ"
            : String(value);

          return (
            <div key={label}
              className="group relative flex flex-1 flex-col items-center justify-end"
              style={{ height: "100%" }}>

              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2
                              hidden rounded-xl bg-gray-900 px-3 py-1.5 text-[11px] font-semibold
                              text-white shadow-xl group-hover:block whitespace-nowrap z-10">
                {fmtTip}
                <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>

              {/* Value above bar — hide when too dense */}
              {value > 0 && data.length <= 20 && (
                <span className="absolute text-[9px] font-bold text-gray-400 transition-opacity group-hover:opacity-0"
                  style={{ bottom: `calc(${pct}% + 5px)` }}>
                  {fmtShort(value)}
                </span>
              )}

              {/* Bar */}
              <div className="w-full rounded-t-xl overflow-hidden transition-all duration-500 ease-out"
                style={{
                  height:    `${pct}%`,
                  minHeight: value > 0 ? 4 : 0,
                }}>
                <div className="h-full w-full" style={{
                  background: `linear-gradient(to top, ${cfg.bar}, ${cfg.top})`,
                  boxShadow:  `0 -3px 12px ${cfg.glow}`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels — thin out when many bars */}
      <div className="absolute bottom-0 left-0 right-0 flex gap-2">
        {data.map(({ label }, i) => (
          <div key={`${label}-${i}`} className="flex-1 text-center overflow-hidden">
            {(i % step === 0 || i === data.length - 1) && (
              <span className="text-[10px] font-semibold text-gray-400 whitespace-nowrap">{label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
