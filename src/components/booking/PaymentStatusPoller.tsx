"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  bookingRef: string;
}

export default function PaymentStatusPoller({ bookingRef }: Props) {
  const [status,    setStatus]    = useState<"pending" | "paid">("pending");
  const [checking,  setChecking]  = useState(false);
  const [slowMode,  setSlowMode]  = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyErr, setVerifyErr] = useState("");

  /* Poll DB status (lightweight) */
  const checkDB = useCallback(async (): Promise<boolean> => {
    if (!bookingRef) { setStatus("paid"); return true; }
    try {
      const res  = await fetch(
        `/api/booking-status?ref=${encodeURIComponent(bookingRef)}&t=${Date.now()}`,
        { cache: "no-store" }
      );
      if (!res.ok) return false;
      const data = await res.json();
      if (data.status === "PAID" || data.status === "CHECKED_IN") {
        setStatus("paid");
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }, [bookingRef]);

  /* Verify qua SePay API — dùng khi webhook thất bại */
  const verifySePay = useCallback(async () => {
    if (!bookingRef || verifying) return;
    setVerifying(true);
    setChecking(true);
    setVerifyErr("");
    try {
      const dbPaid = await checkDB();
      if (dbPaid) return;

      const res  = await fetch("/api/verify-payment", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ref: bookingRef }),
        cache:   "no-store",
      });
      const data = await res.json();
      if (data.found && (data.confirmed || data.alreadyPaid)) {
        setStatus("paid");
      } else if (!res.ok) {
        setVerifyErr(data.error ?? "Không tìm thấy giao dịch");
      } else {
        setVerifyErr("Chưa thấy giao dịch trong hệ thống. Vui lòng đợi hoặc liên hệ hỗ trợ.");
      }
    } catch {
      setVerifyErr("Lỗi kết nối");
    } finally {
      setChecking(false);
      setVerifying(false);
    }
  }, [bookingRef, verifying, checkDB]);

  /* Auto-poll DB: 5s × 36 lần (3 phút), sau đó 30s mãi mãi */
  useEffect(() => {
    if (!bookingRef) { setStatus("paid"); return; }

    let stopped = false;
    let tries   = 0;
    const FAST_MAX = 36;

    async function poll() {
      if (stopped) return;
      setChecking(true);
      const done = await checkDB();
      if (!stopped) setChecking(false);
      if (done) return;

      tries++;
      if (tries < FAST_MAX) {
        setTimeout(poll, 5_000);
      } else {
        setSlowMode(true);
        setTimeout(poll, 30_000);
      }
    }

    const timer = setTimeout(poll, 3_000);
    return () => { stopped = true; clearTimeout(timer); };
  }, [bookingRef, checkDB]);

  if (status === "paid") {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <p className="text-[14px] font-bold text-emerald-800">Thanh toán đã xác nhận!</p>
          <p className="text-[12px] text-emerald-600">Vé của bạn đã được kích hoạt. Xuất trình QR tại cổng vào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <svg className={`${checking ? "animate-spin" : ""} text-amber-500`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-amber-800">Chờ xác nhận thanh toán</p>
          <p className="text-[12px] text-amber-600">
            Nội dung CK: <span className="font-mono font-bold">{bookingRef}</span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <p className="font-mono text-[11px] font-bold text-amber-700 bg-amber-100 rounded-lg px-2 py-1">{bookingRef}</p>
          <button
            onClick={verifySePay}
            disabled={checking}
            className="text-[11px] font-semibold text-amber-600 underline underline-offset-2 hover:text-amber-800 disabled:opacity-50"
          >
            {checking ? "Đang kiểm tra…" : "Kiểm tra lại"}
          </button>
        </div>
      </div>

      {verifyErr && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-600">
          {verifyErr}
        </div>
      )}

      {slowMode && !verifyErr && (
        <div className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-[12px] text-gray-500">
          Đã chuyển khoản nhưng chờ lâu?{" "}
          <span className="font-semibold text-gray-700">
            Lưu mã <span className="font-mono text-amber-700">{bookingRef}</span> và liên hệ{" "}
            <a href="tel:+84857086588" className="font-bold text-emerald-700 underline">
              0857 086 588
            </a>{" "}
            để được hỗ trợ.
          </span>
        </div>
      )}
    </div>
  );
}
