import type { Metadata } from "next";
import Link from "next/link";
import QRCodeDisplay from "@/components/booking/QRCodeDisplay";
import PaymentStatusPoller from "@/components/booking/PaymentStatusPoller";
import SocialShare from "@/components/booking/SocialShare";

export const metadata: Metadata = {
  title: "Đặt Vé Thành Công | Sơn Kiều",
};

interface BookingItem { token: string; activity: string; date: string; time: string; price: number; }
interface DishItem    { dishName: string; qty: number; price: string; }

interface PageProps {
  searchParams: Promise<{
    name?:       string;
    email?:      string;
    phone?:      string;
    guests?:     string;
    total?:      string;
    bookings?:   string;
    dishes?:     string;
    bookingRef?: string;
    /* legacy */
    token?:    string;
    activity?: string;
    date?:     string;
    time?:     string;
  }>;
}

function fmt(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n);
}
function fmtDate(d: string) {
  if (!d || d === "—") return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { dateStyle: "long" });
}

export default async function BookingSuccessPage({ searchParams }: PageProps) {
  const p      = await searchParams;
  const name   = p.name   ?? "Khách";
  const email  = p.email  ?? "";
  const phone  = p.phone  ?? "";
  const guests = Number(p.guests ?? 1);
  const total  = Number(p.total  ?? 0);
  const bookingRef = p.bookingRef ?? "";

  let bookings: BookingItem[] = [];
  if (p.bookings) {
    try { bookings = JSON.parse(decodeURIComponent(p.bookings)); } catch { /* ignore */ }
  }
  if (bookings.length === 0 && p.token) {
    bookings = [{ token: p.token, activity: p.activity ?? "—", date: p.date ?? "—", time: p.time ?? "—", price: total }];
  }

  let dishes: DishItem[] = [];
  if (p.dishes) {
    try { dishes = JSON.parse(decodeURIComponent(p.dishes)); } catch { /* ignore */ }
  }

  const grandTotal = total || bookings.reduce((s, b) => s + (b.price ?? 0), 0);
  const sharedDate = bookings[0]?.date ?? "—";
  const sharedTime = bookings[0]?.time ?? "—";

  return (
    <main className="min-h-screen bg-gray-50 pt-16">

      {/* Hero */}
      <div className="relative overflow-hidden pb-16 pt-14 text-center"
        style={{ background: "linear-gradient(160deg,#030f05 0%,#071a0b 55%,#040e06 100%)" }}>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[380px] w-[650px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.18) 0%,transparent 70%)" }} />
        </div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="scdots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#scdots)" />
          </svg>
        </div>

        <div className="relative z-10 px-4">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full
                          bg-emerald-500 shadow-2xl shadow-emerald-500/50 ring-4 ring-emerald-400/30">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white sm:text-4xl">Đặt vé thành công!</h1>
          <p className="mt-2 text-[15px] text-white/60">
            Xin chào <span className="font-bold text-emerald-300">{name}</span> —{" "}
            {bookings.length > 1 ? `${bookings.length} hoạt động đã được ghi nhận` : "vé của bạn đã được ghi nhận"}
          </p>
          {sharedDate !== "—" && (
            <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/10
                            bg-white/[0.06] px-5 py-2 text-[13px] text-white/70 backdrop-blur-sm">
              <span>📅 {fmtDate(sharedDate)}</span>
              {sharedTime !== "—" && <><span className="text-white/20">·</span><span>🕐 {sharedTime}</span></>}
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-gray-50" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 space-y-5">

        {/* ── Payment status banner (auto-polls until PAID) ──────────── */}
        <PaymentStatusPoller bookingRef={bookingRef} />

        {/* ── Ticket card ────────────────────────────────────────────── */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_32px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.04]">

          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 px-6 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl">🌿</div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300">Vé điện tử</p>
              <p className="text-[15px] font-black text-white">SƠN KIỀU</p>
            </div>
            {bookingRef && (
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Mã thanh toán</p>
                <p className="font-mono text-[13px] font-bold text-white">{bookingRef}</p>
              </div>
            )}
          </div>

          {/* Guest info */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
            {[
              { label: "Khách hàng",    value: name   },
              { label: "Số điện thoại", value: phone  },
              { label: "Số khách",      value: `${guests} người` },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
                <p className="mt-0.5 truncate text-[13px] font-semibold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Activities */}
          {bookings.length > 0 && (
            <div className="divide-y divide-gray-50">
              <p className="px-6 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Hoạt động đã đặt</p>
              {bookings.map((b, idx) => (
                <div key={b.token ?? idx} className="flex items-center gap-4 px-6 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[16px]">🏞️</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-gray-900">{b.activity}</p>
                    <p className="text-[11px] text-gray-500">{fmtDate(b.date)} · {b.time}</p>
                  </div>
                  <p className="shrink-0 text-[13px] font-bold text-emerald-600">{fmt(b.price)}đ</p>
                </div>
              ))}
            </div>
          )}

          {/* Dishes */}
          {dishes.length > 0 && (
            <div className="border-t border-dashed border-orange-200 bg-orange-50/40">
              <p className="px-6 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-orange-500">🍽️ Đơn ăn uống</p>
              <div className="divide-y divide-orange-100/60">
                {dishes.map((d, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800">{d.dishName}</p>
                      <p className="text-[11px] text-gray-500">x{d.qty}</p>
                    </div>
                    <p className="text-[13px] font-bold text-orange-500">{d.price}</p>
                  </div>
                ))}
              </div>
              <p className="px-6 pb-3 pt-1 text-[11px] italic text-orange-400">* Xác nhận khi check-in tại nhà hàng</p>
            </div>
          )}

          {/* Perforated divider */}
          <div className="relative flex items-center">
            <div className="absolute -left-4 h-8 w-8 rounded-full bg-gradient-to-b from-gray-50 to-gray-100" />
            <div className="absolute -right-4 h-8 w-8 rounded-full bg-gradient-to-b from-gray-50 to-gray-100" />
            <div className="mx-4 w-full border-t-2 border-dashed border-gray-200" />
          </div>

          {/* QR section — 1 QR duy nhất cho cả đơn */}
          <div className="px-6 py-6">
            <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Xuất trình tại cổng check-in
            </p>
            <div className="flex flex-col items-center gap-3">
              <QRCodeDisplay value={bookingRef || bookings[0]?.token || ""} size={200} />
              <p className="font-mono text-[14px] font-bold tracking-widest text-emerald-700">
                {bookingRef}
              </p>
              {bookings.length > 1 && (
                <p className="text-[11px] text-gray-400">
                  1 mã QR cho {bookings.length} hoạt động
                </p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-4">
            <div>
              <p className="text-[11px] font-medium text-emerald-200">Tổng thanh toán</p>
              <p className="text-[11px] text-emerald-300/80">
                {bookings.length > 0 && `${bookings.length} hoạt động · `}{guests} khách
              </p>
            </div>
            <p className="text-2xl font-black text-white">
              {fmt(grandTotal)}<span className="text-sm font-normal">đ</span>
            </p>
          </div>
        </div>

        {/* ── Notification status ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm">✓</span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-emerald-800">Email xác nhận</p>
              <p className="truncate text-[10px] text-emerald-600">{email || "Đã gửi"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-sm">💬</span>
            <div>
              <p className="text-[11px] font-bold text-gray-600">Zalo thông báo</p>
              <p className="text-[10px] text-gray-400">Sau khi thanh toán xác nhận</p>
            </div>
          </div>
        </div>

        {/* ── Reminders ──────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Lưu ý khi tham quan</p>
          {[
            "Có mặt trước giờ khởi hành 15 phút để check-in tại cổng.",
            "Mang theo giày dép phù hợp khi khám phá hang động.",
            "Liên hệ hỗ trợ: 7:00–17:00 hàng ngày.",
          ].map(t => (
            <div key={t} className="flex items-start gap-2.5">
              <span className="mt-0.5 shrink-0 text-amber-400">›</span>
              <p className="text-[12px] leading-relaxed text-amber-700">{t}</p>
            </div>
          ))}
        </div>

        {/* ── Social share ───────────────────────────────────────────── */}
        <SocialShare />

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 pt-1">
          <Link href="/activities"
            className="rounded-2xl bg-emerald-600 py-4 text-center text-[14px] font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:-translate-y-px">
            Khám phá thêm hoạt động →
          </Link>
          <Link href="/"
            className="rounded-2xl border border-gray-200 bg-white py-3.5 text-center text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50">
            Về trang chủ
          </Link>
        </div>

      </div>
    </main>
  );
}
