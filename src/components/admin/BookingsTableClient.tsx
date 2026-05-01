"use client";

import { useState, useEffect } from "react";
import BookingActionsCell      from "./BookingActionsCell";
import BookingDetailModal      from "./BookingDetailModal";


const STATUS_BADGE: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
  PAID:       "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
  CANCELLED:  "bg-red-50 text-red-600 ring-1 ring-red-200/60",
  CHECKED_IN: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60",
  REFUNDED:   "bg-orange-50 text-orange-600 ring-1 ring-orange-200/60",
};
const STATUS_VN: Record<string, string> = {
  PENDING:    "Chờ TT",
  PAID:       "Đã CK ✓",
  CANCELLED:  "Đã hủy",
  CHECKED_IN: "Đã check-in",
  REFUNDED:   "Hoàn tiền",
};

export interface OrderGroup {
  key:        string;
  bookingRef: string | null;
  ids:        string[];
  qrTokens:   string[];
  guest:      { name: string; phone: string; email: string; count: number };
  activities: string[];
  date:       string;
  time:       string;
  total:      number;
  status:     string;
  createdAt:  string;
}

interface Props { groups: OrderGroup[] }

type Selected = { bookingRef: string | null; ids: string[] };

export default function BookingsTableClient({ groups }: Props) {
  const [selected,  setSelected]  = useState<Selected | null>(null);
  const [canCancel, setCanCancel] = useState(false);
  const [role,      setRole]      = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        setCanCancel(d?.role === "SUPER_ADMIN");
        setRole(d?.role ?? "");
      })
      .catch(() => {});
  }, []);

  function openModal(g: OrderGroup) {
    setSelected({ bookingRef: g.bookingRef, ids: g.ids });
  }

  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
          </svg>
        </div>
        <p className="text-[13px] font-semibold text-gray-500">Không tìm thấy đơn nào</p>
        <p className="text-[11px] text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70">
              {["Khách hàng", "Mã đặt vé", "Hoạt động", "Ngày tham quan", "Thời gian đặt", "Khách", "Tổng tiền", "Trạng thái", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g, idx) => (
              <tr
                key={g.key}
                onClick={() => openModal(g)}
                className={`align-middle cursor-pointer transition-colors hover:bg-emerald-50/40 ${
                  idx < groups.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <td className="px-5 py-3.5">
                  <p className="text-[13px] font-semibold text-gray-900">{g.guest.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{g.guest.phone}</p>
                </td>
                <td className="px-5 py-3.5">
                  {g.bookingRef
                    ? <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">{g.bookingRef}</span>
                    : <span className="font-mono text-[11px] text-gray-400">{g.qrTokens[0]?.slice(0, 8).toUpperCase()}</span>
                  }
                  {g.ids.length > 1 && (
                    <p className="text-[10px] text-gray-400 mt-1">{g.ids.length} hoạt động</p>
                  )}
                </td>
                <td className="px-5 py-3.5 max-w-[200px]">
                  {g.activities.length === 0 ? (
                    <span className="text-gray-400 text-[12px]">—</span>
                  ) : (
                    <>
                      {g.activities.slice(0, 2).map((name, i) => (
                        <p key={i} className="text-[12px] text-gray-700 leading-5 truncate">{name}</p>
                      ))}
                      {g.activities.length > 2 && (
                        <p className="text-[11px] text-gray-400 mt-0.5">+{g.activities.length - 2} khác</p>
                      )}
                    </>
                  )}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap" suppressHydrationWarning>
                  <p className="text-[12px] font-semibold text-gray-700">
                    {new Date(g.date + "T00:00:00").toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}
                  </p>
                  <span className="font-mono text-[12px] font-bold text-emerald-600">{g.time?.slice(0, 5)}</span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap" suppressHydrationWarning>
                  <p className="text-[12px] font-medium text-gray-700">
                    {new Date(g.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </p>
                  <p className="font-mono text-[11px] text-gray-400 mt-0.5">
                    {new Date(g.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className="text-[13px] font-bold text-gray-700">{g.guest.count}</span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="text-[13px] font-bold text-gray-900">
                    {new Intl.NumberFormat("vi-VN").format(g.total)}đ
                  </span>
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap ${STATUS_BADGE[g.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_VN[g.status] ?? g.status}
                  </span>
                </td>
                {/* Stop propagation so row click doesn't fire when using action menu */}
                <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                  <BookingActionsCell ids={g.ids} status={g.status} role={role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <BookingDetailModal
          bookingRef={selected.bookingRef}
          ids={selected.ids}
          canCancel={canCancel}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
