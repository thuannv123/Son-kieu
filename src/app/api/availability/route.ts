import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Default slot times for every day
const DEFAULT_SLOTS = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

export async function GET(req: NextRequest) {
  const activityId = req.nextUrl.searchParams.get("activityId");
  const date       = req.nextUrl.searchParams.get("date");

  if (!activityId || !date) {
    return NextResponse.json({ error: "activityId and date are required" }, { status: 400 });
  }

  // Fetch activity to get max_per_slot
  const { data: activity, error: actErr } = await supabaseAdmin
    .from("activities")
    .select("id, max_per_slot")
    .eq("id", activityId)
    .single();

  if (actErr || !activity) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }

  // Fetch existing slot rows for this activity + date
  const { data: slotRows } = await supabaseAdmin
    .from("activity_slots")
    .select("slot_time, booked_count")
    .eq("activity_id", activityId)
    .eq("slot_date", date);

  const bookedMap = new Map(
    (slotRows ?? []).map((s) => [s.slot_time.slice(0, 5), s.booked_count])
  );

  const slots = DEFAULT_SLOTS.map((time, i) => ({
    id:        `${activityId}-${date}-${time}`,
    time,
    total:     activity.max_per_slot,
    available: Math.max(0, activity.max_per_slot - (bookedMap.get(time) ?? 0)),
  }));

  return NextResponse.json({ slots });
}
