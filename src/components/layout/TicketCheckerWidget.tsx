"use client";

import { useState, useRef, useEffect } from "react";
import QRCodeDisplay from "@/components/booking/QRCodeDisplay";

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "Chờ thanh toán",
  PAID:       "Đã thanh toán",
  CHECKED_IN: "Đã check-in",
  CANCELLED:  "Đã hủy",
};
const STATUS_STYLE: Record<string, { pill: string; header: string; border: string; bg: string }> = {
  PENDING:    { pill: "bg-amber-100 text-amber-700",   header: "from-amber-500 to-orange-500",   border: "border-amber-200",   bg: "bg-amber-50"   },
  PAID:       { pill: "bg-emerald-100 text-emerald-700", header: "from-emerald-600 to-teal-600", border: "border-emerald-200", bg: "bg-emerald-50" },
  CHECKED_IN: { pill: "bg-blue-100 text-blue-700",     header: "from-blue-600 to-indigo-600",    border: "border-blue-200",    bg: "bg-blue-50"    },
  CANCELLED:  { pill: "bg-red-100 text-red-600",       header: "from-red-600 to-rose-600",       border: "border-red-200",     bg: "bg-red-50"     },
};
const CAT_ICON: Record<string, string> = {
  CAVE: "🦇", LAKE: "🏊", SIGHTSEEING: "🌄", DINING: "🍽️",
};

function fmt(n: number) { return new Intl.NumberFormat("vi-VN").format(n); }

interface Dish { dish_name: string; qty: number; unit_price: string; }
interface Activity { name: string; category: string; price: number; }
interface Ticket {
  bookingRef:  string | null;
  status:      string;
  guestName:   string;
  guestCount:  number;
  date:        string;
  time:        string;
  totalPrice:  number;
  qrToken:     string | null;
  activities:  Activity[];
  dishes:      Dish[];
}

