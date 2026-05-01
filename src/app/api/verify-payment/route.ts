import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/*
  Query SePay transaction API để tìm giao dịch matching booking ref.
  Dùng khi webhook thất bại (ngrok offline, timeout, v.v.)

  SePay userapi: GET https://my.sepay.vn/userapi/transactions/list
  Auth: Authorization: Bearer {SEPAY_API_TOKEN}
*/

export async function POST(req: NextRequest) {
  let body: { ref?: string };
  try { body = await req.json(); } catch { body = {}; }

  const ref = body.ref?.trim().toUpperCase();
  if (!ref || !ref.startsWith("AMF-")) {
    return NextResponse.json({ error: "Invalid ref" }, { status: 400 });
  }

  /* ── 1. Kiểm tra DB trước (có thể nhiều row cùng booking_ref) ─── */
  const { data: bookingRows } = await supabaseAdmin
    .from("bookings")
    .select("id, status")
    .eq("booking_ref", ref);

  if (!bookingRows?.length) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (bookingRows.some(b => b.status === "PAID" || b.status === "CHECKED_IN")) {
    return NextResponse.json({ found: true, alreadyPaid: true });
  }

  /* ── 2. Query SePay API ────────────────────────────────────────── */
  const apiToken = process.env.SEPAY_API_TOKEN;
  if (!apiToken) {
    return NextResponse.json({ error: "SEPAY_API_TOKEN not configured" }, { status: 503 });
  }

  let transactions: SepayTransaction[] = [];
  try {
    const res = await fetch(
      "https://my.sepay.vn/userapi/transactions/list?limit_transaction=50",
      {
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type":  "application/json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      const msg = res.status === 401
        ? "Token SePay chưa được cấu hình — admin vui lòng xác nhận thủ công tại /admin/bookings"
        : `SePay API lỗi: ${res.status}`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }
    const data = await res.json();
    transactions = data.transactions ?? [];
  } catch (e) {
    return NextResponse.json({ error: "SePay API unreachable" }, { status: 502 });
  }

  /* ── 3. Tìm giao dịch có chứa mã booking ref ─────────────────── */
  // Mã trong nội dung CK có thể là "AMF-AE11ED93" hoặc "AMFAE11ED93"
  const refCode    = ref.replace("AMF-", "AMF");   // "AMFAE11ED93"
  const refDashed  = ref;                            // "AMF-AE11ED93"
  const refPart    = ref.replace("AMF-", "");        // "AE11ED93"

  const matched = transactions.find(t => {
    if (t.transferType !== "in") return false;
    const content = (t.content ?? t.code ?? t.description ?? "").toUpperCase();
    return (
      content.includes(refCode)   ||
      content.includes(refDashed) ||
      content.includes(refPart)
    );
  });

  if (!matched) {
    return NextResponse.json({ found: false });
  }

  /* ── 4. Cập nhật toàn bộ group → PAID ─────────────────────────── */
  await supabaseAdmin
    .from("bookings")
    .update({ status: "PAID" })
    .in("id", bookingRows.map(b => b.id));

  /* ── 5. Gửi email xác nhận ─────────────────────────────────────── */
  const { data: fullBooking } = await supabaseAdmin
    .from("bookings")
    .select("id, total_price, guest_name, guest_email, guest_phone, guest_count, booking_date, slot_time, qr_code_token, booking_ref, activities(name)")
    .eq("booking_ref", ref)
    .limit(1)
    .maybeSingle();

  if (fullBooking?.guest_email) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api/notifications`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName:  fullBooking.guest_name,
        guestEmail: fullBooking.guest_email,
        guestPhone: fullBooking.guest_phone,
        guests:     fullBooking.guest_count,
        bookingRef: fullBooking.booking_ref,
        bookings: [{
          activity: (fullBooking.activities as { name: string } | null)?.name ?? "—",
          date:     fullBooking.booking_date,
          time:     fullBooking.slot_time?.slice(0, 5) ?? "—",
          price:    Number(fullBooking.total_price),
          token:    fullBooking.qr_code_token ?? "",
        }],
        dishes: [],
        total: Number(matched.transferAmount),
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ found: true, confirmed: true, amount: matched.transferAmount });
}

interface SepayTransaction {
  id:             string | number;
  gateway:        string;
  transactionDate:string;
  accountNumber:  string;
  code:           string | null;
  content:        string;
  transferType:   string;
  transferAmount: number;
  referenceCode:  string;
  description:    string;
}
