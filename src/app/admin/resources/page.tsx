import { supabaseAdmin }    from "@/lib/supabase-admin";
import ActivitiesManager from "@/components/admin/ActivitiesManager";

export const revalidate = 0;

export default async function ResourcesPage() {
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: activities }, { data: bookings }] = await Promise.all([
    supabaseAdmin.from("activities").select("*").order("category").order("name"),
    supabaseAdmin.from("bookings")
      .select("activity_id,guest_count,status")
      .eq("booking_date", today)
      .in("status", ["PAID", "CHECKED_IN"]),
  ]);

  const enriched = (activities ?? []).map(a => ({
    ...a,
    today_guests: (bookings ?? [])
      .filter(b => b.activity_id === a.id)
      .reduce((s, b) => s + b.guest_count, 0),
  }));

  return <ActivitiesManager activities={enriched} />;
}
