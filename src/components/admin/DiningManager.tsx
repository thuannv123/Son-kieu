"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageUploader from "./ImageUploader";
import Dialog from "@/components/ui/Dialog";

/* ── Types ─────────────────────────────────────────────────────── */
interface DishCategory { id: number; name: string; slug: string; emoji: string; sort_order: number; }
interface Dish {
  id: string; name: string; description: string; price: string;
  tag: string; category: string | null; emoji: string; color: string;
  is_active: boolean; sort_order: number; image_url?: string;
}
interface Restaurant {
  id: string; name: string; type: string; address: string;
  hours: string; tag: string; is_active: boolean; sort_order: number;
}

/* ── Helpers ────────────────────────────────────────────────────── */
const COLOR_OPTIONS = [
  { value: "orange", label: "Cam",    preview: "from-orange-600 to-red-800"   },
  { value: "amber",  label: "Vàng",   preview: "from-amber-600 to-orange-800" },
  { value: "teal",   label: "Ngọc",   preview: "from-teal-600 to-cyan-800"    },
  { value: "cyan",   label: "Xanh",   preview: "from-cyan-600 to-blue-800"    },
  { value: "lime",   label: "Lá",     preview: "from-lime-600 to-green-800"   },
  { value: "yellow", label: "Vàng lá",preview: "from-yellow-600 to-amber-800" },
  { value: "violet", label: "Tím",    preview: "from-violet-600 to-purple-800"},
  { value: "rose",   label: "Hồng",   preview: "from-rose-600 to-pink-800"    },
];

export const COLOR_GRADIENT: Record<string, string> = {
  orange: "from-orange-700 to-red-900",
  amber:  "from-amber-700 to-orange-900",
  teal:   "from-teal-700 to-cyan-900",
  cyan:   "from-cyan-700 to-blue-900",
  lime:   "from-lime-700 to-green-900",
  yellow: "from-yellow-700 to-amber-900",
  violet: "from-violet-700 to-purple-900",
  rose:   "from-rose-700 to-pink-900",
};

const INPUT = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition";

function getToken() {
  return document.cookie.match(/admin_session=([^;]+)/)?.[1] ?? "";
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-gray-500">{label}</label>
      {children}
    </div>
  );
}
function PlusIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function EditIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
}

