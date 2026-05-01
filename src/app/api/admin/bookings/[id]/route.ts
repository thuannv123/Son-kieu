import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSessionFromRequest } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body   = await req.json().catch(() => ({}));
  const allowed = ["status", "booking_date", "slot_time", "guest_count"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) update[key] = body[key];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update(update)
    .eq("id", id)
    .select("id, status, booking_date, guest_name")
    .single();

  if (error || !data) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ success: true, booking: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN") return NextResponse.json({ error: "Chỉ Super Admin mới có thể xóa" }, { status: 403 });

  const { id } = await params;

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("id, status")
    .eq("id", id)
    .single();

  if (!booking) return NextResponse.json({ error: "Không tìm thấy đơn" }, { status: 404 });
  if (booking.status !== "CANCELLED") {
    return NextResponse.json({ error: "Chỉ được xóa đơn đã hủy" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Xóa thất bại" }, { status: 500 });
  return NextResponse.json({ success: true });
}
