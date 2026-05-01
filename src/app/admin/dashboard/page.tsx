import { Suspense }       from "react";
import { supabaseAdmin }  from "@/lib/supabase-admin";
import StatCard           from "@/components/admin/StatCard";
import BarChart           from "@/components/admin/BarChart";
import DateRangePicker    from "@/components/admin/DateRangePicker";
import Link               from "next/link";

export const revalidate = 0;

const STATUS_BADGE: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
  PAID:       "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
  CANCELLED:  "bg-red-50 text-red-600 ring-1 ring-red-200/60",
  CHECKED_IN: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60",
};
const STATUS_VN: Record<string, string> = {
  PENDING: "Chờ TT", PAID: "Đã TT", CANCELLED: "Đã hủy", CHECKED_IN: "Đã vào",
};
const CAT_META: Record<string, { label: string; color: string; icon: string }> = {
  CAVE:        { label: "Hang động",  color: "bg-slate-100 text-slate-600",     icon: "🦇" },
  LAKE:        { label: "Hồ bơi",     color: "bg-cyan-100  text-cyan-700",      icon: "🏊" },
  SIGHTSEEING: { label: "Tham quan",  color: "bg-emerald-100 text-emerald-700", icon: "🌄" },
};

function fmt(n: number) { return new Intl.NumberFormat("vi-VN").format(n); }

function parseUTC(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
function getDayRange(from: string, to: string) {
  const days: string[] = [];
  const cur = parseUTC(from);
  const end = parseUTC(to);
  while (cur <= end) {
    days.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return days;
}
function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  return new Date(iso + "T12:00:00").toLocaleDateString("vi-VN", opts);
}

function GuestsIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function TicketIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/></svg>; }
function RevenueIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>; }
function AlertIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function DiningIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>; }

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

type RangeRow = {
  id: string; guest_count: number; total_price: number;
  dish_total?: number; status: string; booking_ref: string | null; booking_date: string;
};

