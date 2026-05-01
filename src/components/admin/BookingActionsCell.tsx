"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@/components/ui/Dialog";

async function confirmGroup(
  ids: string[],
  status: string,
  refund = false,
  refundData?: { proofUrl: string; note: string },
) {
  return fetch("/api/admin/bookings/confirm-group", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ ids, status, refund, ...refundData }),
  });
}

/* ── Refund modal ── */
function RefundModal({
  onConfirm,
  onClose,
  loading,
}: {
  onConfirm: (file: File, note: string) => void;
  onClose:   () => void;
  loading:   boolean;
}) {
  const [file,    setFile]    = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [note,    setNote]    = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File | null) {
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/[0.08]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-lg">💸</div>
            <div>
              <p className="text-[14px] font-black text-gray-900">Xác nhận hoàn tiền</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Yêu cầu bằng chứng chuyển khoản</p>
            </div>
          </div>
          <button onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="rounded-xl bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-800 ring-1 ring-amber-200">
            Để xử lý hoàn tiền, vui lòng đính kèm <strong>ảnh chụp màn hình biên lai chuyển khoản thành công</strong> của khách hàng (thể hiện rõ số tiền, ngân hàng, thời gian giao dịch).
          </div>

          {/* Upload area */}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Ảnh xác nhận chuyển khoản <span className="text-red-500">*</span>
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0] ?? null)}
            />
            {preview ? (
              <div className="relative overflow-hidden rounded-xl ring-1 ring-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="max-h-52 w-full object-contain bg-gray-50" />
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <div className="px-3 py-2 bg-white border-t border-gray-100">
                  <p className="text-[11px] text-gray-500 truncate">{file?.name}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span className="text-[12px] font-medium text-gray-500">Nhấn để chọn ảnh</span>
                <span className="text-[11px] text-gray-400">JPG, PNG, WEBP · tối đa 5MB</span>
              </button>
            )}
          </div>

          {/* Note */}
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Lý do hoàn tiền <span className="text-gray-300">(tùy chọn)</span>
            </p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              placeholder="VD: Khách hủy vì lý do cá nhân..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[12px] text-gray-700 placeholder:text-gray-300 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50">
              Hủy bỏ
            </button>
            <button
              onClick={() => file && onConfirm(file, note)}
              disabled={!file || loading}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-[13px] font-bold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-40">
              {loading ? "Đang xử lý..." : "Xác nhận hoàn tiền"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function BookingActionsCell({ ids, status, role }: { ids: string[]; status: string; role?: string }) {
  const isSuperAdmin = role === "SUPER_ADMIN";
  const [open,    setOpen]    = useState(false);
  const [pending, start]      = useTransition();
  const [pos,     setPos]     = useState({ top: 0, right: 0 });
  const btnRef                = useRef<HTMLButtonElement>(null);
  const router                = useRouter();

  const [dialog,   setDialog]   = useState<{ message: string; title?: string; danger?: boolean; onConfirm: () => void } | null>(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [refundOpen, setRefundOpen] = useState(false);
  const [uploading,  setUploading]  = useState(false);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 4, right: window.innerWidth - rect.right });
    }
  }, [open]);

  async function act(action: string) {
    let res: Response;
    if      (action === "paid")    res = await confirmGroup(ids, "PAID");
    else if (action === "cancel")  res = await confirmGroup(ids, "CANCELLED");
    else if (action === "checkin") res = await confirmGroup(ids, "CHECKED_IN");
    else if (action === "delete") {
      const results = await Promise.all(
        ids.map(id => fetch(`/api/admin/bookings/${id}`, { method: "DELETE" }))
      );
      const failed = results.find(r => !r.ok);
      if (failed) {
        const err = await failed.json().catch(() => ({}));
        setAlertMsg((err as { error?: string })?.error ?? "Xóa thất bại");
        return;
      }
      setOpen(false);
      router.refresh();
      return;
    } else return;

    if (!res!.ok) {
      const err = await res!.json().catch(() => ({}));
      setAlertMsg((err as { error?: string })?.error ?? "Thao tác thất bại");
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  async function handleRefund(file: File, note: string) {
    setUploading(true);
    try {
      // Upload ảnh bằng chứng
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "refund-proofs");
      const uploadRes  = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json().catch(() => ({}));
      const proofUrl   = (uploadData as { url?: string }).url ?? "";

      // Hủy đơn (hoàn tiền) — refund=true cho phép MANAGER thực hiện
      const res = await confirmGroup(ids, "CANCELLED", true, { proofUrl, note });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setAlertMsg((err as { error?: string })?.error ?? "Thao tác thất bại");
      } else {
        setRefundOpen(false);
        router.refresh();
      }
    } catch {
      setAlertMsg("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setUploading(false);
    }
  }

  if (status === "CANCELLED") {
    if (!isSuperAdmin) return <span className="text-xs text-gray-400 italic">—</span>;
    return (
      <>
        <button
          onClick={() => setDialog({ message: "Xóa vĩnh viễn đơn này?", title: "Xóa đơn", danger: true, onConfirm: () => start(() => { act("delete"); }) })}
          disabled={pending}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          🗑 Xóa
        </button>
        <Dialog open={!!dialog} title={dialog?.title} message={dialog?.message ?? ""} danger={dialog?.danger}
          onConfirm={() => dialog?.onConfirm()} onClose={() => setDialog(null)} />
        <Dialog open={!!alertMsg} type="alert" message={alertMsg} title="Thông báo"
          onConfirm={() => setAlertMsg("")} onClose={() => setAlertMsg("")} />
      </>
    );
  }

  if (status === "CHECKED_IN" || status === "REFUNDED") {
    return <span className="text-xs text-gray-400 italic">—</span>;
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        disabled={pending}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:opacity-50"
      >
        Thao tác ▾
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 w-52 rounded-xl border bg-white shadow-xl py-1"
            style={{ top: pos.top, right: pos.right }}
          >
            {status === "PENDING" && (
              <button
                onClick={() => start(() => { act("paid"); })}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-green-700 font-medium"
              >
                ✅ Xác nhận thanh toán
              </button>
            )}
            {status === "PAID" && (
              <button
                onClick={() => start(() => { act("checkin"); })}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-blue-700 font-medium"
              >
                📱 Check-in ngay
              </button>
            )}

            <div className="my-1 border-t border-gray-100" />

            {/* Hủy vé — không hoàn tiền; MANAGER chỉ được hủy đơn PENDING */}
            {(isSuperAdmin || status === "PENDING") && (
              <button
                onClick={() => { setOpen(false); setDialog({ message: "Hủy vé này? Khách sẽ không được hoàn tiền.", title: "Hủy vé", danger: true, onConfirm: () => start(() => { act("cancel"); }) }); }}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 text-red-600 font-medium"
              >
                ✕ Hủy vé
              </button>
            )}

            {/* Hoàn vé — yêu cầu ảnh xác nhận */}
            {status === "PAID" && (
              <button
                onClick={() => { setOpen(false); setRefundOpen(true); }}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 text-orange-600 font-medium"
              >
                💸 Hoàn tiền
              </button>
            )}
          </div>
        </>
      )}

      {/* Refund modal */}
      {refundOpen && (
        <RefundModal
          loading={uploading}
          onConfirm={(file, note) => handleRefund(file, note)}
          onClose={() => setRefundOpen(false)}
        />
      )}

      <Dialog open={!!dialog} title={dialog?.title} message={dialog?.message ?? ""} danger={dialog?.danger}
        onConfirm={() => dialog?.onConfirm()} onClose={() => setDialog(null)} />
      <Dialog open={!!alertMsg} type="alert" message={alertMsg} title="Thông báo"
        onConfirm={() => setAlertMsg("")} onClose={() => setAlertMsg("")} />
    </>
  );
}
