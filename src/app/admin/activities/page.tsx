import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";

export const revalidate = 0;

const CAT_COLOR: Record<string, string> = {
  CAVE:        "bg-slate-100 text-slate-700",
  LAKE:        "bg-cyan-50 text-cyan-700",
  SIGHTSEEING: "bg-amber-50 text-amber-700",
  DINING:      "bg-orange-50 text-orange-700",
};
const CAT_LABEL: Record<string, string> = {
  CAVE:        "Hang Động",
  LAKE:        "Hồ Bơi",
  SIGHTSEEING: "Tham Quan",
  DINING:      "Ẩm Thực",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + "đ";

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export default async function AdminActivitiesPage() {
  const { data: activities } = await supabaseAdmin
    .from("activities")
    .select("id,name,category,price,duration_minutes,is_active,slug,content")
    .order("category")
    .order("name");

  const total    = activities?.length ?? 0;
  const active   = activities?.filter(a => a.is_active).length ?? 0;
  const hasContent = activities?.filter(a => a.content).length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Quản lý Hoạt Động</h1>
          <p className="mt-0.5 text-[13px] text-gray-400">
            {active}/{total} đang hoạt động · {hasContent} có bài viết
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tổng hoạt động", value: total },
          { label: "Đang mở",        value: active },
          { label: "Có bài viết",    value: hasContent },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]">
        {!activities?.length ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-4xl">🌿</p>
            <p className="mt-3">Chưa có hoạt động nào</p>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Tên hoạt động", "Danh mục", "Giá", "Thời lượng", "Bài viết", "Trạng thái", ""].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map(a => (
                <tr key={a.id} className="transition-colors hover:bg-gray-50/60"
                  style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900 line-clamp-1 max-w-[220px]">{a.name}</p>
                    {a.slug && (
                      <p className="mt-0.5 font-mono text-[11px] text-gray-400">/activities/{a.slug}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${CAT_COLOR[a.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {CAT_LABEL[a.category] ?? a.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-gray-700">{fmt(Number(a.price))}</td>
                  <td className="px-4 py-3.5 text-gray-500">{a.duration_minutes} phút</td>
                  <td className="px-4 py-3.5">
                    {a.content ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">Có</span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-400">Chưa có</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${
                      a.is_active
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60"
                        : "bg-gray-100 text-gray-500 ring-gray-200"
                    }`}>
                      {a.is_active ? "Mở" : "Đóng"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/activities/${a.id}/edit`}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-200
                                 px-3 py-1.5 text-[12px] font-semibold text-gray-600
                                 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                      <EditIcon /> Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
