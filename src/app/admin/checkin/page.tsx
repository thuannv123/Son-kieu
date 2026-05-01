"use client";

import { useState } from "react";

interface CheckInResult {
  success?:    boolean;
  error?:      string;
  guestName?:  string;
  guestCount?: number;
  slotTime?:   string;
}

export default function CheckInPage() {
  const [token,   setToken]   = useState("");
  const [result,  setResult]  = useState<CheckInResult | null>(null);
  const [loading, setLoading] = useState(false);

  function getAdminToken() {
    return document.cookie.match(/admin_session=([^;]+)/)?.[1] ?? "";
  }

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setResult(null);
    const res  = await fetch("/api/admin/check-in", {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getAdminToken()}` },
      body:    JSON.stringify({ token: token.trim() }),
    });
    const data: CheckInResult = await res.json();
    setResult(data);
    setLoading(false);
    if (data.success) setToken("");
  }

  function reset() { setResult(null); setToken(""); }

  return (
    <div className="mx-auto max-w-lg space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-[20px] font-black text-gray-900">Check-in QR</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Nhập mã vé hoặc quét QR để xác nhận khách vào cổng</p>
      </div>

      {/* Input card */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <form onSubmit={handleCheckIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Mã vé / Token QR
            </label>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="AMF-XXXXXXXX hoặc UUID đầy đủ..."
                autoFocus
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4
                           font-mono text-[13px] uppercase tracking-wider text-gray-900
                           placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400
                           focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-[14px] font-bold text-white
                       shadow-sm shadow-emerald-200 transition hover:bg-emerald-700
                       disabled:opacity-50 disabled:shadow-none">
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  Đang kiểm tra...
                </span>
              : "✅ Xác nhận Check-in"
            }
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className={`overflow-hidden rounded-2xl ring-1 ${
          result.success
            ? "bg-emerald-50 ring-emerald-200/60"
            : "bg-red-50 ring-red-200/60"
        }`}>
          {result.success ? (
            <div>
              <div className="bg-emerald-600 px-5 py-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-lg">
                  ✅
                </div>
                <p className="text-[16px] font-black text-white">Check-in thành công!</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-emerald-200/60 px-1 py-4">
                {[
                  { label: "Khách", value: result.guestName ?? "—" },
                  { label: "Số lượng", value: `${result.guestCount} người` },
                  { label: "Giờ slot", value: result.slotTime?.slice(0, 5) ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="px-4 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">{label}</p>
                    <p className="mt-0.5 text-[13px] font-bold text-emerald-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-4">
                <button onClick={reset}
                  className="w-full rounded-xl border border-emerald-200 py-2.5 text-[13px] font-semibold text-emerald-700 transition hover:bg-emerald-100">
                  ← Check-in khách tiếp theo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg">
                ⚠️
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-red-700">{result.error}</p>
                <button onClick={reset}
                  className="mt-1 text-[11px] font-semibold text-red-500 underline underline-offset-2">
                  Thử lại
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help */}
      <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_8px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Hướng dẫn</p>
        <div className="space-y-2.5">
          {[
            { step: "1", text: "Quét mã QR trên vé của khách bằng camera" },
            { step: "2", text: "Hoặc nhập mã AMF-XXXXXXXX / token UUID" },
            { step: "3", text: "Nhấn Xác nhận để đổi trạng thái sang Đã check-in" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-black text-emerald-700">
                {step}
              </span>
              <p className="text-[12px] text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
