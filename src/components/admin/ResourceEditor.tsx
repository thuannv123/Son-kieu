"use client";

import { useState, useTransition } from "react";
import { useRouter }               from "next/navigation";
import Dialog from "@/components/ui/Dialog";

interface Activity {
  id: string; name: string; price: number;
  max_capacity: number; max_per_slot: number; is_active: boolean;
}

function getToken() {
  return document.cookie.match(/admin_session=([^;]+)/)?.[1] ?? "";
}

export default function ResourceEditor({ activity }: { activity: Activity }) {
  const [open, setOpen]   = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [price, setPrice] = useState(activity.price);
  const [cap,   setCap]   = useState(activity.max_capacity);
  const [slot,  setSlot]  = useState(activity.max_per_slot);
  const [pending, start]  = useTransition();
  const router            = useRouter();

  async function save() {
    start(async () => {
      const res = await fetch(`/api/admin/activities/${activity.id}/toggle`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
        body:    JSON.stringify({ isActive: activity.is_active }),
      });

      // Also save price + capacity directly
      const res2 = await fetch(`/api/admin/resources/${activity.id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
        body:    JSON.stringify({ price, max_capacity: cap, max_per_slot: slot }),
      });

      if (res.ok || res2.ok) { setOpen(false); router.refresh(); }
      else setAlertMsg("Lưu thất bại");
    });
  }

  return (
    <>
      <Dialog open={!!alertMsg} type="alert" title="Thông báo" message={alertMsg}
        onConfirm={() => setAlertMsg("")} onClose={() => setAlertMsg("")} />
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
      >
        ✏️ Chỉnh sửa
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-base font-bold text-gray-900">{activity.name}</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Giá vé (VND)</label>
                <input type="number" value={price} onChange={e=>setPrice(+e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Sức chứa tối đa</label>
                <input type="number" min={1} value={cap} onChange={e=>setCap(+e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Tối đa / slot giờ</label>
                <input type="number" min={1} value={slot} onChange={e=>setSlot(+e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium hover:bg-gray-50">
                Hủy
              </button>
              <button onClick={save} disabled={pending}
                className="flex-[2] rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {pending ? "Đang lưu..." : "💾 Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
