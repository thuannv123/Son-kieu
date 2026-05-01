import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface DishItem { dishName: string; qty: number; price: string; }

interface BookingBody {
  activityId:  string;
  date:        string;
  slotTime:    string;
  guestCount:  number;
  guestName:   string;
  guestEmail:  string;
  guestPhone:  string;
  bookingRef?: string;
  dishTotal?:  number;
  dishes?:     DishItem[];
}

export async function POST(req: NextRequest) {
  let body: BookingBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { activityId, date, slotTime, guestCount, guestName, guestEmail, guestPhone, bookingRef, dishTotal, dishes } = body;

  // ── Basic validation ────────────────────────────────────────────────────────
  if (!activityId || !date || !slotTime || !guestCount || !guestName || !guestEmail || !guestPhone) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (guestCount < 1 || guestCount > 20) {
    return NextResponse.json({ error: "Guest count must be between 1 and 20" }, { status: 400 });
  }

  // ── Fetch activity ──────────────────────────────────────────────────────────
  const { data: activity, error: actErr } = await supabaseAdmin
    .from("activities")
    .select("id, name, price, max_per_slot, is_active")
    .eq("id", activityId)
    .single();

  if (actErr || !activity) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }
  if (!activity.is_active) {
    return NextResponse.json({ error: "Activity is currently unavailable" }, { status: 409 });
  }

  // ── Check slot availability ─────────────────────────────────────────────────
  const slotTimePadded = slotTime.length === 5 ? `${slotTime}:00` : slotTime;

  const { data: existingSlot } = await supabaseAdmin
    .from("activity_slots")
    .select("id, booked_count")
    .eq("activity_id", activityId)
    .eq("slot_date", date)
    .eq("slot_time", slotTimePadded)
    .maybeSingle();

  const currentBooked = existingSlot?.booked_count ?? 0;
  const available     = activity.max_per_slot - currentBooked;

  if (guestCount > available) {
    return NextResponse.json(
      { error: `Only ${available} spots remaining for this slot` },
      { status: 409 }
    );
  }

  // ── Upsert slot row (atomic increment via RPC not available without PG function,
  //    using simple upsert — acceptable for low-concurrency resort booking) ─────
  const newBooked = currentBooked + guestCount;
  const { data: slotRow, error: slotErr } = await supabaseAdmin
    .from("activity_slots")
    .upsert(
      {
        ...(existingSlot?.id ? { id: existingSlot.id } : {}),
        activity_id:  activityId,
        slot_date:    date,
        slot_time:    slotTimePadded,
        booked_count: newBooked,
      },
      { onConflict: "activity_id,slot_date,slot_time" }
    )
    .select("id")
    .single();

  if (slotErr) {
    return NextResponse.json({ error: "Failed to reserve slot" }, { status: 500 });
  }

  // ── Create booking ──────────────────────────────────────────────────────────
  const qrCodeToken = crypto.randomUUID();
  const totalPrice  = Number(activity.price) * guestCount + (dishTotal ?? 0);

  const { data: booking, error: bookErr } = await supabaseAdmin
    .from("bookings")
    .insert({
      activity_id:   activityId,
      slot_id:       slotRow.id,
      booking_date:  date,
      slot_time:     slotTimePadded,
      guest_count:   guestCount,
      total_price:   totalPrice,
      dish_total:    dishTotal ?? 0,
      status:        "PENDING",
      booking_ref:   bookingRef ?? null,
      qr_code_token: qrCodeToken,
      guest_name:    guestName,
      guest_email:   guestEmail,
      guest_phone:   guestPhone,
    })
    .select("id, qr_code_token, total_price, status")
    .single();

  if (bookErr) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }

  // ── Save individual dish items (only for first booking in group) ────────────
  if (dishes?.length && bookingRef) {
    await supabaseAdmin.from("booking_dishes").insert(
      dishes.map(d => ({
        booking_ref: bookingRef,
        dish_name:   d.dishName,
        qty:         d.qty,
        unit_price:  d.price,
      }))
    );
  }

  return NextResponse.json(
    {
      bookingId:    booking.id,
      qrCodeToken:  booking.qr_code_token,
      activityName: activity.name,
      date,
      slotTime,
      guestCount,
      totalPrice:   booking.total_price,
      status:       booking.status,
    },
    { status: 201 }
  );
}
