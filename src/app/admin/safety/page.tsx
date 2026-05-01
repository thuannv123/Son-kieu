import { supabaseAdmin } from "@/lib/supabase-admin";
import EmergencyPanel    from "@/components/admin/EmergencyPanel";

export const revalidate = 0;

async function getWeather() {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
    const res  = await fetch(`${base}/api/weather`, { cache: "no-store" });
    return res.ok ? res.json() : null;
  } catch { return null; }
}

export default async function SafetyPage() {
  const [{ data: activities }, weather] = await Promise.all([
    supabaseAdmin.from("activities").select("id,name,category,is_active").order("category"),
    getWeather(),
  ]);

  const grouped = {
    CAVE:        activities?.filter(a => a.category === "CAVE")        ?? [],
    LAKE:        activities?.filter(a => a.category === "LAKE")        ?? [],
    SIGHTSEEING: activities?.filter(a => a.category === "SIGHTSEEING") ?? [],
  };

  const isSafe     = weather?.isSafe !== false;
  const openCount  = activities?.filter(a => a.is_active).length ?? 0;
  const totalCount = activities?.length ?? 0;
  const allClosed  = openCount === 0 && totalCount > 0;

  return (
    <div className="space-y-5 max-w-[1200px]">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-black text-gray-900">An toàn & Khẩn cấp</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Kiểm soát trạng thái khu vực và điều phối khẩn cấp</p>
        </div>
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ring-1 text-[12px] font-semibold ${
          allClosed
            ? "bg-gray-100 ring-gray-200 text-gray-500"
            : "bg-white ring-black/[0.06] text-gray-700 shadow-sm"
        }`}>
          <span className={`h-2 w-2 rounded-full ${
            allClosed ? "bg-gray-400" : openCount > 0 ? "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" : "bg-red-500"
          }`} />
          {openCount}/{totalCount} khu vực đang mở
        </div>
      </div>

      {/* Weather + Status strip */}
      <div className={`overflow-hidden rounded-2xl ring-1 ${
        isSafe ? "ring-emerald-200/80" : "ring-red-200/80"
      }`}>
        <div className={`bg-gradient-to-r px-6 py-5 ${
          isSafe
            ? "from-emerald-500 to-teal-600"
            : "from-red-500 to-rose-600"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
                {isSafe ? "☀️" : "⛈️"}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-0.5">
                  Thời tiết hiện tại
                </p>
                <p className="text-[28px] font-black text-white leading-tight">
                  {weather?.temperature?.toFixed(1) ?? "—"}°C
                </p>
                <p className="text-[13px] text-white/80 capitalize mt-0.5">
                  {weather?.description ?? "Chưa có dữ liệu"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 font-black text-[13px] ${
                isSafe ? "bg-white/20 text-white" : "bg-white/20 text-white"
              }`}>
                <span className={`h-2.5 w-2.5 rounded-full ${isSafe ? "bg-white" : "bg-white animate-pulse"}`} />
                {isSafe ? "AN TOÀN" : "NGUY HIỂM"}
              </div>
              {weather?.humidity != null && (
                <p className="mt-2 text-[11px] text-white/60">
                  Độ ẩm {weather.humidity}%
                  {weather?.windSpeed != null && ` · Gió ${weather.windSpeed} km/h`}
                </p>
              )}
            </div>
          </div>
        </div>

        {!isSafe && (
          <div className="flex items-start gap-3 bg-red-50 px-5 py-3.5">
            <svg className="mt-0.5 shrink-0 text-red-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p className="text-[12px] text-red-700 font-medium leading-relaxed">
              Thời tiết xấu — Khuyến nghị đóng các hoạt động tắm hồ và hang động.
              Sử dụng nút khẩn cấp bên dưới để đóng ngay lập tức.
            </p>
          </div>
        )}
      </div>

      {/* Emergency panels grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {(["CAVE", "LAKE", "SIGHTSEEING"] as const).map((cat) => (
          <EmergencyPanel key={cat} category={cat} activities={grouped[cat]} />
        ))}
      </div>

      {/* Close ALL strip */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 shadow-lg shadow-red-500/20 ring-1 ring-red-500/30">
        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl">
              🚨
            </div>
            <div>
              <h3 className="text-[15px] font-black text-white">Đóng Khẩn Cấp Toàn Bộ</h3>
              <p className="text-[12px] text-white/70 mt-0.5">
                Tắt tất cả {totalCount} khu vực ngay lập tức · Dùng khi có bão hoặc sự cố
              </p>
            </div>
          </div>
          <EmergencyPanel category="ALL" activities={activities ?? []} showAsButton />
        </div>
      </div>

      {/* Bottom info row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Quick stats */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-base">📊</div>
            <h3 className="text-[13px] font-bold text-gray-900">Trạng thái theo loại hình</h3>
          </div>
          <div className="space-y-2.5">
            {([
              { key: "CAVE",        icon: "🦇", label: "Hang Động",  data: grouped.CAVE        },
              { key: "LAKE",        icon: "🏊", label: "Hồ Bơi",     data: grouped.LAKE        },
              { key: "SIGHTSEEING", icon: "🌄", label: "Tham Quan",  data: grouped.SIGHTSEEING },
            ] as const).map(({ icon, label, data }) => {
              const open  = data.filter(a => a.is_active).length;
              const total = data.length;
              const pct   = total > 0 ? (open / total) * 100 : 0;
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-base w-5 text-center">{icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-[12px] font-semibold text-gray-700">{label}</span>
                      <span className={`text-[11px] font-bold ${open === total ? "text-emerald-600" : open === 0 ? "text-red-500" : "text-amber-600"}`}>
                        {open}/{total}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          open === total ? "bg-emerald-500" : open === 0 ? "bg-gray-300" : "bg-amber-400"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff notice */}
        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-base">👷</div>
            <h3 className="text-[13px] font-bold text-gray-900">Hướng dẫn viên trực ca</h3>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 px-4 py-5 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 text-xl">
              🗓️
            </div>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Tính năng phân công hướng dẫn viên<br/>sẽ có trong phiên bản tiếp theo.
            </p>
            <a href="/admin/staff"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-[12px] font-bold
                         text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:ring-emerald-400 hover:text-emerald-700">
              Xem trang Nhân sự
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
