import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSessionFromRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids, status, refund, proofUrl, note } = await req.json().catch(() => ({}));
  if (!Array.isArray(ids) || !ids.length || !status) {
    return NextResponse.json({ error: "Missing ids or status" }, { status: 400 });
  }

  // MANAGER chỉ hủy được đơn PENDING; không hủy thường đơn PAID/CHECKED_IN (nhưng được hoàn tiền → REFUNDED)
  if (status === "CANCELLED" && !refund && session.role !== "SUPER_ADMIN") {
    const { data: current } = await supabaseAdmin
      .from("bookings")
      .select("status")
      .in("id", ids);
    const hasPaid = current?.some(b => b.status === "PAID" || b.status === "CHECKED_IN");
    if (hasPaid) {
      return NextResponse.json({ error: "Không có quyền hủy đơn đã thanh toán" }, { status: 403 });
    }
  }

  // Khi hoàn tiền, dùng status REFUNDED thay vì CANCELLED
  const finalStatus = refund ? "REFUNDED" : status;

  const { data: updated, error } = await supabaseAdmin
    .from("bookings")
    .update({ status: finalStatus })
    .in("id", ids)
    .select("id, guest_name, guest_email, guest_phone, guest_count, booking_date, slot_time, total_price, qr_code_token, booking_ref, activities(name)");

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  /* Lưu thông tin hoàn tiền */
  if (refund && proofUrl && updated?.length) {
    const bookingRef = updated[0].booking_ref as string | null;
    if (bookingRef) {
      await supabaseAdmin.from("booking_refunds").insert({
        booking_ref: bookingRef,
        proof_url:   proofUrl,
        note:        note ?? null,
        created_by:  session.staffId,
      });
    }
  }

  /* Gửi email khi xác nhận PAID */
  if (status === "PAID" && updated?.length) {
    const first = updated[0];
    if (first.guest_email) {
      const total = updated.reduce((s, b) => s + Number(b.total_price), 0);
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api/notifications`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName:  first.guest_name,
          guestEmail: first.guest_email,
          guestPhone: first.guest_phone,
          guests:     first.guest_count,
          bookingRef: first.booking_ref ?? "",
          bookings:   updated.map(b => ({
            activity: (b.activities as { name: string } | null)?.name ?? "—",
            date:     b.booking_date,
            time:     b.slot_time?.slice(0, 5) ?? "—",
            price:    Number(b.total_price),
            token:    b.qr_code_token ?? "",
          })),
          dishes: [],
          total,
        }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ success: true, count: updated?.length ?? 0 });
}
