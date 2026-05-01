"use client";

import { useEffect } from "react";

interface DialogProps {
  open:          boolean;
  title?:        string;
  message:       string;
  type?:         "alert" | "confirm";
  danger?:       boolean;
  confirmLabel?: string;
  cancelLabel?:  string;
  onConfirm:     () => void;
  onClose:       () => void;
}

export default function Dialog({
  open, title, message, type = "confirm", danger = false,
  confirmLabel, cancelLabel = "Hủy",
  onConfirm, onClose,
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter")  onConfirm();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onConfirm]);

  if (!open) return null;

  const isAlert      = type === "alert";
  const defaultLabel = isAlert ? "Đã hiểu" : (danger ? "Xóa" : "Xác nhận");
  const label        = confirmLabel ?? defaultLabel;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/[0.06]"
        onClick={e => e.stopPropagation()}>

        {/* Icon + title */}
        <div className="px-6 pt-6 pb-4">
          <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${
            isAlert
              ? "bg-blue-50"
              : danger ? "bg-red-50" : "bg-emerald-50"
          }`}>
            {isAlert ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={danger ? "#ef4444" : "#3b82f6"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            ) : danger ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            )}
          </div>

          {title && (
            <p className="mb-1.5 text-[15px] font-bold text-gray-900">{title}</p>
          )}
          <p className="text-[13px] leading-relaxed text-gray-500 whitespace-pre-line">{message}</p>
        </div>

        {/* Actions */}
        <div className={`flex gap-2 border-t border-gray-100 px-6 py-4 ${isAlert ? "justify-end" : "justify-end"}`}>
          {!isAlert && (
            <button onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-2 text-[13px] font-semibold
                         text-gray-700 transition hover:bg-gray-50">
              {cancelLabel}
            </button>
          )}
          <button onClick={() => { onConfirm(); onClose(); }}
            className={`rounded-xl px-5 py-2 text-[13px] font-semibold text-white transition ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}>
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
