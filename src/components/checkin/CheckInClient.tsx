"use client";

import { useState, useRef, useEffect } from "react";

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; border: string; icon: string; headerBg: string }> = {
  PENDING:    { label: "Chưa thanh toán", bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   icon: "⏳", headerBg: "from-amber-600 to-orange-600"   },
  PAID:       { label: "Đã thanh toán",   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "✅", headerBg: "from-emerald-700 to-teal-700"   },
  CHECKED_IN: { label: "Đã check-in",     bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    icon: "📱", headerBg: "from-blue-700 to-indigo-700"    },
  CANCELLED:  { label: "Đã hủy",          bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     icon: "✕",  headerBg: "from-red-700 to-rose-700"       },
};

const CAT_ICON: Record<string, string> = {
  CAVE: "🦇", LAKE: "🏊", SIGHTSEEING: "🌄", DINING: "🍽️",
};

function fmt(n: number) { return new Intl.NumberFormat("vi-VN").format(n); }

interface Activity { name: string; category: string; price?: number; }
interface BookingDish { dish_name: string; qty: number; unit_price: string; }
interface Booking {
  id: string; status: string; guest_name: string; guest_email: string;
  guest_phone: string; guest_count: number; booking_date: string;
  slot_time: string; total_price: number; dish_total: number;
  booking_ref: string;
  activities: Activity | null;
  activities_all?: Activity[];
  group_ids?: string[];
  dishes?: BookingDish[];
}

