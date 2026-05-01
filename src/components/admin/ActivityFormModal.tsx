"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import Dialog from "@/components/ui/Dialog";

interface Activity {
  id:               string;
  name:             string;
  slug?:            string;
  category:         string;
  description:      string;
  content?:         string;
  safety_guideline?: string;
  highlights?:      string[];
  price:            number;
  duration_minutes: number;
  max_capacity:     number;
  max_per_slot:     number;
  difficulty_level: string;
  is_active:        boolean;
  image_url?:       string;
}

interface Props {
  activity?: Activity;
  onClose:   () => void;
}

const CATEGORIES = [
  { value: "CAVE",        label: "🦇 Hang Động"           },
  { value: "LAKE",        label: "🏊 Hồ Bơi"              },
  { value: "SIGHTSEEING", label: "🌄 Tham Quan Sinh Thái"  },
  { value: "DINING",      label: "🍽️ Ẩm Thực"             },
];

const DIFFICULTIES = [
  { value: "",       label: "Không có"                          },
  { value: "Dễ",     label: "Dễ — phù hợp mọi lứa tuổi"        },
  { value: "Trung bình", label: "Trung bình — cần sức khoẻ tốt" },
  { value: "Khó",    label: "Khó — cần kinh nghiệm leo trèo"    },
];

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[àáảãạăắằẳẵặâấầẩẫậ]/g, "a")
    .replace(/[đ]/g, "d")
    .replace(/[èéẻẽẹêếềểễệ]/g, "e")
    .replace(/[ìíỉĩị]/g, "i")
    .replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, "o")
    .replace(/[ùúủũụưứừửữự]/g, "u")
    .replace(/[ỳýỷỹỵ]/g, "y")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getToken() {
  return document.cookie.match(/admin_session=([^;]+)/)?.[1] ?? "";
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      {hint && <p className="mb-1.5 text-[11px] text-gray-400">{hint}</p>}
      {children}
    </div>
  );
}

const INPUT = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition";

type Tab = "basic" | "article";