/* ── Dish Modal ─────────────────────────────────────────────────── */
function DishModal({ dish, categories, onClose }: { dish?: Dish; categories: DishCategory[]; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const isEdit = !!dish;

  const [form, setForm] = useState({
    name:        dish?.name        ?? "",
    description: dish?.description ?? "",
    price:       dish?.price       ?? "",
    tag:         dish?.tag         ?? "",
    category:    dish?.category    ?? "",
    emoji:       dish?.emoji       ?? "🍜",
    color:       dish?.color       ?? "orange",
    is_active:   dish?.is_active   ?? true,
    sort_order:  dish?.sort_order  ?? 0,
    image_url:   dish?.image_url   ?? "",
  });

  function set(k: string, v: unknown) { setForm(p => ({ ...p, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    start(async () => {
      const url = isEdit ? `/api/admin/dishes/${dish!.id}` : "/api/admin/dishes";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { router.refresh(); onClose(); }
      else setError(data.error ?? "Lỗi");
    });
  }

  async function doDelete() {
    start(async () => {
      const res = await fetch(`/api/admin/dishes/${dish!.id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) { router.refresh(); onClose(); }
      else setError(data.error ?? "Lỗi");
    });
  }

  return (
    <>
    <Dialog open={deleteDialog}
      title="Xóa món ăn"
      message={`Xóa món "${dish?.name}"?\nHành động này không thể hoàn tác.`}
      danger onConfirm={doDelete} onClose={() => setDeleteDialog(false)} />
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-[15px] font-bold text-gray-900">{isEdit ? "Sửa món ăn" : "Thêm món ăn mới"}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          <ImageUploader
            value={form.image_url}
            onChange={url => set("image_url", url)}
            folder="dishes"
          />
          <Field label="Tên món *">
            <input className={INPUT} required value={form.name} onChange={e => set("name", e.target.value)} placeholder="VD: Bún bò Huế" />
          </Field>
          <Field label="Mô tả">
            <textarea className={`${INPUT} resize-none`} rows={2} value={form.description} onChange={e => set("description", e.target.value)} />
          </Field>
          <Field label="Danh mục *">
            <select className={INPUT} value={form.category} onChange={e => set("category", e.target.value)} required>
              <option value="">-- Chọn danh mục --</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.emoji} {c.name}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Giá">
              <input className={INPUT} value={form.price} onChange={e => set("price", e.target.value)} placeholder="35.000đ" />
            </Field>
            <Field label="Nhãn badge">
              <input className={INPUT} value={form.tag} onChange={e => set("tag", e.target.value)} placeholder="Combo Đặc Biệt" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Emoji">
              <input className={INPUT} value={form.emoji} onChange={e => set("emoji", e.target.value)} placeholder="🍜" />
            </Field>
            <Field label="Thứ tự">
              <input className={INPUT} type="number" min="0" value={form.sort_order} onChange={e => set("sort_order", Number(e.target.value))} />
            </Field>
          </div>
          <Field label="Màu card">
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(c => (
                <button key={c.value} type="button" onClick={() => set("color", c.value)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                    form.color === c.value ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}>
                  <span className={`inline-block h-3 w-3 rounded-full bg-gradient-to-br ${c.preview}`} />
                  {c.label}
                </button>
              ))}
            </div>
          </Field>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[13px] font-semibold text-gray-800">Hiển thị</p>
            <button type="button" onClick={() => set("is_active", !form.is_active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? "bg-emerald-500" : "bg-gray-300"}`}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-700">⚠️ {error}</p>}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            {isEdit
              ? <button type="button" onClick={() => setDeleteDialog(true)} disabled={pending} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><TrashIcon /> Xóa</button>
              : <span />}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={pending} className="rounded-xl border border-gray-200 px-5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
              <button type="submit" disabled={pending} className="rounded-xl bg-emerald-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                {pending ? "Đang lưu…" : isEdit ? "Lưu" : "Thêm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

/* ── Restaurant Modal ───────────────────────────────────────────── */
function RestaurantModal({ restaurant, onClose }: { restaurant?: Restaurant; onClose: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const isEdit = !!restaurant;

  const [form, setForm] = useState({
    name:      restaurant?.name      ?? "",
    type:      restaurant?.type      ?? "",
    address:   restaurant?.address   ?? "",
    hours:     restaurant?.hours     ?? "",
    tag:       restaurant?.tag       ?? "",
    is_active: restaurant?.is_active ?? true,
    sort_order:restaurant?.sort_order ?? 0,
  });

  function set(k: string, v: unknown) { setForm(p => ({ ...p, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    start(async () => {
      const url = isEdit ? `/api/admin/restaurants/${restaurant!.id}` : "/api/admin/restaurants";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { router.refresh(); onClose(); }
      else setError(data.error ?? "Lỗi");
    });
  }

  async function doDelete() {
    start(async () => {
      const res = await fetch(`/api/admin/restaurants/${restaurant!.id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) { router.refresh(); onClose(); }
      else setError(data.error ?? "Lỗi");
    });
  }

  return (
    <>
    <Dialog open={deleteDialog}
      title="Xóa nhà hàng"
      message={`Xóa nhà hàng "${restaurant?.name}"?\nHành động này không thể hoàn tác.`}
      danger onConfirm={doDelete} onClose={() => setDeleteDialog(false)} />
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-[15px] font-bold text-gray-900">{isEdit ? "Sửa nhà hàng" : "Thêm nhà hàng mới"}</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
          <Field label="Tên nhà hàng *">
            <input className={INPUT} required value={form.name} onChange={e => set("name", e.target.value)} />
          </Field>
          <Field label="Loại hình">
            <input className={INPUT} value={form.type} onChange={e => set("type", e.target.value)} placeholder="Hải sản & Đặc sản vùng" />
          </Field>
          <Field label="Địa chỉ">
            <input className={INPUT} value={form.address} onChange={e => set("address", e.target.value)} placeholder="12 Lý Thái Tổ, Đồng Hới" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Giờ mở cửa">
              <input className={INPUT} value={form.hours} onChange={e => set("hours", e.target.value)} placeholder="10:00 – 22:00" />
            </Field>
            <Field label="Nhãn đề xuất">
              <input className={INPUT} value={form.tag} onChange={e => set("tag", e.target.value)} placeholder="Được đề xuất" />
            </Field>
          </div>
          <Field label="Thứ tự">
            <input className={INPUT} type="number" min="0" value={form.sort_order} onChange={e => set("sort_order", Number(e.target.value))} />
          </Field>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-[13px] font-semibold text-gray-800">Hiển thị</p>
            <button type="button" onClick={() => set("is_active", !form.is_active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? "bg-emerald-500" : "bg-gray-300"}`}>
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-700">⚠️ {error}</p>}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            {isEdit
              ? <button type="button" onClick={() => setDeleteDialog(true)} disabled={pending} className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"><TrashIcon /> Xóa</button>
              : <span />}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} disabled={pending} className="rounded-xl border border-gray-200 px-5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">Hủy</button>
              <button type="submit" disabled={pending} className="rounded-xl bg-emerald-600 px-5 py-2 text-[13px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                {pending ? "Đang lưu…" : isEdit ? "Lưu" : "Thêm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

/* ── Main Manager ───────────────────────────────────────────────── */
export default function DiningManager({
  dishes,
  restaurants,
  categories,
}: {
  dishes:      Dish[];
  restaurants: Restaurant[];
  categories:  DishCategory[];
}) {
  const [tab,             setTab]             = useState<"dishes" | "restaurants">("dishes");
  const [catFilter,       setCatFilter]       = useState<string>("all");
  const [dishModal,       setDishModal]       = useState<"new" | Dish | null>(null);
  const [restaurantModal, setRestaurantModal] = useState<"new" | Restaurant | null>(null);

  const visibleDishes = catFilter === "all"
    ? dishes
    : dishes.filter(d => d.category === catFilter);

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-gray-900">Quản lý Ẩm thực</h1>
            <p className="mt-0.5 text-[13px] text-gray-400">
              {dishes.filter(d => d.is_active).length} món đang hiển thị ·{" "}
              {restaurants.filter(r => r.is_active).length} nhà hàng
            </p>
          </div>
          <button
            onClick={() => tab === "dishes" ? setDishModal("new") : setRestaurantModal("new")}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5
                       text-[13px] font-semibold text-white transition hover:bg-emerald-700">
            <PlusIcon />
            {tab === "dishes" ? "Thêm món ăn" : "Thêm nhà hàng"}
          </button>
        </div>

        {/* Main tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
          {(["dishes", "restaurants"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold transition ${
                tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t === "dishes" ? `Món ăn (${dishes.length})` : `Nhà hàng (${restaurants.length})`}
            </button>
          ))}
        </div>

        {/* Category filter — chỉ hiện khi tab Món ăn */}
        {tab === "dishes" && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCatFilter("all")}
              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition ${
                catFilter === "all"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}>
              Tất cả ({dishes.length})
            </button>
            {categories.map(c => (
              <button key={c.slug} onClick={() => setCatFilter(c.slug)}
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition ${
                  catFilter === c.slug
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}>
                {c.emoji} {c.name} ({dishes.filter(d => d.category === c.slug).length})
              </button>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]">

          {/* ── Dishes tab ── */}
          {tab === "dishes" && (
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {["Món ăn", "Danh mục", "Giá", "Nhãn", "Thứ tự", "Trạng thái", ""].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleDishes.map(d => {
                  const cat = categories.find(c => c.slug === d.category);
                  return (
                  <tr key={d.id} className="transition-colors hover:bg-gray-50/60" style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-lg ${COLOR_GRADIENT[d.color] ?? "from-gray-500 to-gray-700"}`}>
                          {d.image_url
                            ? <Image src={d.image_url} alt={d.name} fill className="object-cover" sizes="36px" />
                            : d.emoji}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{d.name}</p>
                          <p className="mt-0.5 line-clamp-1 max-w-[180px] text-[11px] text-gray-400">{d.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {cat
                        ? <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">{cat.emoji} {cat.name}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-800">{d.price || "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">{d.tag || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-gray-500">{d.sort_order}</td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${
                        d.is_active ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60" : "bg-red-50 text-red-600 ring-red-200/60"
                      }`}>
                        {d.is_active ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setDishModal(d)}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5
                                   text-[12px] font-semibold text-gray-600 transition
                                   hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                        <EditIcon /> Sửa
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* ── Restaurants tab ── */}
          {tab === "restaurants" && (
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {["Nhà hàng", "Loại hình", "Địa chỉ", "Giờ mở", "Nhãn", "Trạng thái", ""].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {restaurants.map(r => (
                  <tr key={r.id} className="transition-colors hover:bg-gray-50/60" style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td className="px-4 py-3.5 font-semibold text-gray-900">{r.name}</td>
                    <td className="px-4 py-3.5 text-gray-500">{r.type || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-500">{r.address || "—"}</td>
                    <td className="px-4 py-3.5 text-gray-500">{r.hours || "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">{r.tag || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${
                        r.is_active ? "bg-emerald-50 text-emerald-700 ring-emerald-200/60" : "bg-red-50 text-red-600 ring-red-200/60"
                      }`}>
                        {r.is_active ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => setRestaurantModal(r)}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5
                                   text-[12px] font-semibold text-gray-600 transition
                                   hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                        <EditIcon /> Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Empty states */}
          {tab === "dishes" && dishes.length === 0 && (
            <div className="py-16 text-center text-[13px] text-gray-400">
              Chưa có món ăn.{" "}
              <button onClick={() => setDishModal("new")} className="font-semibold text-emerald-600 underline">Thêm ngay</button>
            </div>
          )}
          {tab === "restaurants" && restaurants.length === 0 && (
            <div className="py-16 text-center text-[13px] text-gray-400">
              Chưa có nhà hàng.{" "}
              <button onClick={() => setRestaurantModal("new")} className="font-semibold text-emerald-600 underline">Thêm ngay</button>
            </div>
          )}
        </div>
      </div>

      {dishModal && (
        <DishModal
          dish={dishModal === "new" ? undefined : dishModal}
          categories={categories}
          onClose={() => setDishModal(null)}
        />
      )}
      {restaurantModal && (
        <RestaurantModal
          restaurant={restaurantModal === "new" ? undefined : restaurantModal}
          onClose={() => setRestaurantModal(null)}
        />
      )}
    </>
  );
}
