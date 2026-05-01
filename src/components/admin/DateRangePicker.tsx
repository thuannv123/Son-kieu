"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

function toISO(d: Date) { return d.toISOString().slice(0, 10); }

interface Props { defaultPreset?: string }

export default function DateRangePicker({ defaultPreset = "today" }: Props) {
  const router   = useRouter();
  const pathname = usePathname();
  const params   = useSearchParams();

  const today = useMemo(() => toISO(new Date()), []);

  const presets = useMemo(() => {
    const d = (n: number) => { const x = new Date(); x.setDate(x.getDate() - n); return toISO(x); };
    const m = () => { const x = new Date(); x.setDate(1); return toISO(x); };
    return [
      { key: "today",     label: "Hôm nay",    from: today,   to: today   },
      { key: "yesterday", label: "Hôm qua",    from: d(1),    to: d(1)    },
      { key: "7d",        label: "7 ngày",     from: d(6),    to: today   },
      { key: "month",     label: "Tháng này",  from: m(),     to: today   },
    ];
  }, [today]);

  const urlFrom = params.get("from");
  const urlTo   = params.get("to");

  const activePreset = useMemo(() => {
    if (!urlFrom && !urlTo) return defaultPreset;
    return presets.find(p => p.from === urlFrom && p.to === urlTo)?.key ?? "custom";
  }, [urlFrom, urlTo, defaultPreset, presets]);

  const fallback   = presets.find(p => p.key === defaultPreset) ?? presets[0];
  const displayFrom = urlFrom || fallback.from;
  const displayTo   = urlTo   || fallback.to;

  const navigate = useCallback((from: string, to: string) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("from", from);
    sp.set("to", to);
    router.push(`${pathname}?${sp.toString()}`);
  }, [router, pathname, params]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Preset pills */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {presets.map(p => (
          <button key={p.key} onClick={() => navigate(p.from, p.to)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition ${
              activePreset === p.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom date range */}
      <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <input type="date"
          value={displayFrom} max={displayTo}
          onChange={e => navigate(e.target.value, displayTo)}
          className="text-[12px] text-gray-700 focus:outline-none bg-transparent cursor-pointer" />
        <span className="text-[11px] text-gray-300 font-bold">—</span>
        <input type="date"
          value={displayTo} min={displayFrom} max={today}
          onChange={e => navigate(displayFrom, e.target.value)}
          className="text-[12px] text-gray-700 focus:outline-none bg-transparent cursor-pointer" />
      </div>
    </div>
  );
}
