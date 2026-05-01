"use client";

import Link from "next/link";

interface BookingButtonProps {
  activityId: string;
  label?: string;
  disabled?: boolean;
  disabledReason?: string;
}

export default function BookingButton({
  activityId,
  label = "Đặt vé ngay",
  disabled = false,
  disabledReason,
}: BookingButtonProps) {
  if (disabled) {
    return (
      <div className="flex flex-col items-start gap-1">
        <button
          disabled
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-gray-300 px-6 py-3 text-sm font-semibold text-gray-500 shadow-sm"
          aria-disabled="true"
        >
          <span>🎫</span>
          {label}
        </button>
        {disabledReason && (
          <p className="text-xs text-red-500">{disabledReason}</p>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/booking?activityId=${activityId}`}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 active:scale-95"
    >
      <span>🎫</span>
      {label}
    </Link>
  );
}
