"use client";

import { useState, useEffect } from "react";

interface Review {
  id: string;
  guest_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"}
      stroke={filled ? "#f59e0b" : "#d1d5db"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}>
          <StarIcon filled={n <= (hovered || value)} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsSection({ activityId }: { activityId: string }) {
  const [reviews,   setReviews]   = useState<Review[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");

  const [form, setForm] = useState({ guestName: "", guestEmail: "", rating: 5, comment: "" });

  useEffect(() => {
    fetch(`/api/reviews?activityId=${activityId}`)
      .then(r => r.json())
      .then(d => setReviews(d.reviews ?? []))
      .finally(() => setLoading(false));
  }, [activityId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const res  = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, ...form }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Lỗi gửi đánh giá"); return; }
    setSubmitted(true);
    setShowForm(false);
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  return (
    <section className="mt-10 border-t border-gray-100 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">⭐ Đánh Giá Của Khách</h2>
          {avgRating && (
            <p className="mt-1 text-[13px] text-gray-500">
              <span className="font-bold text-amber-500">{avgRating}</span>/5 · {reviews.length} đánh giá
            </p>
          )}
        </div>
        {!submitted && (
          <button onClick={() => setShowForm(v => !v)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-emerald-700">
            {showForm ? "Huỷ" : "✏️ Viết đánh giá"}
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-400">Đánh giá của bạn</label>
            <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-400">Họ tên *</label>
              <input required value={form.guestName} onChange={e => setForm(p => ({ ...p, guestName: e.target.value }))}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-400">Email (tuỳ chọn)</label>
              <input type="email" value={form.guestEmail} onChange={e => setForm(p => ({ ...p, guestEmail: e.target.value }))}
                placeholder="email@example.com"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-400">Nhận xét *</label>
            <textarea required rows={4} value={form.comment}
              onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">{error}</p>}
          <button type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 text-[13px] font-bold text-white transition hover:bg-emerald-700">
            Gửi đánh giá
          </button>
          <p className="text-center text-[11px] text-gray-400">Đánh giá sẽ hiển thị sau khi được kiểm duyệt</p>
        </form>
      )}

      {submitted && (
        <div className="mb-6 rounded-2xl bg-emerald-50 px-5 py-4 text-[13px] font-semibold text-emerald-700">
          ✓ Cảm ơn bạn! Đánh giá đang chờ kiểm duyệt và sẽ hiển thị sớm.
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse rounded-2xl bg-gray-100 h-24" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center">
          <p className="text-2xl">💬</p>
          <p className="mt-2 text-[13px] text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <div key={r.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[13px] font-black text-emerald-700">
                    {r.guest_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900">{r.guest_name}</p>
                    <StarRating value={r.rating} />
                  </div>
                </div>
                <p className="shrink-0 text-[11px] text-gray-400">{fmtDate(r.created_at)}</p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-gray-700">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
