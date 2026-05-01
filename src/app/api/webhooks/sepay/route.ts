import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/*
  SePay Webhook — docs: https://docs.sepay.vn/tich-hop-webhooks.html

  SePay payload:
  {
    id:              number,       ← transaction ID (dùng để chống duplicate)
    gateway:         "MB",
    transactionDate: "2026-04-26 09:00:00",
    accountNumber:   "69906022001",
    code:            "AMF-A1B2C3D4",   ← payment code SePay trích ra
    content:         "AMF-A1B2C3D4",   ← nội dung gốc chuyển khoản
    transferType:    "in",
    transferAmount:  250000,
    accumulated:     ...,
    referenceCode:   "...",
    description:     "...",
  }

  SePay expects response: { "success": true }
*/

const seen = new Set<string>(); // in-memory dedup (đủ cho low-traffic resort)

export async function POST(req: NextRequest) {
  /* ── Xác thực: SePay gửi "Authorization: Apikey {secret}" ──────── */
  const authHeader = req.headers.get("Authorization") ?? "";
  const apiKey     = authHeader.startsWith("Apikey ") ? authHeader.slice(7) : authHeader;
  const secret     = process.env.SEPAY_WEBHOOK_TOKEN;

  if (secret && apiKey !== secret) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  /* ── Chỉ xử lý tiền vào ─────────────────────────────────────────── */
  if (payload.transferType !== "in") {
    return NextResponse.json({ success: true, message: "skipped: not incoming" });
  }

  /* ── Chống duplicate bằng transaction id + referenceCode ────────── */
  const dedupKey = `${payload.id}-${payload.referenceCode}`;
  if (seen.has(dedupKey)) {
    return NextResponse.json({ success: true, message: "duplicate skipped" });
  }
  seen.add(dedupKey);

  /* ── Trích mã AMF-XXXXXXXX từ content hoặc code ────────────────── */
  const rawContent = String(payload.content ?? payload.code ?? payload.description ?? "");
  const match      = rawContent.match(/AMF-?([A-Z0-9]{8})/i);

  if (!match) {
    return NextResponse.json({ success: true, message: "no booking ref in content", debug: { rawContent } });
  }
  const bookingRef = `AMF-${match[1].toUpperCase()}`;

  /* ── Debug: kiểm tra tổng số row và cột booking_ref ─────────────── */
  const { count: totalRows } = await supabaseAdmin
    .from("bookings").select("*", { count: "exact", head: true });

  const { data: allBookings, error: dbError } = await supabaseAdmin
    .from("bookings")
    .select("id, status, booking_ref")
    .eq("booking_ref", bookingRef);

  if (dbError) {
    return NextResponse.json({
      success: true,
      message: `db_error: ${dbError.message}`,
      debug: { bookingRef, totalRows, error_code: dbError.code, hint: "booking_ref column may not exist — run migration 012" },
    });
  }

  if (!allBookings || allBookings.length === 0) {
    const { data: latestRows } = await supabaseAdmin
      .from("bookings").select("id, status, booking_ref, created_at").order("created_at", { ascending: false }).limit(3);
    return NextResponse.json({
      success: true,
      message: `no booking found for ${bookingRef} (total rows: ${totalRows})`,
      debug: { bookingRef, totalRows, latest_rows: latestRows },
    });
  }

  const pendingBookings = allBookings.filter(b => b.status === "PENDING");
  if (pendingBookings.length === 0) {
    return NextResponse.json({
      success: true,
      message: `found ${allBookings.length} booking(s) but none PENDING`,
      debug: { bookingRef, statuses: allBookings.map(b => b.status) },
    });
  }

  /* ── Lấy đầy đủ thông tin booking PENDING ───────────────────────── */
  const { data: bookings } = await supabaseAdmin
    .from("bookings")
    .select("id, total_price, guest_name, guest_email, guest_phone, guest_count, booking_date, slot_time, qr_code_token, booking_ref, activities(name)")
    .eq("booking_ref", bookingRef)
    .eq("status", "PENDING");

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ success: true, message: `no PENDING booking for ${bookingRef}` });
  }

  /* ── Cập nhật PENDING → PAID ────────────────────────────────────── */
  await supabaseAdmin
    .from("bookings")
    .update({ status: "PAID" })
    .in("id", bookings.map(b => b.id));

  /* ── Gửi email xác nhận sau khi PAID ───────────────────────────── */
  const first = bookings[0];
  if (first.guest_email) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api/notifications`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName:  first.guest_name,
        guestEmail: first.guest_email,
        guestPhone: first.guest_phone,
        guests:     first.guest_count,
        bookingRef: first.booking_ref,
        bookings:   bookings.map(b => ({
          activity: (b.activities as unknown as { name: string } | null)?.name ?? "—",
          date:     b.booking_date,
          time:     b.slot_time?.slice(0, 5) ?? "—",
          price:    Number(b.total_price),
          token:    b.qr_code_token ?? "",
        })),
        dishes: [],
        total:  Number(payload.transferAmount),
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, message: `confirmed ${bookings.length} booking(s) for ${bookingRef}` });
}

/* SePay kiểm tra endpoint bằng GET ─────────────────────────────────── */
export async function GET() {
  return NextResponse.json({ success: true, service: "Sơn Kiều SePay Webhook" });
}