export default function CheckInClient() {
  const [token,    setToken]    = useState("");
  const [booking,  setBooking]  = useState<Booking | null>(null);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<unknown>(null);

  useEffect(() => {
    if (!scanning || !scannerRef.current) return;
    let scanner: { start: (c: object, cfg: object, ok: (t: string) => void, err: () => void) => Promise<void>; stop: () => Promise<void> };
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      scanner = new Html5Qrcode("qr-reader");
      html5QrRef.current = scanner;
      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText: string) => {
          setToken(decodedText);
          setScanning(false);
          scanner.stop().catch(() => {});
          lookup(decodedText);
        },
        () => {}
      ).catch(() => setScanning(false));
    });
    return () => { scanner?.stop().catch(() => {}); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  async function lookup(t?: string) {
    const q = (t ?? token).trim();
    if (!q) return;
    setLoading(true); setError(""); setBooking(null); setSuccess(false);
    try {
      const res  = await fetch(`/api/checkin?token=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Không tìm thấy vé");
      else         setBooking(data.booking);
    } catch { setError("Lỗi kết nối"); }
    setLoading(false);
  }

  async function confirm() {
    if (!booking) return;
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/checkin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Check-in thất bại");
      else { setSuccess(true); setBooking(prev => prev ? { ...prev, status: "CHECKED_IN" } : prev); }
    } catch { setError("Lỗi kết nối"); }
    setLoading(false);
  }

  function reset() { setToken(""); setBooking(null); setError(""); setSuccess(false); }

  const st           = booking ? (STATUS_MAP[booking.status] ?? STATUS_MAP.PENDING) : null;
  const acts         = booking?.activities_all ?? (booking?.activities ? [booking.activities] : []);
  const dishTotal    = Number(booking?.dish_total ?? 0);
  const actTotal     = Number(booking?.total_price ?? 0) - dishTotal;

  return (
    <div className="space-y-4">

      {/* ── Lookup form ─────────────────────────────────────────── */}
      {!booking && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
          {scanning ? (
            <div className="relative">
              <div id="qr-reader" ref={scannerRef} className="w-full" />
              <button onClick={() => setScanning(false)}
                className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[12px] text-white">
                Hủy
              </button>
            </div>
          ) : (
            <button onClick={() => { setError(""); setScanning(true); }}
              className="flex w-full items-center justify-center gap-3 border-b border-gray-100 py-5 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50">
              <span className="text-2xl">📷</span> Quét mã QR
            </button>
          )}
          <div className="space-y-3 p-5">
            <p className="text-center text-[11px] font-bold uppercase tracking-wider text-gray-400">— hoặc nhập mã —</p>
            <input type="text" value={token} placeholder="Nhập mã vé  AMF-XXXXXXXX"
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => e.key === "Enter" && lookup()}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            <button onClick={() => lookup()} disabled={!token.trim() || loading}
              className="w-full rounded-xl bg-emerald-600 py-3 text-[14px] font-bold text-white transition hover:bg-emerald-500 disabled:bg-gray-200 disabled:text-gray-400">
              {loading ? "Đang tra cứu…" : "Tra cứu vé"}
            </button>
          </div>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <span className="text-xl">❌</span>
          <p className="text-[13px] font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* ── Check-in success banner ────────────────────────────── */}
      {success && (
        <div className="overflow-hidden rounded-2xl bg-emerald-600 px-5 py-6 text-center shadow-[0_8px_28px_rgba(16,185,129,0.40)]">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-lg">
            ✅
          </div>
          <p className="text-[18px] font-black text-white">Check-in thành công!</p>
          <p className="mt-1 text-[13px] text-emerald-100">
            Chào mừng <strong>{booking?.guest_name}</strong> đến với Sơn Kiều 🌿
          </p>
        </div>
      )}

      {/* ── Booking detail card ────────────────────────────────── */}
      {booking && st && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">

          {/* Status pill */}
          <div className={`flex items-center gap-2.5 border-b px-5 py-3 ${st.bg} ${st.border}`}>
            <span>{st.icon}</span>
            <span className={`text-[13px] font-black ${st.text}`}>{st.label}</span>
            {booking.booking_ref && (
              <span className="ml-auto font-mono text-[12px] font-bold text-gray-400">{booking.booking_ref}</span>
            )}
          </div>

          {/* Guest header */}
          <div className={`bg-gradient-to-r ${st.headerBg} px-5 py-4`}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-[20px] font-black text-white ring-2 ring-white/30">
                {booking.guest_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-black text-white">{booking.guest_name}</p>
                <p className="text-[12px] text-white/70">{booking.guest_phone} · {booking.guest_email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Số khách</p>
                <p className="text-[24px] font-black text-white">{booking.guest_count}</p>
              </div>
            </div>
          </div>

          {/* Date & time row */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="px-5 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Ngày tham quan</p>
              <p className="mt-0.5 text-[14px] font-black text-gray-900">
                {new Date(booking.booking_date + "T00:00:00").toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="px-5 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Giờ khởi hành</p>
              <p className="mt-0.5 text-[14px] font-black text-gray-900">{booking.slot_time?.slice(0, 5)}</p>
            </div>
          </div>

          {/* Activities */}
          {acts.length > 0 && (
            <div className="border-b border-gray-100 px-5 py-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Hoạt động đã đặt ({acts.length})
              </p>
              <div className="space-y-2">
                {acts.map((act, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
                    <span className="text-lg shrink-0">{CAT_ICON[act.category] ?? "🏞️"}</span>
                    <p className="flex-1 text-[13px] font-bold text-emerald-900">{act.name}</p>
                    {act.price != null && act.price > 0 && (
                      <p className="shrink-0 text-[12px] font-black text-emerald-600">
                        {fmt(act.price)}đ
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dish breakdown */}
          {(booking.dishes && booking.dishes.length > 0) && (
            <div className="border-b border-gray-100 px-5 py-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-orange-500">
                🍽️ Đồ ăn uống đã đặt
              </p>
              <div className="space-y-2">
                {booking.dishes.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                    <span className="text-lg shrink-0">🍴</span>
                    <p className="flex-1 text-[13px] font-bold text-orange-900">{d.dish_name}</p>
                    <span className="text-[12px] text-gray-500 shrink-0">×{d.qty}</span>
                    <p className="shrink-0 text-[12px] font-black text-orange-600">{d.unit_price}</p>
                  </div>
                ))}
                {dishTotal > 0 && (
                  <div className="flex items-center justify-between pt-1 text-[12px]">
                    <span className="text-gray-400">Tổng đồ ăn uống</span>
                    <span className="font-black text-orange-600">{fmt(dishTotal)}đ</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total */}
          <div className={`flex items-center justify-between bg-gradient-to-r ${st.headerBg} px-5 py-4`}>
            <p className="text-[12px] font-semibold text-white/70">Tổng thanh toán</p>
            <p className="text-[24px] font-black text-white">
              {fmt(Number(booking.total_price))}<span className="text-sm font-normal">đ</span>
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 p-5">
            {booking.status === "PAID" && !success && (
              <button onClick={confirm} disabled={loading}
                className="w-full rounded-xl bg-emerald-600 py-4 text-[15px] font-black text-white
                           shadow-[0_6px_20px_rgba(16,185,129,0.35)] transition-all
                           hover:bg-emerald-500 hover:-translate-y-0.5
                           disabled:translate-y-0 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none">
                {loading ? "Đang xử lý…" : "✅ Xác nhận Check-in"}
              </button>
            )}
            <button onClick={reset}
              className="w-full rounded-xl border border-gray-200 py-3 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50">
              ← Tra cứu vé khác
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
