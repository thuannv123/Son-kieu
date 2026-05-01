import { supabaseAdmin } from "@/lib/supabase-admin";
import Link from "next/link";

export const revalidate = 0;

const CAT_LABEL: Record<string, string> = {
  news:   "Tin tức",
  guide:  "Cẩm nang",
  food:   "Ẩm thực",
  event:  "Sự kiện",
};
const CAT_COLOR: Record<string, string> = {
  news:  "bg-blue-50  text-blue-700",
  guide: "bg-violet-50 text-violet-700",
  food:  "bg-orange-50 text-orange-700",
  event: "bg-rose-50   text-rose-700",
};

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export default async function CmsPage() {
  const { data: posts } = await supabaseAdmin
    .from("posts")
    .select("id,title,slug,category,author,is_published,published_at,created_at")
    .order("created_at", { ascending: false });

  const published = posts?.filter(p => p.is_published).length ?? 0;
  const drafts    = (posts?.length ?? 0) - published;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-gray-900">Quản lý Nội dung</h1>
          <p className="mt-0.5 text-[13px] text-gray-400">
            {published} đã đăng · {drafts} bản nháp
          </p>
        </div>
        <Link href="/admin/cms/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5
                     text-[13px] font-semibold text-white transition hover:bg-emerald-700">
          <PlusIcon /> Viết bài mới
        </Link>
      </div>

      {/* Post list */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_12px_rgba(0,0,0,0.06)]
                      ring-1 ring-black/[0.05]">
        {!posts?.length ? (
          <div className="py-20 text-center">
            <p className="text-[32px]">✍️</p>
            <p className="mt-3 font-semibold text-gray-700">Chưa có bài viết nào</p>
            <p className="mt-1 text-[13px] text-gray-400">Bắt đầu tạo bài viết đầu tiên cho website</p>
            <Link href="/admin/cms/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5
                         text-[13px] font-semibold text-white hover:bg-emerald-700">
              <PlusIcon /> Tạo bài viết
            </Link>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Tiêu đề", "Danh mục", "Tác giả", "Ngày tạo", "Trạng thái", ""].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold
                                         uppercase tracking-wider text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-gray-50/60"
                  style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-gray-900 line-clamp-1 max-w-xs">{p.title}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${CAT_COLOR[p.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {CAT_LABEL[p.category] ?? p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{p.author}</td>
                  <td className="px-4 py-3.5 text-gray-400">
                    {new Date(p.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${
                      p.is_published
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60"
                        : "bg-amber-50 text-amber-700 ring-amber-200/60"
                    }`}>
                      {p.is_published ? "Đã đăng" : "Bản nháp"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/cms/${p.id}/edit`}
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
