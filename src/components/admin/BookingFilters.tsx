"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const STATUSES = [
  { value: "",           label: "Tất cả",      dot: "bg-gray-300"    },
  { value: "PENDING",    label: "Chờ TT",       dot: "bg-amber-500"   },
  { value: "PAID",       label: "Đã CK",        dot: "bg-emerald-500" },
  { value: "CHECKED_IN", label: "Đã check-in",  dot: "bg-blue-500"    },
  { value: "CANCELLED",  label: "Đã hủy",       dot: "bg-red-400"     },
  { value: "REFUNDED",   label: "Hoàn tiền",    dot: "bg-orange-400"  },
];

const CATEGORIES = [
  { value: "",            label: "Tất cả loại" },
  { value: "CAVE",        label: "🦇 Hang động" },
  { value: "LAKE",        label: "🏊 Hồ bơi"   },
  { value: "SIGHTSEEING", label: "🌄 Tham quan" },
];

export default function BookingFilters() {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const curStatus   = searchParams.get("status")   ?? "";
  const curCategory = searchParams.get("category") ?? "";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] space-y-3">

      {/* Row 1: search + date + category */}
      <div className="flex flex-wrap gap-3">

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Tên, SĐT, email..."
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(e) => update("q", e.target.value)}
            className="h-9 w-56 rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-3 text-[13px] placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
          />
        </div>

        {/* Date */}
        <input
          type="date"
          defaultValue={searchParams.get("date") ?? ""}
          onChange={(e) => update("date", e.target.value)}
          className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-700 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
        />

        {/* Category */}
        <select
          value={curCategory}
          onChange={(e) => update("category", e.target.value)}
          className="h-9 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-700 focus:border-emerald-500 focus:outline-none cursor-pointer">
          {CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Row 2: status pills */}
      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map(({ value, label, dot }) => {
          const active = curStatus === value;
          return (
            <button
              key={value}
              onClick={() => update("status", value)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold transition-all ${
                active
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-white/70" : dot}`} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
