"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";

const CATEGORIES = [
  { value: "CAVE",        label: "Hang Động"  },
  { value: "LAKE",        label: "Hồ Bơi"     },
  { value: "SIGHTSEEING", label: "Tham Quan"  },
  { value: "DINING",      label: "Ẩm Thực"    },
];

const DIFFICULTIES = [
  { value: "",         label: "Không có"   },
  { value: "Dễ",       label: "Dễ"         },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Khó",      label: "Khó"        },
];

const INPUT = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition";
const LABEL = "mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-gray-500";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {hint && <p className="mb-1.5 text-[11px] text-gray-400">{hint}</p>}
      {children}
    </div>
  );
}

function getToken() {
  return document.cookie.match(/admin_session=([^;]+)/)?.[1] ?? "";
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

interface Activity {
  id:               string;
  name:             string;
  slug:             string;
  category:         string;
  description:      string;
  content:          string;
  safety_guideline: string;
  difficulty_level: string;
  price:            number;
  duration_minutes: number;
  max_capacity:     number;
  max_per_slot:     number;
  is_active:        boolean;
  image_url:        string;
  highlights:       string[];
}

export default function EditActivityPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params.id as string;

  const [pending, start]      = useTransition();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [saved, setSaved]     = useState(false);

  const [form, setForm] = useState({
    name:             "",
    slug:             "",
    category:         "CAVE",
    description:      "",
    content:          "",
    safety_guideline: "",
    difficulty_level: "",
    price:            0,
    duration_minutes: 60,
    max_capacity:     50,
    max_per_slot:     10,
    is_active:        true,
    image_url:        "",
    highlights:       "",   // comma/newline-separated string
  });

  useEffect(() => {
    fetch(`/api/admin/activities/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then((data: { activity?: Activity }) => {
        if (data.activity) {
          const a = data.activity;
          setForm({
            name:             a.name ?? "",
            slug:             a.slug ?? "",
            category:         a.category ?? "CAVE",
            description:      a.description ?? "",
            content:          a.content ?? "",
            safety_guideline: a.safety_guideline ?? "",
            difficulty_level: a.difficulty_level ?? "",
            price:            a.price ?? 0,
            duration_minutes: a.duration_minutes ?? 60,
            max_capacity:     a.max_capacity ?? 50,
            max_per_slot:     a.max_per_slot ?? 10,
            is_active:        a.is_active ?? true,
            image_url:        a.image_url ?? "",
            highlights:       (a.highlights ?? []).join("\n"),
          });
        }
        setLoading(false);
      });
  }, [id]);

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const res = await fetch(`/api/admin/activities/${id}`, {
        method:  "PUT",
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
      if (res.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setError(data.error ?? "Đã xảy ra lỗi");
      }
    });
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-[13px] text-gray-400">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/activities"
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2
                     text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50">
          <BackIcon /> Quay lại
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">Chỉnh sửa hoạt động</h1>
          {form.slug && (
            <p className="mt-0.5 font-mono text-[11px] text-gray-400">/activities/{form.slug}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">

          {/* ── Thông tin cơ bản ── */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]">
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-[13px] font-bold text-gray-700">Thông tin cơ bản</p>
            </div>
            <div className="space-y-5 p-6">
              <ImageUploader
                value={form.image_url}
                onChange={url => set("image_url", url)}
                folder="activities"
                label="Ảnh đại diện hoạt động"
              />

              <div className="grid grid-cols-2 gap-4">
                <Field label="Tên hoạt động *">
                  <input className={INPUT} value={form.name} required
                    onChange={e => set("name", e.target.value)} />
                </Field>
                <Field label="Slug (URL)">
                  <input className={`${INPUT} font-mono text-[12px]`} value={form.slug}
                    placeholder="vd: hang-phong-nhi"
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

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Field label="Giá (VND) *">
                  <input type="number" className={INPUT} value={form.price} required min={0}
                    onChange={e => set("price", e.target.value)} />
                </Field>
                <Field label="Thời lượng (phút)">
                  <input type="number" className={INPUT} value={form.duration_minutes} min={1}
                    onChange={e => set("duration_minutes", e.target.value)} />
                </Field>
                <Field label="Sức chứa tối đa">
                  <input type="number" className={INPUT} value={form.max_capacity} min={1}
                    onChange={e => set("max_capacity", e.target.value)} />
                </Field>
                <Field label="Tối đa/slot">
                  <input type="number" className={INPUT} value={form.max_per_slot} min={1}
                    onChange={e => set("max_per_slot", e.target.value)} />
                </Field>
              </div>

              <Field label="Mô tả ngắn" hint="Hiển thị trong danh sách và thẻ SEO (tối đa 155 ký tự)">
                <textarea className={`${INPUT} resize-none`} rows={2} value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Mô tả ngắn gọn về hoạt động..." />
              </Field>

              <Field label="Điểm nổi bật" hint="Mỗi dòng là một điểm (hiển thị dưới dạng badge)">
                <textarea className={`${INPUT} resize-none`} rows={3} value={form.highlights}
                  onChange={e => set("highlights", e.target.value)}
                  placeholder={"Thạch nhũ triệu năm\nHệ sinh thái đa dạng\nTour có hướng dẫn viên"} />
              </Field>

              <Field label="Hướng dẫn an toàn">
                <textarea className={`${INPUT} resize-y`} rows={4} value={form.safety_guideline}
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
          </div>

          {/* ── Bài viết chi tiết ── */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]">
            <div className="border-b border-gray-100 px-6 py-4">
              <p className="text-[13px] font-bold text-gray-700">Bài viết chi tiết</p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                Hỗ trợ Markdown: <code className="rounded bg-gray-100 px-1 font-mono">## Tiêu đề</code>{" "}
                <code className="rounded bg-gray-100 px-1 font-mono">**in đậm**</code>{" "}
                <code className="rounded bg-gray-100 px-1 font-mono">*in nghiêng*</code>{" "}
                <code className="rounded bg-gray-100 px-1 font-mono">- danh sách</code>
              </p>
            </div>
            <div className="p-6">
              <textarea
                className={`${INPUT} resize-y font-mono text-[12px] leading-relaxed`}
                rows={24}
                value={form.content}
                onChange={e => set("content", e.target.value)}
                placeholder={`## Giới thiệu\n\nViết nội dung chi tiết về hoạt động này để khách hiểu rõ hơn và tối ưu SEO...\n\n## Trải nghiệm\n\nMô tả những gì khách sẽ được trải qua...\n\n## Lưu ý khi tham gia\n\n- Mang theo nước uống\n- Mặc quần áo thoải mái\n- Đến trước 15 phút`}
              />
              <p className="mt-2 text-[11px] text-gray-400">
                {form.content.length} ký tự ·{" "}
                {form.content.split(/\s+/).filter(Boolean).length} từ
              </p>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
              ⚠️ {error}
            </p>
          )}

          {saved && (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
              ✓ Đã lưu thay đổi
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2">
            <Link href="/admin/activities"
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-[13px] font-semibold
                         text-gray-700 transition hover:bg-gray-50">
              Hủy
            </Link>
            <button type="submit" disabled={pending}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-[13px] font-semibold
                         text-white transition hover:bg-emerald-700 disabled:opacity-60">
              {pending ? "Đang lưu…" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
