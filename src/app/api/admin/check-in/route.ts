import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

import { getSessionFromRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await req.json().catch(() => ({ token: null }));

  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  // Look up booking by QR token
  const { data: booking, error } = await supabaseAdmin
    .from("bookings")
    .select("id, status, guest_name, guest_count, slot_time, activities(name)")
    .eq("qr_code_token", token)
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "Invalid QR code" }, { status: 404 });
  }

  if (booking.status === "CHECKED_IN") {
    return NextResponse.json({ error: "Already checked in", booking }, { status: 409 });
  }

  if (booking.status === "CANCELLED") {
    return NextResponse.json({ error: "Booking is cancelled", booking }, { status: 409 });
  }

  // Mark as checked in
  const { error: updateErr } = await supabaseAdmin
    .from("bookings")
    .update({ status: "CHECKED_IN" })
    .eq("id", booking.id);

  if (updateErr) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }

  return NextResponse.json({
    success:    true,
    message:    "Check-in successful",
    bookingId:  booking.id,
    guestName:  booking.guest_name,
    guestCount: booking.guest_count,
    slotTime:   booking.slot_time,
  });
}
