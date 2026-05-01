import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/* GET — list all reviews (admin) */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, activity_id, guest_name, guest_email, rating, comment, is_approved, created_at, activities(name)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data ?? [] });
}
