"use client";

import { useState } from "react";
import ActivityFormModal from "./ActivityFormModal";

interface Activity {
  id:               string;
  name:             string;
  slug?:            string;
  category:         string;
  description:      string;
  content?:         string;
  safety_guideline?: string;
  highlights?:      string[];
  price:            number;
  duration_minutes: number;
  max_capacity:     number;
  max_per_slot:     number;
  difficulty_level: string;
  is_active:        boolean;
  image_url?:       string;
  today_guests:     number;
}

const CAT_META: Record<string, { label: string; color: string }> = {
  CAVE:        { label: "🦇 Hang Động",  color: "bg-slate-100 text-slate-700"   },
  LAKE:        { label: "🏊 Hồ Bơi",    color: "bg-cyan-100  text-cyan-700"    },
  SIGHTSEEING: { label: "🌄 Tham Quan",  color: "bg-emerald-100 text-emerald-700" },
  DINING:      { label: "🍽️ Ẩm Thực",   color: "bg-orange-100 text-orange-700"  },
};

const DIFF_COLOR: Record<string, string> = {
  EASY:   "bg-green-50  text-green-700",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HARD:   "bg-orange-50 text-orange-700",
  EXPERT: "bg-red-50    text-red-700",
};

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

export default function ActivitiesManager({ activities }: { activities: Activity[] }) {
  const [modal, setModal] = useState<"new" | Activity | null>(null);

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">Quản lý Hoạt Động</h1>
            <p className="mt-0.5 text-[13px] text-gray-400">
              {activities.length} hoạt động · {activities.filter(a => a.is_active).length} đang mở
            </p>
          </div>
          <button onClick={() => setModal("new")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5
                       text-[13px] font-semibold text-white transition hover:bg-emerald-700">
            <PlusIcon />
            Thêm hoạt động
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_12px_rgba(0,0,0,0.06)]
                        ring-1 ring-black/[0.05]">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {["Hoạt động", "Loại", "Giá vé", "Hôm nay", "Bài viết", "Trạng thái", ""].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold
                                           uppercase tracking-wider text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => {
                  const cat = CAT_META[a.category];
                  const pct = a.max_capacity > 0
                    ? Math.min(100, Math.round((a.today_guests / a.max_capacity) * 100))
                    : 0;

                  return (
                    <tr key={a.id} className="transition-colors hover:bg-gray-50/60"
                      style={{ borderBottom: "1px solid #f8fafc" }}>

                      {/* Name + desc */}
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-gray-900">{a.name}</p>
                        <p className="mt-0.5 line-clamp-1 max-w-[220px] text-[11px] text-gray-400">
                          {a.description || "Chưa có mô tả"}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cat?.color}`}>
                          {cat?.label}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 font-semibold text-gray-800">
                        {new Intl.NumberFormat("vi-VN").format(a.price)}đ
                      </td>

                      {/* Capacity bar */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                            <div className={`h-full rounded-full transition-all ${
                              pct > 80 ? "bg-red-400" : pct > 50 ? "bg-amber-400" : "bg-emerald-400"
                            }`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {a.today_guests}/{a.max_capacity}
                          </span>
                        </div>
                      </td>

                      {/* Has article */}
                      <td className="px-4 py-3.5">
                        {a.content ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">✓</span>
                        ) : (
                          <span className="text-[11px] text-gray-300">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${
                          a.is_active
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60"
                            : "bg-red-50 text-red-600 ring-red-200/60"
                        }`}>
                          {a.is_active ? "Đang mở" : "Đã đóng"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <button onClick={() => setModal(a)}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-200
                                     px-3 py-1.5 text-[12px] font-semibold text-gray-600
                                     transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                          <EditIcon /> Sửa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {activities.length === 0 && (
              <div className="py-16 text-center text-[13px] text-gray-400">
                Chưa có hoạt động nào.{" "}
                <button onClick={() => setModal("new")} className="font-semibold text-emerald-600 underline">
                  Thêm mới ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <ActivityFormModal
          activity={modal === "new" ? undefined : modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
