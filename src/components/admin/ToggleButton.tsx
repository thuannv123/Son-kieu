"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@/components/ui/Dialog";

interface ToggleButtonProps {
  activityId: string;
  isActive:   boolean;
}

export default function ToggleButton({ activityId, isActive }: ToggleButtonProps) {
  const [active, setActive]  = useState(isActive);
  const [pending, startTransition] = useTransition();
  const [alertMsg, setAlertMsg] = useState("");
  const router = useRouter();

  async function toggle() {
    const next = !active;
    startTransition(async () => {
      const res = await fetch(`/api/admin/activities/${activityId}/toggle`, {
        method:  "PUT",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${document.cookie.match(/admin_session=([^;]+)/)?.[1] ?? ""}`,
        },
        body: JSON.stringify({ isActive: next }),
      });
      if (res.ok) {
        setActive(next);
        router.refresh();
      } else {
        setAlertMsg("Cập nhật thất bại");
      }
    });
  }

  return (
    <>
    <Dialog open={!!alertMsg} type="alert" title="Thông báo" message={alertMsg}
      onConfirm={() => setAlertMsg("")} onClose={() => setAlertMsg("")} />
    <button
      onClick={toggle}
      disabled={pending}
      className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
        active ? "bg-emerald-500" : "bg-gray-300"
      }`}
      aria-label={active ? "Đang mở" : "Đang đóng"}
      title={active ? "Nhấn để đóng" : "Nhấn để mở"}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          active ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
    </>
  );
}
