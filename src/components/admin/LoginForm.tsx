"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [show,     setShow]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/auth", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: email || undefined, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(searchParams.get("from") ?? "/admin/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Thông tin đăng nhập không đúng");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500">
            Email
          </label>
          <span className="text-[10px] text-gray-400">Tùy chọn · bỏ trống nếu dùng mật khẩu quản trị</span>
        </div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nhanvien@sonkieu.vn"
          autoFocus
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[14px] transition
                     focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-[12px] font-semibold uppercase tracking-wider text-gray-500">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu..."
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-[14px] transition
                       focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          <button type="button" onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
            {show
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl bg-red-50 px-4 py-3 ring-1 ring-red-200/60">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-[13px] font-medium text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full rounded-xl bg-emerald-600 py-3 text-[14px] font-bold text-white
                   shadow-sm shadow-emerald-200 transition hover:bg-emerald-700
                   disabled:opacity-50 disabled:shadow-none">
        {loading
          ? <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Đang xử lý...
            </span>
          : "Đăng nhập →"
        }
      </button>
    </form>
  );
}
