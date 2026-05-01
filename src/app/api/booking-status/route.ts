import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "Missing ref" }, { status: 400 });

  const { data } = await supabaseAdmin
    .from("bookings")
    .select("status")
    .eq("booking_ref", ref)
    .limit(1)
    .maybeSingle();

  const status = data?.status ?? "PENDING";
  return NextResponse.json(
    { status },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}