export default function ActivityFormModal({ activity, onClose }: Props) {
  const router           = useRouter();
  const [pending, start] = useTransition();
  const isEdit           = !!activity;
  const [tab, setTab]    = useState<Tab>("basic");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name:             activity?.name             ?? "",
    slug:             activity?.slug             ?? "",
    category:         activity?.category         ?? "CAVE",
    description:      activity?.description      ?? "",
    content:          activity?.content          ?? "",
    safety_guideline: activity?.safety_guideline ?? "",
    highlights:       (activity?.highlights ?? []).join("\n"),
    price:            activity?.price            ?? 150000,
    duration_minutes: activity?.duration_minutes ?? 90,
    max_capacity:     activity?.max_capacity     ?? 50,
    max_per_slot:     activity?.max_per_slot     ?? 10,
    difficulty_level: activity?.difficulty_level ?? "",
    is_active:        activity?.is_active        ?? true,
    image_url:        activity?.image_url        ?? "",
  });

  /* Auto-generate slug when name changes (only for new activities) */
  useEffect(() => {
    if (!isEdit && form.name) {
      setForm(prev => ({ ...prev, slug: toSlug(form.name) }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, isEdit]);

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const url    = isEdit ? `/api/admin/activities/${activity!.id}` : "/api/admin/activities";
      const method = isEdit ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          ...form,
          price:            Number(form.price),
          duration_minutes: Number(form.duration_minutes),
          max_capacity:     Number(form.max_capacity),
          max_per_slot:     Number(form.max_per_slot),
          highlights: form.highlights
            .split(/[\n,]/)
            .map(s => s.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (res.ok) { router.refresh(); onClose(); }
      else setError(data.error ?? "Đã xảy ra lỗi");
    });
  }

  const [deleteDialog, setDeleteDialog] = useState(false);

  function handleDelete() {
    setDeleteDialog(true);
  }

  function doDelete() {
    setError("");
    start(async () => {
      const res  = await fetch(`/api/admin/activities/${activity!.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) { router.refresh(); onClose(); }
      else setError(data.error ?? "Xóa thất bại");
    });
  }

  return (
    <>
    <Dialog open={deleteDialog}
      title="Xóa hoạt động"
      message={`Xóa hoạt động "${activity?.name}"?\nHành động này không thể hoàn tác.`}
      danger onConfirm={doDelete} onClose={() => setDeleteDialog(false)} />
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "90vh" }}>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">
              {isEdit ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
            </h2>
            {form.slug && (
              <p className="font-mono text-[11px] text-gray-400">/activities/{form.slug}</p>
            )}
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="shrink-0 flex gap-1 border-b border-gray-100 px-6 pt-3">
          {([["basic", "Thông tin"], ["article", "Bài viết"]] as [Tab, string][]).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setTab(key)}
              className={`mb-0 rounded-t-lg px-4 py-2 text-[13px] font-semibold transition ${
                tab === key
                  ? "border-b-2 border-emerald-500 text-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}>
              {label}
              {key === "article" && form.content && (
                <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Form body — scrollable */}
        <form id="activity-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">

            {/* ── Tab: Thông tin ── */}
            {tab === "basic" && (
              <div className="space-y-4">
                <ImageUploader
                  value={form.image_url}
                  onChange={url => set("image_url", url)}
                  folder="activities"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tên hoạt động *">
                    <input className={INPUT} value={form.name} required
                      onChange={e => set("name", e.target.value)}
                      placeholder="VD: Hang Phong Nhĩ" />
                  </Field>
                  <Field label="Slug (URL)">
                    <input className={`${INPUT} font-mono text-[12px]`} value={form.slug}
                      placeholder="tu-dong-tao"
                      onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Danh mục *">
                    <select className={INPUT} value={form.category}
                      onChange={e => set("category", e.target.value)}>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Độ khó">
                    <select className={INPUT} value={form.difficulty_level}
                      onChange={e => set("difficulty_level", e.target.value)}>
                      {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Field label="Giá vé (đ) *">
                    <input className={INPUT} type="number" min="0" required value={form.price}
                      onChange={e => set("price", e.target.value)} />
                  </Field>
                  <Field label="Thời gian (phút)">
                    <input className={INPUT} type="number" min="1" value={form.duration_minutes}
                      onChange={e => set("duration_minutes", e.target.value)} />
                  </Field>
                  <Field label="Tối đa / slot">
                    <input className={INPUT} type="number" min="1" value={form.max_per_slot}
                      onChange={e => set("max_per_slot", e.target.value)} />
                  </Field>
                </div>

                <Field label="Mô tả ngắn" hint="Hiển thị trong danh sách và thẻ SEO">
                  <textarea className={`${INPUT} resize-none`} rows={2} value={form.description}
                    onChange={e => set("description", e.target.value)}
                    placeholder="Mô tả ngắn gọn..." />
                </Field>

                <Field label="Điểm nổi bật" hint="Mỗi dòng một điểm">
                  <textarea className={`${INPUT} resize-none`} rows={3} value={form.highlights}
                    onChange={e => set("highlights", e.target.value)}
                    placeholder={"Thạch nhũ triệu năm\nHệ sinh thái đa dạng\nTour có hướng dẫn viên"} />
                </Field>

                <Field label="Hướng dẫn an toàn">
                  <textarea className={`${INPUT} resize-none`} rows={3} value={form.safety_guideline}
                    onChange={e => set("safety_guideline", e.target.value)}
                    placeholder={"• Đội mũ bảo hiểm bắt buộc\n• Không tự ý rời khỏi đoàn..."} />
                </Field>

                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-800">Hiển thị trên website</p>
                    <p className="text-[11px] text-gray-400">Khách có thể đặt vé hoạt động này</p>
                  </div>
                  <button type="button" onClick={() => set("is_active", !form.is_active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.is_active ? "bg-emerald-500" : "bg-gray-300"
                    }`}>
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      form.is_active ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Tab: Bài viết ── */}
            {tab === "article" && (
              <div className="space-y-3">
                <p className="text-[12px] text-gray-400">
                  Hỗ trợ Markdown:{" "}
                  <code className="rounded bg-gray-100 px-1 font-mono">## Tiêu đề</code>{" "}
                  <code className="rounded bg-gray-100 px-1 font-mono">**in đậm**</code>{" "}
                  <code className="rounded bg-gray-100 px-1 font-mono">- danh sách</code>
                </p>
                <textarea
                  className={`${INPUT} resize-y font-mono text-[12px] leading-relaxed`}
                  rows={22}
                  value={form.content}
                  onChange={e => set("content", e.target.value)}
                  placeholder={`## Giới thiệu\n\nViết nội dung chi tiết cho khách đọc và tối ưu SEO...\n\n## Trải nghiệm\n\nMô tả những gì khách sẽ được trải qua...\n\n## Lưu ý\n\n- Mang theo nước uống\n- Mặc quần áo thoải mái`}
                />
                <p className="text-[11px] text-gray-400">
                  {form.content.length} ký tự · {form.content.split(/\s+/).filter(Boolean).length} từ
                </p>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">
                ⚠️ {error}
              </p>
            )}
          </div>
        </form>

        {/* Footer — fixed at bottom */}
        <div className="shrink-0 flex items-center justify-between border-t border-gray-100 px-6 py-4">
          {isEdit ? (
            <button type="button" onClick={handleDelete} disabled={pending}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold
                         text-red-600 transition hover:bg-red-50 disabled:opacity-50">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              Xóa
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={pending}
              className="rounded-xl border border-gray-200 px-5 py-2 text-[13px] font-semibold
                         text-gray-700 transition hover:bg-gray-50 disabled:opacity-50">
              Hủy
            </button>
            <button type="submit" form="activity-form" disabled={pending}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-[13px] font-semibold
                         text-white transition hover:bg-emerald-700 disabled:opacity-60">
              {pending ? "Đang lưu…" : isEdit ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
