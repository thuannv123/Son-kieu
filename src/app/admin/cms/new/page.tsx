"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUploader from "@/components/admin/ImageUploader";
import ContentEditor from "@/components/admin/ContentEditor";

const CATEGORIES = [
  { value: "news",  label: "Tin tức"   },
  { value: "guide", label: "Cẩm nang"  },
  { value: "food",  label: "Ẩm thực"   },
  { value: "event", label: "Sự kiện"   },
];

const INPUT  = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition";
const LABEL  = "mb-1.5 block text-[12px] font-bold uppercase tracking-wider text-gray-500";

function FocusKeywordBox({
  keyword, onChange, title, excerpt, content, slug,
}: {
  keyword: string; onChange: (v: string) => void;
  title: string; excerpt: string; content: string; slug?: string;
}) {
  const kw = keyword.trim().toLowerCase();
  const kwSlug = kw.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9\s]/g, "").trim().replace(/\s+/g, "-");
  const kwWords     = kw.split(/\s+/).filter(w => w.length >= 2);
  const kwSlugWords = kwSlug.split("-").filter(w => w.length >= 3);

  function wordMatch(text: string, words: string[]) {
    if (!words.length) return false;
    const t = text.toLowerCase();
    const matched = words.filter(w => t.includes(w)).length;
    return matched === words.length;
  }

  const checks = [
    { label: "Tiêu đề",  ok: kw.length > 0 && wordMatch(title,   kwWords)     },
    ...(slug !== undefined ? [{ label: "Slug URL", ok: kw.length > 0 && wordMatch(slug, kwSlugWords) }] : []),
    { label: "Tóm tắt",  ok: kw.length > 0 && wordMatch(excerpt, kwWords)     },
    { label: "Nội dung", ok: kw.length > 0 && wordMatch(content, kwWords)     },
  ];

  const score = kw ? checks.filter(c => c.ok).length : null;

  return (
    <div className="rounded-xl border border-dashed border-violet-200 bg-violet-50/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">Focus Keyword</span>
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">SEO</span>
        </div>
        {score !== null && (
          <span className={`text-[11px] font-bold ${
            score >= 3 ? "text-emerald-600" : score >= 2 ? "text-amber-600" : "text-red-500"
          }`}>
            {score}/{checks.length} {score >= 3 ? "✓ Tốt" : score >= 2 ? "Khá" : "Cần cải thiện"}
          </span>
        )}
      </div>

      <input
        className={INPUT}
        value={keyword}
        onChange={e => onChange(e.target.value)}
        placeholder="VD: du lịch hang động quảng trị"
      />

      {kw && (
        <div className="grid grid-cols-2 gap-1.5">
          {checks.map(({ label, ok }) => (
            <div key={label} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium
              ${ok ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black
                ${ok ? "bg-emerald-500 text-white" : "bg-gray-300 text-gray-500"}`}>
                {ok ? "✓" : "✕"}
              </span>
              {label}
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-gray-400">
        Từ khóa chính bạn muốn Google tìm thấy bài này. Nên xuất hiện trong tiêu đề và tóm tắt.
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
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

export default function NewPostPage() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title:        "",
    excerpt:      "",
    content:      "",
    category:     "news",
    author:       "",
    seo_keywords: "",
    is_published: false,
    cover_image:  "",
    event_date:   "",
  });

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const res  = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/cms");
        router.refresh();
      } else {
        setError(data.error ?? "Đã xảy ra lỗi");
      }
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/cms"
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2
                     text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50">
          <BackIcon /> Quay lại
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900">Viết bài mới</h1>
          <p className="mt-0.5 text-[13px] text-gray-400">Tạo bài viết mới cho website</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.05]">
          <div className="space-y-5 p-6">

            <ImageUploader
              value={form.cover_image}
              onChange={url => set("cover_image", url)}
              folder="posts"
              label="Ảnh bìa bài viết"
            />

            <Field label="Tiêu đề *">
              <input className={INPUT} value={form.title} required
                onChange={e => set("title", e.target.value)}
                placeholder="VD: Hướng dẫn khám phá Hang Phong Nha từ A-Z" />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Danh mục *">
                <select className={INPUT} value={form.category}
                  onChange={e => set("category", e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Tác giả *">
                <input className={INPUT} value={form.author} required
                  onChange={e => set("author", e.target.value)}
                  placeholder="VD: Nguyễn Văn A" />
              </Field>
            </div>

            {form.category === "event" && (
              <Field label="Ngày diễn ra sự kiện">
                <input type="datetime-local" className={INPUT} value={form.event_date}
                  onChange={e => set("event_date", e.target.value)} />
              </Field>
            )}

            <Field label="Tóm tắt">
              <textarea className={`${INPUT} resize-none`} rows={2} value={form.excerpt}
                onChange={e => set("excerpt", e.target.value)}
                placeholder="Mô tả ngắn hiển thị trên danh sách bài viết..." />
            </Field>

            <Field label="Nội dung *">
              <ContentEditor value={form.content} onChange={v => set("content", v)} rows={20} required />
            </Field>

            {/* Focus Keyword */}
            <FocusKeywordBox
              keyword={form.seo_keywords}
              onChange={v => set("seo_keywords", v)}
              title={form.title}
              excerpt={form.excerpt}
              content={form.content}
            />

            {/* Publish toggle */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <div>
                <p className="text-[13px] font-semibold text-gray-800">Đăng bài ngay</p>
                <p className="text-[11px] text-gray-400">Bài viết sẽ hiển thị công khai trên website</p>
              </div>
              <button type="button" onClick={() => set("is_published", !form.is_published)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.is_published ? "bg-emerald-500" : "bg-gray-300"
                }`}>
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  form.is_published ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
            <Link href="/admin/cms"
              className="rounded-xl border border-gray-200 px-5 py-2 text-[13px] font-semibold
                         text-gray-700 transition hover:bg-gray-50">
              Hủy
            </Link>
            <button type="submit" disabled={pending}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-[13px] font-semibold
                         text-white transition hover:bg-emerald-700 disabled:opacity-60">
              {pending ? "Đang lưu…" : form.is_published ? "Đăng bài" : "Lưu nháp"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