export default function TicketCheckerWidget() {
  const [open,      setOpen]      = useState(false);
  const [mode,      setMode]      = useState<"ref" | "phone">("ref");
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [tickets,   setTickets]   = useState<Ticket[] | null>(null);
  const [error,     setError]     = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  function reset() {
    setInput(""); setTickets(null); setError(""); setVerifying(null);
  }

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true); setError(""); setTickets(null);
    try {
      const param = mode === "ref"
        ? `ref=${encodeURIComponent(input.trim().toUpperCase())}`
        : `phone=${encodeURIComponent(input.trim())}`;
      const res  = await fetch(`/api/check-ticket?${param}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Không tìm thấy vé");
      else setTickets(data.tickets ?? []);
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyPayment(ref: string) {
    setVerifying(ref);
    try {
      const res  = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref }),
      });
      const data = await res.json();
      if (data.found && (data.confirmed || data.alreadyPaid)) {
        setTickets(prev => prev?.map(t =>
          t.bookingRef === ref ? { ...t, status: "PAID" } : t
        ) ?? null);
      } else {
        setError("Chưa tìm thấy giao dịch trong hệ thống SePay.");
      }
    } catch {
      setError("Lỗi kết nối SePay.");
    } finally {
      setVerifying(null);
    }
  }

  function fmtDate(d: string) {
    if (!d) return "—";
    return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { dateStyle: "medium" });
  }

  return (
    <>
      {/* ── Backdrop ────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={() => { setOpen(false); reset(); }}
        />
      )}

      {/* ── Panel ───────────────────────────────────────────────── */}
      <div className={`fixed bottom-20 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)]
        rounded-2xl bg-white shadow-2xl ring-1 ring-black/10
        transition-all duration-300 ease-out
        ${open ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-4 opacity-0 pointer-events-none"}`}>

        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-bold text-white">Kiểm tra vé</p>
              <p className="text-[11px] text-emerald-100">Tra cứu thông tin đặt chỗ</p>
            </div>
          </div>
          <button onClick={() => { setOpen(false); reset(); }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto">

          {/* Search form */}
          {!tickets && (
            <div className="p-5 space-y-3">
              <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                {(["ref", "phone"] as const).map(m => (
                  <button key={m} type="button" onClick={() => { setMode(m); setInput(""); setError(""); }}
                    className={`flex-1 rounded-lg py-1.5 text-[12px] font-semibold transition ${
                      mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}>
                    {m === "ref" ? "🎫 Mã đặt vé" : "📱 Số điện thoại"}
                  </button>
                ))}
              </div>
              <form onSubmit={search} className="space-y-3">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={mode === "ref" ? "VD: AMF-AE11ED93" : "VD: 0901 234 567"}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:font-normal focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
                {error && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">{error}</p>
                )}
                <button type="submit" disabled={loading || !input.trim()}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-[13px] font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
                  {loading ? "Đang tìm…" : "Tra cứu vé"}
                </button>
              </form>
            </div>
          )}

          {/* Results */}
          {tickets && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between px-1">
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                  {tickets.length} vé tìm thấy
                </p>
                <button onClick={reset}
                  className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-800 transition">
                  ← Tìm lại
                </button>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">{error}</p>
              )}

              {tickets.map(t => {
                const st = STATUS_STYLE[t.status] ?? STATUS_STYLE.PENDING;
                const dishTotal = t.dishes.reduce((s, d) => {
                  const n = parseInt(d.unit_price.replace(/\D/g, ""), 10);
                  return s + (isNaN(n) ? 0 : n * d.qty);
                }, 0);

                return (
                  <div key={t.bookingRef ?? t.guestName} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">

                    {/* Status pill */}
                    <div className={`flex items-center gap-2 border-b px-4 py-2.5 ${st.bg} ${st.border}`}>
                      <span className={`text-[12px] font-black ${st.pill.split(" ")[1]}`}>
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                      {t.bookingRef && (
                        <span className="ml-auto font-mono text-[11px] font-bold text-gray-400">{t.bookingRef}</span>
                      )}
                    </div>

                    {/* Guest header */}
                    <div className={`bg-gradient-to-r ${st.header} px-4 py-3`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-[16px] font-black text-white ring-2 ring-white/30">
                          {t.guestName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-black text-white">{t.guestName}</p>
                          <p className="text-[11px] text-white/70">{fmtDate(t.date)} · {t.time}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">Khách</p>
                          <p className="text-[20px] font-black text-white">{t.guestCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Activities */}
                    {t.activities.length > 0 && (
                      <div className="border-b border-gray-100 px-4 py-3">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Hoạt động ({t.activities.length})
                        </p>
                        <div className="space-y-1.5">
                          {t.activities.map((a, i) => (
                            <div key={i} className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-3 py-2">
                              <span className="text-base shrink-0">{CAT_ICON[a.category] ?? "🎫"}</span>
                              <p className="flex-1 text-[12px] font-bold text-emerald-900 leading-tight">{a.name}</p>
                              {a.price > 0 && (
                                <p className="shrink-0 text-[11px] font-black text-emerald-600">{fmt(a.price)}đ</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dishes */}
                    {t.dishes.length > 0 && (
                      <div className="border-b border-gray-100 px-4 py-3">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-orange-500">
                          🍽️ Đồ ăn uống
                        </p>
                        <div className="space-y-1.5">
                          {t.dishes.map((d, i) => (
                            <div key={i} className="flex items-center gap-2.5 rounded-xl bg-orange-50 px-3 py-2">
                              <span className="text-base shrink-0">🍴</span>
                              <p className="flex-1 text-[12px] font-bold text-orange-900">{d.dish_name}</p>
                              <span className="text-[11px] text-gray-400 shrink-0">×{d.qty}</span>
                              <p className="shrink-0 text-[11px] font-black text-orange-600">{d.unit_price}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className={`flex items-center justify-between bg-gradient-to-r ${st.header} px-4 py-3`}>
                      <p className="text-[11px] font-semibold text-white/70">Tổng thanh toán</p>
                      <p className="text-[18px] font-black text-white">{fmt(t.totalPrice)}<span className="text-xs font-normal">đ</span></p>
                    </div>

                    {/* QR */}
                    {(t.status === "PAID" || t.status === "CHECKED_IN") && t.qrToken && (
                      <div className="flex flex-col items-center gap-2 border-t border-dashed border-emerald-200 bg-emerald-50 px-4 py-3">
                        <p className="text-[11px] font-bold text-emerald-700">QR Check-in</p>
                        <QRCodeDisplay value={t.qrToken} size={130} />
                        <p className="text-[10px] text-emerald-600">Xuất trình tại cổng vào</p>
                      </div>
                    )}

                    {/* Verify if pending */}
                    {t.status === "PENDING" && t.bookingRef && (
                      <div className="p-3">
                        <button
                          onClick={() => verifyPayment(t.bookingRef!)}
                          disabled={verifying === t.bookingRef}
                          className="w-full rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-[12px] font-bold text-amber-700 transition hover:bg-amber-100 disabled:opacity-50">
                          {verifying === t.bookingRef ? "Đang kiểm tra giao dịch…" : "🔄 Đã chuyển khoản? Xác nhận ngay"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!tickets && (
          <div className="border-t border-gray-100 px-5 py-3 text-center">
            <p className="text-[11px] text-gray-400">
              Hỗ trợ:{" "}
              <a href="tel:+84857086588" className="font-semibold text-emerald-600">0857 086 588</a>
            </p>
          </div>
        )}
      </div>

      {/* ── Floating trigger ────────────────────────────────────── */}
      <button
        onClick={() => { setOpen(v => !v); if (open) reset(); }}
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-3
          shadow-lg shadow-emerald-500/30 transition-all duration-300
          ${open
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-500/40 hover:scale-105"
          }`}>
        {open ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <span className="text-[13px] font-semibold">Đóng</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
            </svg>
            <span className="text-[13px] font-semibold">Kiểm tra vé</span>
          </>
        )}
      </button>
    </>
  );
}
