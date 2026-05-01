"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

type Category = "cave" | "lake" | "tour" | "food" | "resort";

const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: "cave",   label: "Hang Động", icon: "🦇" },
  { value: "lake",   label: "Hồ & Suối", icon: "🏊" },
  { value: "tour",   label: "Tham Quan", icon: "🌄" },
  { value: "food",   label: "Ẩm Thực",  icon: "🍽️" },
  { value: "resort", label: "Resort",    icon: "🏡" },
];

const CAT_SUBLABEL: Record<Category, string> = {
  cave:   "Hang Động",
  lake:   "Hồ & Suối",
  tour:   "Tham Quan",
  food:   "Ẩm Thực",
  resort: "Resort",
};

interface Photo {
  id: string;
  src: string;
  label: string;
  sublabel: string;
  category: Category;
  sort_order: number;
}

export default function AdminGalleryPage() {
  const [photos,    setPhotos]    = useState<Photo[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState("");
  const [editId,    setEditId]    = useState<string | null>(null);

  /* Upload form state */
  const [label,    setLabel]    = useState("");
  const [category, setCategory] = useState<Category>("resort");
  const [preview,  setPreview]  = useState<string | null>(null);
  const [file,     setFile]     = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/gallery");
    const data = await res.json();
    setPhotos(data.photos ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    if (!label) setLabel(f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !label.trim()) return;
    setUploading(true);
    setError("");
    try {
      /* 1. Upload file */
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "gallery");
      const upRes  = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error ?? "Upload thất bại");

      /* 2. Lưu vào DB */
      const dbRes  = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src:      upData.url,
          label:    label.trim(),
          sublabel: CAT_SUBLABEL[category],
          category,
        }),
      });
      const dbData = await dbRes.json();
      if (!dbRes.ok) throw new Error(dbData.error ?? "Lưu DB thất bại");

      setPhotos(prev => [...prev, dbData.photo]);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setFile(null); setPreview(null); setLabel(""); setCategory("resort");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("Xoá ảnh này khỏi gallery?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setPhotos(prev => prev.filter(p => p.id !== id));
  }

  async function handleEdit(photo: Photo, newLabel: string, newCategory: Category) {
    await fetch(`/api/admin/gallery/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel, sublabel: CAT_SUBLABEL[newCategory], category: newCategory }),
    });
    setPhotos(prev => prev.map(p => p.id === photo.id
      ? { ...p, label: newLabel, sublabel: CAT_SUBLABEL[newCategory], category: newCategory }
      : p
    ));
    setEditId(null);
  }

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-black text-gray-900">Thư viện ảnh</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">{photos.length} ảnh · Hiển thị tại trang /gallery</p>
        </div>
      </div>

      {/* ── Upload form ── */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <h2 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-gray-400">Thêm ảnh mới</h2>
        <h2 className="mb-4 text-[14px] font-bold text-gray-900">Thêm ảnh mới</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition
              ${preview ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50"}`}>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {preview ? (
              <div className="relative h-40 w-40 overflow-hidden rounded-xl">
                <Image src={preview} alt="preview" fill className="object-cover" sizes="160px" />
              </div>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p className="mt-2 text-[13px] font-semibold text-gray-600">Nhấn để chọn ảnh</p>
                <p className="text-[11px] text-gray-400">JPG, PNG, WebP · Tối đa 5MB</p>
              </>
            )}
            {preview && (
              <button type="button" onClick={e => { e.stopPropagation(); resetForm(); }}
                className="mt-3 text-[12px] text-red-500 hover:text-red-700">Chọn lại</button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-400">Tên ảnh *</label>
              <input required value={label} onChange={e => setLabel(e.target.value)}
                placeholder="VD: Hang Tối Kỳ Bí"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-400">Danh mục *</label>
              <select value={category} onChange={e => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">{error}</p>}

          <button type="submit" disabled={uploading || !file}
            className="w-full rounded-xl bg-emerald-600 py-3 text-[13px] font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
            {uploading ? "Đang tải lên…" : "Tải lên & Lưu vào Gallery"}
          </button>
        </form>
      </div>

      {/* ── Photo grid ── */}
      <div className="rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-2xl">🖼️</div>
            <p className="text-[13px] font-semibold text-gray-500">Chưa có ảnh nào</p>
            <p className="text-[11px] text-gray-400">Tải lên ảnh đầu tiên ở form trên</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {photos.map(photo => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isEditing={editId === photo.id}
                onEdit={() => setEditId(photo.id)}
                onSave={(label, cat) => handleEdit(photo, label, cat)}
                onCancel={() => setEditId(null)}
                onDelete={() => handleDelete(photo.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Photo Card ── */
function PhotoCard({
  photo, isEditing, onEdit, onSave, onCancel, onDelete,
}: {
  photo: Photo;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (label: string, cat: Category) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [label,    setLabel]    = useState(photo.label);
  const [category, setCategory] = useState<Category>(photo.category);

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <Image src={photo.src} alt={photo.label} fill className="object-cover" sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />
        {/* Overlay actions */}
        {!isEditing && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
            <button onClick={onEdit}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow transition hover:bg-emerald-600 hover:text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button onClick={onDelete}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-700 shadow transition hover:bg-red-500 hover:text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
          {CATEGORIES.find(c => c.value === photo.category)?.icon} {photo.sublabel}
        </span>
      </div>

      {/* Info / Edit */}
      <div className="p-3">
        {isEditing ? (
          <div className="space-y-2">
            <input value={label} onChange={e => setLabel(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] focus:border-emerald-500 focus:outline-none" />
            <select value={category} onChange={e => setCategory(e.target.value as Category)}
              className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-[12px] focus:border-emerald-500 focus:outline-none">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
            <div className="flex gap-1.5">
              <button onClick={() => onSave(label, category)}
                className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700">Lưu</button>
              <button onClick={onCancel}
                className="flex-1 rounded-lg border border-gray-200 py-1.5 text-[11px] font-semibold text-gray-600 hover:bg-gray-50">Huỷ</button>
            </div>
          </div>
        ) : (
          <p className="truncate text-[12px] font-semibold text-gray-800">{photo.label}</p>
        )}
      </div>
    </div>
  );
}
