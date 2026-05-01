"use client";

import { useState, useEffect, useCallback } from "react";

interface Review {
  id:          string;
  guest_name:  string;
  guest_email: string | null;
  rating:      number;
  comment:     string;
  is_approved: boolean;
  created_at:  string;
  activities:  { name: string } | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <svg key={n} width="13" height="13" viewBox="0 0 24 24"
          fill={n <= rating ? "#f59e0b" : "none"}
          stroke={n <= rating ? "#f59e0b" : "#d1d5db"}
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<"pending" | "approved" | "all">("pending");

  const load = useCallback(async () => {
    setLoading(true);
    const res  = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function approve(id: string, val: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_approved: val }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: val } : r));
  }

  async function remove(id: string) {
    if (!confirm("Xoá đánh giá này?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setReviews(prev => prev.filter(r => r.id !== id));
  }

  const pendingCount  = reviews.filter(r => !r.is_approved).length;
  const approvedCount = reviews.filter(r => r.is_approved).length;
  const avgRating     = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  const filtered = reviews.filter(r =>
    filter === "all"      ? true :
    filter === "pending"  ? !r.is_approved :
    r.is_approved
  );

  return (
    <div className="space-y-5 max-w-[900px]">

      {/* Header + stats */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-black text-gray-900">Đánh giá</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Duyệt và quản lý phản hồi từ khách</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-black/[0.06] text-center">
            <p className="text-[18px] font-black text-amber-500">{avgRating}</p>
            <p className="text-[10px] text-gray-400 font-medium">TB đánh giá</p>
          </div>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-200/60">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
              <span className="text-[12px] font-bold text-amber-700">{pendingCount} chờ duyệt</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {([
          { key: "pending",  label: `Chờ duyệt (${pendingCount})` },
          { key: "approved", label: `Đã duyệt (${approvedCount})` },
          { key: "all",      label: "Tất cả" },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`rounded-lg px-4 py-1.5 text-[12px] font-semibold transition ${
              filter === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-xl">💬</div>
          <p className="text-[13px] font-semibold text-gray-500">Không có đánh giá nào</p>
          <p className="text-[11px] text-gray-400">
            {filter === "pending" ? "Tất cả đánh giá đã được duyệt" : "Chưa có đánh giá nào"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id}
              className={`rounded-2xl bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ${
                r.is_approved ? "ring-black/[0.04]" : "ring-amber-200/60"
              }`}>
              <div className="flex items-start gap-4">

                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                                bg-gradient-to-br from-emerald-400 to-teal-500 text-[12px] font-black text-white">
                  {r.guest_name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <p className="text-[14px] font-bold text-gray-900">{r.guest_name}</p>
                    {r.guest_email && (
                      <p className="text-[11px] text-gray-400">{r.guest_email}</p>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      r.is_approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {r.is_approved ? "Đã duyệt" : "Chờ duyệt"}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 mb-2.5">
                    <Stars rating={r.rating} />
                    {r.activities?.name && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                        {r.activities.name}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400">
                      {new Date(r.created_at).toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-[13px] text-gray-700 leading-relaxed">{r.comment}</p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col gap-1.5">
                  {!r.is_approved ? (
                    <button onClick={() => approve(r.id, true)}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-[12px] font-bold text-white
                                 shadow-sm shadow-emerald-200 transition hover:bg-emerald-700">
                      ✓ Duyệt
                    </button>
                  ) : (
                    <button onClick={() => approve(r.id, false)}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-[12px] font-semibold
                                 text-gray-600 transition hover:bg-gray-50">
                      Ẩn
                    </button>
                  )}
                  <button onClick={() => remove(r.id)}
                    className="rounded-xl border border-red-200 px-4 py-2 text-[12px] font-semibold
                               text-red-500 transition hover:bg-red-50">
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
