import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin }            from "@/lib/supabase-admin";
import { getSessionFromRequest }    from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ref      = req.nextUrl.searchParams.get("ref");
  const idsParam = req.nextUrl.searchParams.get("ids");

  if (!ref && !idsParam) {
    return NextResponse.json({ error: "ref or ids required" }, { status: 400 });
  }

  let query = supabaseAdmin
    .from("bookings")
    .select("id, booking_ref, status, guest_name, guest_email, guest_phone, guest_count, booking_date, slot_time, total_price, dish_total, qr_code_token, activities(name, category)")
    .order("created_at", { ascending: true });

  if (ref) {
    query = query.eq("booking_ref", ref);
  } else {
    query = query.in("id", idsParam!.split(",").filter(Boolean));
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });
  }

  const first      = data[0];
  const bookingRef = first.booking_ref as string | null;

  /* Fetch dishes */
  let dishes: { dish_name: string; qty: number; unit_price: string }[] = [];
  if (bookingRef) {
    const { data: dishRows } = await supabaseAdmin
      .from("booking_dishes")
      .select("dish_name, qty, unit_price")
      .eq("booking_ref", bookingRef);
    dishes = dishRows ?? [];
  }

  /* Fetch refund info */
  let refund: { proofUrl: string; note: string | null; createdAt: string } | null = null;
  if (bookingRef && first.status === "REFUNDED") {
    const { data: refundRow } = await supabaseAdmin
      .from("booking_refunds")
      .select("proof_url, note, created_at")
      .eq("booking_ref", bookingRef)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (refundRow) {
      refund = {
        proofUrl:  refundRow.proof_url,
        note:      refundRow.note ?? null,
        createdAt: refundRow.created_at,
      };
    }
  }

  /* Per-activity price: row 0 has dish_total inflated into total_price */
  const activities = data.map(b => {
    const act = (Array.isArray(b.activities) ? b.activities[0] : b.activities) as { name: string; category: string } | null;
    return {
      id:       b.id as string,
      name:     act?.name     ?? "—",
      category: act?.category ?? "",
      price:    Number(b.total_price) - Number(b.dish_total ?? 0),
    };
  });

  const dishTotal      = Number(first.dish_total ?? 0);
  const activityTotal  = activities.reduce((s, a) => s + a.price, 0);
  const total          = data.reduce((s, b) => s + Number(b.total_price), 0);

  return NextResponse.json({
    bookingRef,
    status:   first.status,
    guest: {
      name:  first.guest_name,
      phone: first.guest_phone,
      email: first.guest_email ?? "",
      count: first.guest_count,
    },
    date:     first.booking_date,
    time:     (first.slot_time as string | null)?.slice(0, 5) ?? "—",
    qrToken:  first.qr_code_token,
    activities,
    dishes,
    activityTotal,
    dishTotal,
    total,
    ids:    data.map(b => b.id as string),
    refund,
  });
}
