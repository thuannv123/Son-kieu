import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ref   = req.nextUrl.searchParams.get("ref")?.trim().toUpperCase();
  const phone = req.nextUrl.searchParams.get("phone")?.trim();

  if (!ref && !phone) {
    return NextResponse.json({ error: "Nhập mã đặt vé hoặc số điện thoại" }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("bookings")
    .select("id, booking_ref, status, guest_name, guest_count, guest_phone, booking_date, slot_time, total_price, dish_total, qr_code_token, activities(name, category)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (ref) {
    query = query.eq("booking_ref", ref);
  } else if (phone) {
    const cleaned = phone.replace(/\D/g, "");
    const last9   = cleaned.slice(-9);
    query = query.ilike("guest_phone", `%${last9}`);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: "Không tìm thấy vé. Kiểm tra lại mã hoặc số điện thoại." }, { status: 404 });
  }

  /* Group by booking_ref → 1 vé / nhóm */
  const groups = new Map<string, typeof data>();
  for (const b of data) {
    const key = b.booking_ref ?? b.id;
    const arr = groups.get(key) ?? [];
    arr.push(b);
    groups.set(key, arr);
  }

  /* Fetch dishes for all unique refs */
  const refs = Array.from(groups.keys()).filter(k => k.startsWith("AMF-"));
  const dishMap = new Map<string, { dish_name: string; qty: number; unit_price: string }[]>();
  if (refs.length > 0) {
    const { data: allDishes } = await supabaseAdmin
      .from("booking_dishes")
      .select("booking_ref, dish_name, qty, unit_price")
      .in("booking_ref", refs);
    for (const d of allDishes ?? []) {
      const arr = dishMap.get(d.booking_ref) ?? [];
      arr.push({ dish_name: d.dish_name, qty: d.qty, unit_price: d.unit_price });
      dishMap.set(d.booking_ref, arr);
    }
  }

  const tickets = Array.from(groups.values()).map(arr => {
    const first = arr[0];
    const act   = (b: typeof first) =>
      (b.activities as { name: string; category: string } | null);

    return {
      bookingRef:  first.booking_ref,
      status:      first.status,
      guestName:   first.guest_name,
      guestCount:  first.guest_count,
      date:        first.booking_date,
      time:        first.slot_time?.slice(0, 5) ?? "—",
      totalPrice:  arr.reduce((s, b) => s + Number(b.total_price), 0),
      qrToken:     first.qr_code_token,
      activities:  arr.map(b => ({
        name:     act(b)?.name     ?? "—",
        category: act(b)?.category ?? "",
        price:    Number(b.total_price) - Number(b.dish_total ?? 0),
      })),
      dishes: dishMap.get(first.booking_ref ?? "") ?? [],
    };
  });

  /* Khi tìm theo SĐT chỉ trả về đơn mới nhất */
  const result = phone ? tickets.slice(0, 1) : tickets;
  return NextResponse.json({ tickets: result });
}
