import { Suspense }      from "react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import BarChart           from "@/components/admin/BarChart";
import DateRangePicker    from "@/components/admin/DateRangePicker";

export const revalidate = 0;

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

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

type BookingRow = {
  id: string; booking_ref: string | null; booking_date: string; slot_time: string | null;
  total_price: number; dish_total?: number; status: string; guest_count: number;
  activity_id: string; activities: unknown;
};

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const sp    = await searchParams;
  const today = new Date().toISOString().slice(0, 10);

  const defaultFrom = (() => { const d = new Date(); d.setDate(d.getDate() - 6); return d.toISOString().slice(0, 10); })();
  const from = sp.from ?? defaultFrom;
  const to   = sp.to   ?? today;

  const rangeDays = getDayRange(from, to);
  const multiDay  = rangeDays.length > 1;
  const rangeLabel = from === to
    ? fmtDate(from, { day: "numeric", month: "short", year: "numeric" })
    : `${fmtDate(from, { day: "numeric", month: "short" })} – ${fmtDate(to, { day: "numeric", month: "short", year: "numeric" })}`;

  const [
    { data: allBookings },
    { data: activities  },
    { data: dishes      },
    { data: restaurants },
  ] = await Promise.all([
    supabaseAdmin.from("bookings")
      .select("id, booking_ref, booking_date, slot_time, total_price, dish_total, status, guest_count, activity_id, activities(category)")
      .gte("booking_date", from)
      .lte("booking_date", to)
      .in("status", ["PAID", "CHECKED_IN"]),
    supabaseAdmin.from("activities").select("id, name, category"),
    supabaseAdmin.from("dishes").select("id, is_active, category"),
    supabaseAdmin.from("restaurants").select("id, is_active"),
  ]);

  const bookings = (allBookings ?? []) as BookingRow[];

  /* Deduplicate by booking_ref for guest/order counting */
  const uniqueOrders = (() => {
    const seen = new Set<string>();
    return bookings.filter(b => {
      const key = b.booking_ref ?? b.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  /* Chart label: weekday for ≤7 days, dd/mm for longer ranges */
  const chartDays = rangeDays.length > 60 ? rangeDays.slice(-60) : rangeDays;
  const dayLabel  = (date: string) => multiDay && chartDays.length > 7
    ? `${parseUTC(date).getUTCDate()}/${parseUTC(date).getUTCMonth() + 1}`
    : fmtDate(date, { weekday: "short" });

  const revenueByDay = chartDays.map(date => ({
    label: dayLabel(date),
    value: bookings.filter(b => b.booking_date === date).reduce((s, b) => s + Number(b.total_price), 0),
  }));

  const dishRevenueByDay = chartDays.map(date => ({
    label: dayLabel(date),
    value: bookings.filter(b => b.booking_date === date).reduce((s, b) => s + Number(b.dish_total ?? 0), 0),
  }));

  const activityRevenueByDay = chartDays.map(date => ({
    label: dayLabel(date),
    value: bookings.filter(b => b.booking_date === date).reduce((s, b) => s + Number(b.total_price) - Number(b.dish_total ?? 0), 0),
  }));

  /* Category stats */
  const catCount:   Record<string, number> = { CAVE: 0, LAKE: 0, SIGHTSEEING: 0 };
  const catRevenue: Record<string, number> = { CAVE: 0, LAKE: 0, SIGHTSEEING: 0 };
  bookings.forEach(b => {
    const cat = (b.activities as { category: string } | null)?.category;
    if (cat && cat in catCount) {
      catCount[cat]++;
      catRevenue[cat] += Number(b.total_price) - Number(b.dish_total ?? 0);
    }
  });

  /* Peak hours */
  const hourCount: Record<number, number> = {};
  bookings.forEach(b => {
    if (b.slot_time) {
      const h = parseInt(b.slot_time.slice(0, 2), 10);
      hourCount[h] = (hourCount[h] ?? 0) + 1;
    }
  });
  const peakHours = Array.from({ length: 10 }, (_, i) => {
    const h = i + 8;
    return { label: `${h}h`, value: hourCount[h] ?? 0 };
  });

  /* Summary metrics */
  const totalDishRevenue  = bookings.reduce((s, b) => s + Number(b.dish_total ?? 0), 0);
  const activeDishes      = (dishes ?? []).filter(d => d.is_active).length;
  const totalDishes       = (dishes ?? []).length;
  const activeRestaurants = (restaurants ?? []).filter(r => r.is_active).length;
  const totalRevenue      = bookings.reduce((s, b) => s + Number(b.total_price), 0);
  const activityRevenue   = totalRevenue - totalDishRevenue;
  const totalGuests       = uniqueOrders.reduce((s, b) => s + b.guest_count, 0);
  const avgTicket         = uniqueOrders.length > 0 ? totalRevenue / uniqueOrders.length : 0;

  const catChartData = [
    { label: "🦇 Hang", value: catCount.CAVE },
    { label: "🏊 Hồ",   value: catCount.LAKE },
    { label: "🌄 Tham", value: catCount.SIGHTSEEING },
  ];

  const summaryCards = [
    { label: "Tổng doanh thu",   value: fmt(totalRevenue) + "đ",             sub: `${rangeLabel} · hoạt động + ẩm thực`, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: "Tổng lượt khách",  value: totalGuests.toLocaleString(),         sub: `${uniqueOrders.length} đơn đặt`,       color: "text-blue-700",    bg: "bg-blue-50"    },
    { label: "Doanh thu ẩm thực",value: fmt(totalDishRevenue) + "đ",          sub: `${totalRevenue > 0 ? ((totalDishRevenue/totalRevenue)*100).toFixed(1) : 0}% tổng doanh thu`, color: "text-orange-700", bg: "bg-orange-50" },
    { label: "Giá vé trung bình",value: fmt(Math.round(avgTicket)) + "đ",     sub: "Trung bình mỗi đơn đặt",              color: "text-violet-700",  bg: "bg-violet-50"  },
  ];

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-gray-900">Thống kê & Báo cáo</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Chỉ tính đơn đã xác nhận · {rangeLabel}</p>
        </div>
        <Suspense>
          <DateRangePicker defaultPreset="7d" />
        </Suspense>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {summaryCards.map(({ label, value, sub, color, bg }) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
            <p className={`text-[22px] font-black tabular-nums ${color}`}>{value}</p>
            <p className="mt-1 text-[12px] font-semibold text-gray-700">{label}</p>
            <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
          <h3 className="text-[14px] font-bold text-gray-900">Doanh thu theo ngày</h3>
          <p className="text-[11px] text-gray-400 mt-0.5 mb-4">{rangeLabel}</p>
          <BarChart data={revenueByDay} currency height={180} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
          <h3 className="text-[14px] font-bold text-gray-900">Giờ cao điểm</h3>
          <p className="text-[11px] text-gray-400 mt-0.5 mb-4">Số lượt đặt vé theo khung giờ</p>
          <BarChart data={peakHours} height={180} color="blue" />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
          <h3 className="text-[14px] font-bold text-gray-900">Doanh thu hoạt động theo ngày</h3>
          <p className="text-[11px] text-gray-400 mt-0.5 mb-4">{rangeLabel} · không tính ẩm thực</p>
          <BarChart data={activityRevenueByDay} currency height={180} color="purple" />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
          <h3 className="text-[14px] font-bold text-gray-900 mb-4">Doanh thu theo loại hình</h3>
          <div className="space-y-4">
            {(["CAVE", "LAKE", "SIGHTSEEING"] as const).map((cat) => {
              const rev = catRevenue[cat];
              const pct = activityRevenue > 0 ? (rev / activityRevenue) * 100 : 0;
              const cfg: Record<string, { label: string; bar: string }> = {
                CAVE:        { label: "🦇 Hang Động", bar: "bg-slate-500"   },
                LAKE:        { label: "🏊 Hồ Bơi",    bar: "bg-cyan-500"    },
                SIGHTSEEING: { label: "🌄 Tham Quan",  bar: "bg-emerald-500" },
              };
              return (
                <div key={cat}>
                  <div className="mb-1.5 flex justify-between text-[12px]">
                    <span className="font-semibold text-gray-700">{cfg[cat].label}</span>
                    <span className="font-bold text-gray-900">{fmt(rev)}đ · <span className="text-gray-400 font-normal">{pct.toFixed(1)}%</span></span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${cfg[cat].bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dining section */}
      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-base">🍽️</div>
          <h2 className="text-[14px] font-bold text-gray-900">Thống kê Ẩm thực</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="text-[12px] font-semibold text-gray-600 mb-3">Doanh thu ẩm thực theo ngày</p>
            <BarChart data={dishRevenueByDay} currency height={140} color="purple" />
          </div>
          <div className="space-y-4">
            <p className="text-[12px] font-semibold text-gray-600">Phân bổ doanh thu tổng</p>
            {[
              { label: "🌿 Hoạt động tham quan", value: activityRevenue,  bar: "bg-emerald-500" },
              { label: "🍽️ Ẩm thực",             value: totalDishRevenue, bar: "bg-orange-400"  },
            ].map(({ label, value, bar }) => {
              const pct = totalRevenue > 0 ? (value / totalRevenue) * 100 : 0;
              return (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-[12px]">
                    <span className="font-medium text-gray-700">{label}</span>
                    <span className="font-bold text-gray-900">{fmt(value)}đ · <span className="text-gray-400 font-normal">{pct.toFixed(1)}%</span></span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="mt-4 grid grid-cols-3 gap-2 pt-2">
              {[
                { label: "Món hiển thị", value: activeDishes,      icon: "✅" },
                { label: "Tổng số món",  value: totalDishes,       icon: "🍜" },
                { label: "Nhà hàng",     value: activeRestaurants, icon: "🏠" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="rounded-xl bg-gray-50 px-2 py-3 text-center ring-1 ring-gray-100">
                  <p className="text-base">{icon}</p>
                  <p className="mt-1 text-[18px] font-black text-gray-900">{value}</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-4">
        <p className="text-[12px] text-gray-400">📥 Xuất báo cáo Excel / PDF — sẽ có trong phiên bản tiếp theo</p>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-500">Coming soon</span>
      </div>
    </div>
  );
}
