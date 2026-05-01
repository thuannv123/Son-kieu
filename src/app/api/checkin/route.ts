import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const select = "id, status, guest_name, guest_email, guest_phone, guest_count, booking_date, slot_time, total_price, dish_total, booking_ref, qr_code_token, activities(name, category)";

/* GET /api/checkin?token=xxx */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("token")?.trim();
  if (!raw) return NextResponse.json({ error: "Thiếu mã vé" }, { status: 400 });

  /* AMF- booking_ref → có thể nhiều booking cùng ref */
  if (/^AMF-/i.test(raw)) {
    const ref = raw.toUpperCase();
    const [{ data: rows }, { data: dishRows }] = await Promise.all([
      supabaseAdmin.from("bookings").select(select).eq("booking_ref", ref),
      supabaseAdmin.from("booking_dishes").select("dish_name, qty, unit_price").eq("booking_ref", ref),
    ]);

    if (!rows?.length) return NextResponse.json({ error: "Không tìm thấy vé" }, { status: 404 });

    const first = rows[0];
    return NextResponse.json({
      booking: {
        ...first,
        total_price: rows.reduce((s, b) => s + Number(b.total_price), 0),
        activities_all: rows
          .map(b => {
            const act = b.activities as unknown as { name: string; category: string } | null;
            if (!act) return null;
            return { ...act, price: Number(b.total_price) - Number(b.dish_total ?? 0) };
          })
          .filter(Boolean),
        group_ids: rows.map(b => b.id),
        dishes: dishRows ?? [],
      },
    });
  }

  /* Full UUID */
  if (raw.length === 36 && raw.includes("-")) {
    const { data } = await supabaseAdmin
      .from("bookings").select(select).eq("qr_code_token", raw).maybeSingle();
    if (!data) return NextResponse.json({ error: "Không tìm thấy vé" }, { status: 404 });
    const { data: dishRows } = await supabaseAdmin
      .from("booking_dishes").select("dish_name, qty, unit_price").eq("booking_ref", data.booking_ref);
    return NextResponse.json({ booking: { ...data, dishes: dishRows ?? [] } });
  }

  /* 8-char prefix */
  const { data: rows } = await supabaseAdmin
    .from("bookings")
    .select(select)
    .ilike("qr_code_token", `${raw.toUpperCase()}%`)
    .limit(1);

  const data = rows?.[0] ?? null;
  if (!data) return NextResponse.json({ error: "Không tìm thấy vé" }, { status: 404 });
  const { data: dishRows2 } = await supabaseAdmin
    .from("booking_dishes").select("dish_name, qty, unit_price").eq("booking_ref", data.booking_ref);
  return NextResponse.json({ booking: { ...data, dishes: dishRows2 ?? [] } });
}

/* POST /api/checkin — xác nhận check-in */
export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}));
  if (!token) return NextResponse.json({ error: "Thiếu mã vé" }, { status: 400 });

  /* AMF- booking_ref → check-in toàn bộ group */
  if (/^AMF-/i.test(token)) {
    const { data: rows } = await supabaseAdmin
      .from("bookings")
      .select("id, status, guest_name, guest_count, slot_time, activities(name)")
      .eq("booking_ref", token.toUpperCase());

    if (!rows?.length) return NextResponse.json({ error: "Không tìm thấy vé" }, { status: 404 });

    const first = rows[0];
    if (first.status === "CHECKED_IN") return NextResponse.json({ error: "Vé đã được check-in trước đó", booking: first }, { status: 409 });
    if (first.status === "CANCELLED")  return NextResponse.json({ error: "Vé đã bị hủy", booking: first }, { status: 409 });
    if (first.status === "PENDING")    return NextResponse.json({ error: "Vé chưa thanh toán", booking: first }, { status: 409 });

    await supabaseAdmin
      .from("bookings")
      .update({ status: "CHECKED_IN" })
      .in("id", rows.map(b => b.id));

    return NextResponse.json({ success: true, booking: first });
  }

  /* UUID hoặc 8-char prefix */
  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("id, status, guest_name, guest_count, slot_time, activities(name)")
    .eq("qr_code_token", token.trim())
    .maybeSingle()
    .then(async r => {
      if (r.data) return r;
      return supabaseAdmin.from("bookings")
        .select("id, status, guest_name, guest_count, slot_time, activities(name)")
        .ilike("qr_code_token", `${token.trim().toUpperCase()}%`)
        .limit(1)
        .then(r2 => ({ data: r2.data?.[0] ?? null }));
    });

  if (!booking) return NextResponse.json({ error: "Không tìm thấy vé" }, { status: 404 });
  if (booking.status === "CHECKED_IN") return NextResponse.json({ error: "Vé đã được check-in trước đó", booking }, { status: 409 });
  if (booking.status === "CANCELLED")  return NextResponse.json({ error: "Vé đã bị hủy", booking }, { status: 409 });
  if (booking.status === "PENDING")    return NextResponse.json({ error: "Vé chưa thanh toán", booking }, { status: 409 });

  await supabaseAdmin.from("bookings").update({ status: "CHECKED_IN" }).eq("id", booking.id);
  return NextResponse.json({ success: true, booking });
}