function dedupe<T extends { booking_ref?: string | null; id: string }>(rows: T[]): T[] {
  const seen = new Set<string>();
  return rows.filter(b => {
    const key = b.booking_ref ?? b.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const sp    = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const default7d = (() => { const d = new Date(); d.setDate(d.getDate() - 6); return d.toISOString().slice(0, 10); })();
  const from  = sp.from ?? default7d;
  const to    = sp.to   ?? today;

  const nowTime = new Date().toTimeString().slice(0, 8);
  const in3h    = new Date(Date.now() + 3 * 3600_000).toTimeString().slice(0, 8);

  const isToday    = from === today && to === today;
  const rangeDays  = getDayRange(from, to);
  const rangeLabel = from === to
    ? fmtDate(from, { day: "numeric", month: "short", year: "numeric" })
    : `${fmtDate(from, { day: "numeric", month: "short" })} – ${fmtDate(to, { day: "numeric", month: "short", year: "numeric" })}`;

  const [
    { data: rangeB    },
    { data: upcoming  },
    { data: activities },
    { data: allTimeB  },
  ] = await Promise.all([
    supabaseAdmin.from("bookings")
      .select("id,guest_count,total_price,dish_total,status,booking_ref,booking_date")
      .gte("booking_date", from)
      .lte("booking_date", to),
    supabaseAdmin.from("bookings")
      .select("id,guest_name,guest_count,slot_time,status,booking_ref,activities(name,category)")
      .eq("booking_date", today).eq("status", "PAID")
      .gte("slot_time", nowTime).lte("slot_time", in3h).order("slot_time").limit(8),
    supabaseAdmin.from("activities").select("id,name,category,is_active").order("category"),
    supabaseAdmin.from("bookings").select("total_price,status").in("status", ["PAID", "CHECKED_IN"]),
  ]);

  const allRange  = (rangeB ?? []) as RangeRow[];
  const paidRange = allRange.filter(b => ["PAID", "CHECKED_IN"].includes(b.status));

  const rangeRevenue  = paidRange.reduce((s, b) => s + Number(b.total_price), 0);
  const rangeDish     = paidRange.reduce((s, b) => s + Number(b.dish_total ?? 0), 0);
  const ticketsSold   = dedupe(allRange.filter(b => b.status !== "CANCELLED")).length;
  const totalGuests   = dedupe(paidRange).reduce((s, b) => s + b.guest_count, 0);
  const pendingCount  = dedupe(allRange.filter(b => b.status === "PENDING")).length;
  const allTimeRevenue = allTimeB?.reduce((s, b) => s + Number(b.total_price), 0) ?? 0;
  const closedCount   = activities?.filter(a => !a.is_active).length ?? 0;

  /* Chart: cap at 60 days for readability */
  const chartDays = rangeDays.length > 60 ? rangeDays.slice(-60) : rangeDays;
  const multiDay  = chartDays.length > 1;
  const revenueByDay = chartDays.map(date => ({
    label: multiDay && chartDays.length > 7
      ? `${parseUTC(date).getUTCDate()}/${parseUTC(date).getUTCMonth() + 1}`
      : fmtDate(date, { weekday: "short" }),
    value: paidRange.filter(b => b.booking_date === date).reduce((s, b) => s + Number(b.total_price), 0),
  }));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[12px] font-medium text-emerald-600 mb-0.5">{greeting} 👋</p>
          <h1 className="text-[22px] font-black text-gray-900 leading-tight">Tổng quan</h1>
          <p className="mt-0.5 text-[13px] text-gray-400" suppressHydrationWarning>
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Link href="/admin/bookings?status=PENDING"
              className="flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 ring-1 ring-amber-200
                         text-[12px] font-bold text-amber-700 transition hover:bg-amber-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              {pendingCount} đơn chờ xác nhận
            </Link>
          )}
          <Link href="/admin/bookings"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2
                       text-[13px] font-semibold text-white transition hover:bg-emerald-700 shadow-sm shadow-emerald-200">
            Xem đặt chỗ
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>

      {/* Date range picker */}
      <Suspense>
        <DateRangePicker defaultPreset="7d" />
      </Suspense>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <StatCard icon={<GuestsIcon />}  label="Lượt khách"
          value={totalGuests}
          sub={isToday ? "Đã xác nhận hôm nay" : rangeLabel}
          color="blue" />
        <StatCard icon={<TicketIcon />}  label="Đơn đặt"
          value={ticketsSold}
          sub={`${pendingCount} chờ xác nhận`}
          color="green" />
        <StatCard icon={<RevenueIcon />} label="Doanh thu"
          value={fmt(rangeRevenue) + "đ"}
          sub={`Tích lũy: ${fmt(allTimeRevenue)}đ`}
          color="amber" />
        <StatCard icon={<DiningIcon />}  label="Doanh thu ẩm thực"
          value={fmt(rangeDish) + "đ"}
          sub="Từ đơn đặt món"
          color="purple" />
        <StatCard icon={<AlertIcon />}   label="Khu vực đang đóng"
          value={closedCount}
          sub={closedCount > 0 ? "Có khu vực tạm đóng" : "Tất cả đang mở cửa"}
          color={closedCount > 0 ? "red" : "green"} />
      </div>

      {/* Chart + Activity status */}
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Doanh thu theo ngày</h3>
              <p className="text-[12px] text-gray-400 mt-0.5">{rangeLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-[18px] font-black text-emerald-700 tabular-nums">{fmt(rangeRevenue)}đ</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Tổng kỳ</p>
            </div>
          </div>
          <BarChart data={revenueByDay} currency height={180} />
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-gray-900">Khu vực</h3>
            <Link href="/admin/safety" className="text-[12px] font-semibold text-emerald-600 hover:text-emerald-800 transition">Quản lý →</Link>
          </div>
          <div className="space-y-2">
            {activities?.map((a) => {
              const meta = CAT_META[a.category];
              return (
                <div key={a.id}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5 ring-1 ring-gray-100 transition hover:bg-gray-100/70">
                  <span className="text-base">{meta?.icon ?? "🏞️"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-gray-800 leading-tight">{a.name}</p>
                    <span className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold ${meta?.color ?? "bg-gray-100 text-gray-500"}`}>
                      {meta?.label}
                    </span>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    a.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}>
                    {a.is_active ? "● Mở" : "○ Đóng"}
                  </span>
                </div>
              );
            })}
            {!activities?.length && <p className="py-6 text-center text-[12px] text-gray-400">Chưa có hoạt động nào</p>}
          </div>
        </div>
      </div>

      {/* Upcoming tours — always today */}
      <div className="rounded-2xl bg-white shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04] overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-gray-900">Tour sắp khởi hành</h3>
              <p className="text-[11px] text-gray-400">Hôm nay · Trong 3 giờ tới</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${
            (upcoming?.length ?? 0) > 0 ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60" : "bg-gray-100 text-gray-500"
          }`}>
            {upcoming?.length ?? 0} đoàn
          </span>
        </div>

        {!upcoming?.length ? (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-gray-500">Không có tour sắp khởi hành</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Sẽ tự động cập nhật khi có đơn mới</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/70">
                  {["Giờ", "Khách hàng", "Mã đặt vé", "Hoạt động", "Loại", "Khách", "Trạng thái"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {upcoming.map((b, idx) => {
                  const act  = b.activities as unknown as { name: string; category: string } | null;
                  const meta = act ? CAT_META[act.category] : null;
                  return (
                    <tr key={b.id} className={`transition-colors hover:bg-emerald-50/40 ${idx < upcoming.length - 1 ? "border-b border-gray-50" : ""}`}>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-xl bg-emerald-50 px-2.5 py-1 font-mono text-[13px] font-bold text-emerald-700 ring-1 ring-emerald-200/50">
                          {b.slot_time?.slice(0, 5)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><p className="text-[13px] font-semibold text-gray-900">{b.guest_name}</p></td>
                      <td className="px-5 py-3.5"><span className="font-mono text-[11px] font-bold text-gray-400">{b.booking_ref ?? "—"}</span></td>
                      <td className="px-5 py-3.5"><p className="text-[13px] text-gray-600 max-w-[200px] truncate">{act?.name ?? "—"}</p></td>
                      <td className="px-5 py-3.5">
                        {meta ? (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.color}`}>
                            {meta.icon} {meta.label}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-center"><span className="text-[13px] font-bold text-gray-700">{b.guest_count}</span></td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS_BADGE[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_VN[b.status] ?? b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
