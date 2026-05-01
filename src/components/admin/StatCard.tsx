import type { ReactNode } from "react";

interface StatCardProps {
  icon:    ReactNode;
  label:   string;
  value:   string | number;
  sub?:    string;
  trend?:  { value: number; label: string };
  color?:  "green" | "blue" | "amber" | "red" | "purple";
}

const COLORS: Record<string, { icon: string; glow: string; bar: string; badge: string }> = {
  green:  { icon: "from-emerald-400 to-teal-500",   glow: "shadow-emerald-200", bar: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
  blue:   { icon: "from-blue-400   to-indigo-500",  glow: "shadow-blue-200",   bar: "bg-blue-400",    badge: "bg-blue-50 text-blue-700"       },
  amber:  { icon: "from-amber-400  to-orange-500",  glow: "shadow-amber-200",  bar: "bg-amber-400",   badge: "bg-amber-50 text-amber-700"     },
  red:    { icon: "from-red-400    to-rose-500",     glow: "shadow-red-200",    bar: "bg-red-400",     badge: "bg-red-50 text-red-600"         },
  purple: { icon: "from-violet-400 to-purple-500",  glow: "shadow-violet-200", bar: "bg-violet-400",  badge: "bg-violet-50 text-violet-700"   },
};

export default function StatCard({ icon, label, value, sub, trend, color = "green" }: StatCardProps) {
  const c  = COLORS[color] ?? COLORS.green;
  const up = !trend || trend.value >= 0;
  const valueStr = String(value);
  const isLong = valueStr.length > 9;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5
                    shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]
                    transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] hover:-translate-y-0.5">

      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl
                         bg-gradient-to-br ${c.icon} text-white
                         shadow-lg ${c.glow}`}>
          {icon}
        </div>

        {trend && (
          <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5
                            text-[11px] font-bold ${
            up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
          }`}>
            {up ? "↑" : "↓"} {Math.abs(trend.value)}%
            <span className="font-normal text-gray-400 ml-0.5">{trend.label}</span>
          </span>
        )}
      </div>

      {/* Value */}
      <p className={`mt-4 font-black leading-none tracking-tight text-gray-900 tabular-nums ${
        isLong ? "text-[1.35rem]" : "text-[1.75rem]"
      }`}>
        {value}
      </p>

      {/* Label */}
      <p className="mt-1.5 text-[12px] font-semibold text-gray-500">{label}</p>

      {/* Sub */}
      {sub && (
        <p className="mt-1 text-[11px] text-gray-400 leading-snug">{sub}</p>
      )}

      {/* Bottom accent bar */}
      <div className={`absolute bottom-0 left-0 h-[3px] w-full ${c.bar} opacity-60`} />

      {/* Decorative circle */}
      <div className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full
                       bg-gradient-to-br ${c.icon} opacity-[0.05]`} />
    </div>
  );
}
