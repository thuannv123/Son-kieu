import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, guest_name, rating, comment, created_at")
    .eq("is_approved", true)
    .gte("rating", 4)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    return NextResponse.json({ testimonials: [] }, { status: 500 });
  }

  return NextResponse.json({ testimonials: data ?? [] });
}
