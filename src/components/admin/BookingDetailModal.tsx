"use client";

import { useState, useEffect, useTransition, Fragment } from "react";
import { useRouter } from "next/navigation";

interface Activity { id: string; name: string; category: string; price: number }
interface Dish     { dish_name: string; qty: number; unit_price: string }

interface RefundInfo {
  proofUrl:  string;
  note:      string | null;
  createdAt: string;
}

interface BookingDetail {
  bookingRef:     string | null;
  status:         string;
  guest:          { name: string; phone: string; email: string; count: number };
  date:           string;
  time:           string;
  qrToken:        string | null;
  activities:     Activity[];
  dishes:         Dish[];
  activityTotal:  number;
  dishTotal:      number;
  total:          number;
  ids:            string[];
  refund:         RefundInfo | null;
}

const STATUS_CFG: Record<string, { label: string; badge: string; dot: string }> = {
  PENDING:    { label: "Chờ thanh toán",          badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-400"   },
  PAID:       { label: "Chuyển khoản thành công", badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  CANCELLED:  { label: "Đã hủy",                  badge: "bg-red-50 text-red-600 ring-1 ring-red-200",             dot: "bg-red-400"     },
  CHECKED_IN: { label: "Đã check-in",             badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",          dot: "bg-blue-500"    },
  REFUNDED:   { label: "Đã hoàn tiền",            badge: "bg-orange-50 text-orange-600 ring-1 ring-orange-200",    dot: "bg-orange-400"  },
};

const CAT_ICON: Record<string, string> = {
  CAVE: "🦇", LAKE: "🏊", SIGHTSEEING: "🌄",
};

function fmt(n: number) { return new Intl.NumberFormat("vi-VN").format(n); }
function parseDishPrice(price: string) { return Number((price ?? "").replace(/[^\d]/g, "")) || 0; }

interface Props {
  bookingRef: string | null;
  ids:        string[];
  onClose:    () => void;
  onChanged?: () => void;
  canCancel?: boolean;
}

export default function BookingDetailModal({ bookingRef, ids, onClose, onChanged, canCancel = true }: Props) {
  const [detail,   setDetail]   = useState<BookingDetail | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [pending,  start]       = useTransition();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setFetchErr("");
    const url = bookingRef
      ? `/api/admin/bookings/detail?ref=${encodeURIComponent(bookingRef)}`
      : `/api/admin/bookings/detail?ids=${ids.join(",")}`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (d.error) setFetchErr(d.error);
        else setDetail(d);
      })
      .catch(() => setFetchErr("Lỗi kết nối"))
      .finally(() => setLoading(false));
  }, [bookingRef, ids]);

  function act(action: "paid" | "cancel" | "checkin") {
    const statusMap = { paid: "PAID", cancel: "CANCELLED", checkin: "CHECKED_IN" } as const;
    start(async () => {
      const res = await fetch("/api/admin/bookings/confirm-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: detail?.ids ?? ids, status: statusMap[action] }),
      });
      if (res.ok) {
        onClose();
        onChanged?.();
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        setAlertMsg((err as { error?: string }).error ?? "Thao tác thất bại");
      }
    });
  }

  const status = detail?.status ?? "";
  const cfg    = STATUS_CFG[status] ?? { label: status, badge: "bg-gray-100 text-gray-600", dot: "bg-gray-400" };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/[0.08]"
        style={{ maxHeight: "calc(100dvh - 2rem)" }}>

        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              🎫
            </div>
            <div>
              <p className="text-[14px] font-black text-gray-900 leading-tight">
                {loading ? "Đang tải..." : (detail?.bookingRef ?? "Chi tiết đơn")}
              </p>
              {detail && (
                <span className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(100dvh - 10rem)" }}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-gray-200 border-t-emerald-600" />
            </div>
          ) : fetchErr ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[13px] font-semibold text-red-600">{fetchErr}</p>
            </div>
          ) : detail ? (
            <div className="p-5 space-y-4">

              {/* Guest info */}
              <section className="overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                <div className="px-4 py-2.5 bg-gray-100/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Thông tin khách</p>
                </div>
                <div className="px-4 py-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  {[
                    ["Họ tên",      detail.guest.name],
                    ["Điện thoại",  detail.guest.phone],
                    ...(detail.guest.email ? [["Email", detail.guest.email] as [string,string]] : []),
                    ["Số khách",    `${detail.guest.count} người`],
                    ["Ngày",        new Date(detail.date + "T00:00:00").toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
                    ["Giờ vào",     detail.time],
                  ].map(([label, value]) => (
                    <Fragment key={label}>
                      <span className="text-[12px] text-gray-500 whitespace-nowrap">{label}</span>
                      <span className={`text-[12px] font-semibold text-right ${label === "Giờ vào" ? "font-mono text-emerald-700" : "text-gray-900"} truncate`}>
                        {value}
                      </span>
                    </Fragment>
                  ))}
                </div>
              </section>

              {/* Activities */}
              <section>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Hoạt động ({detail.activities.length})
                </p>
                <div className="space-y-1.5">
                  {detail.activities.map((act, i) => (
                    <div key={i}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-3.5 py-2.5 ring-1 ring-gray-100">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="shrink-0 text-base">{CAT_ICON[act.category] ?? "🎯"}</span>
                        <span className="text-[13px] font-medium text-gray-800 truncate">{act.name}</span>
                      </div>
                      {act.price > 0 && (
                        <span className="ml-3 shrink-0 text-[12px] font-bold text-gray-900">{fmt(act.price)}đ</span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Dishes */}
              {detail.dishes.length > 0 && (
                <section>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Ẩm thực đặt kèm ({detail.dishes.length} món)
                  </p>
                  <div className="space-y-1.5">
                    {detail.dishes.map((d, i) => (
                      <div key={i}
                        className="flex items-center justify-between rounded-xl bg-orange-50 px-3.5 py-2.5 ring-1 ring-orange-100">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="shrink-0 text-base">🍽️</span>
                          <span className="text-[13px] font-medium text-gray-800 truncate">{d.dish_name}</span>
                          <span className="shrink-0 rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                            ×{d.qty}
                          </span>
                        </div>
                        <span className="ml-3 shrink-0 text-[12px] font-bold text-orange-700">
                          {fmt(d.qty * parseDishPrice(d.unit_price))}đ
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Price summary */}
              <section className="overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-100">
                <div className="px-4 py-2.5 bg-gray-100/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Chi tiết thanh toán</p>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {detail.activityTotal > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-gray-500">🌿 Hoạt động tham quan</span>
                      <span className="font-medium text-gray-700">{fmt(detail.activityTotal)}đ</span>
                    </div>
                  )}
                  {detail.dishTotal > 0 && (
                    <div className="flex justify-between text-[13px]">
                      <span className="text-gray-500">🍽️ Ẩm thực đặt kèm</span>
                      <span className="font-medium text-gray-700">{fmt(detail.dishTotal)}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2.5 mt-1">
                    <span className="text-[14px] font-bold text-gray-900">Tổng đơn</span>
                    <span className="text-[17px] font-black text-emerald-700">{fmt(detail.total)}đ</span>
                  </div>
                </div>
              </section>

              {/* Refund info */}
              {detail.refund && (
                <section className="overflow-hidden rounded-xl ring-1 ring-orange-200">
                  <div className="flex items-center gap-2 bg-orange-50 px-4 py-2.5">
                    <span className="text-base">💸</span>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Thông tin hoàn tiền</p>
                    <span className="ml-auto text-[10px] text-orange-400">
                      {new Date(detail.refund.createdAt).toLocaleString("vi-VN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="p-4 space-y-3 bg-white">
                    {detail.refund.note && (
                      <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Lý do hoàn</p>
                        <p className="text-[13px] text-gray-700 leading-relaxed">{detail.refund.note}</p>
                      </div>
                    )}
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Ảnh xác nhận chuyển khoản</p>
                      <a href={detail.refund.proofUrl} target="_blank" rel="noreferrer"
                        className="block overflow-hidden rounded-xl ring-1 ring-orange-100 hover:ring-orange-300 transition">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={detail.refund.proofUrl} alt="Bằng chứng hoàn tiền"
                          className="max-h-60 w-full object-contain bg-orange-50/40" />
                        <div className="px-3 py-1.5 bg-orange-50 border-t border-orange-100">
                          <p className="text-[10px] text-orange-500 text-center">Nhấn để xem ảnh đầy đủ</p>
                        </div>
                      </a>
                    </div>
                  </div>
                </section>
              )}

              {/* Alert */}
              {alertMsg && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-[12px] font-medium text-red-600 ring-1 ring-red-200">
                  {alertMsg}
                </p>
              )}

              {/* Action buttons */}
              {status !== "CHECKED_IN" && status !== "CANCELLED" && status !== "REFUNDED" && (
                <div className="flex gap-2 pt-1 pb-1">
                  {status === "PENDING" && (
                    <button onClick={() => act("paid")} disabled={pending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5
                                 text-[13px] font-bold text-white shadow-sm shadow-emerald-200
                                 transition hover:bg-emerald-700 disabled:opacity-50">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Xác nhận thanh toán
                    </button>
                  )}
                  {status === "PAID" && (
                    <button onClick={() => act("checkin")} disabled={pending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5
                                 text-[13px] font-bold text-white shadow-sm shadow-blue-200
                                 transition hover:bg-blue-700 disabled:opacity-50">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                      Check-in ngay
                    </button>
                  )}
                  {(canCancel || status === "PENDING") && (
                    <button onClick={() => act("cancel")} disabled={pending}
                      className="rounded-xl border border-red-200 px-4 py-2.5 text-[13px] font-semibold
                                 text-red-500 transition hover:bg-red-50 disabled:opacity-50">
                      Hủy vé
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
