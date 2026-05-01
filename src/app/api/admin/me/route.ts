import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.isLegacy) {
    return NextResponse.json({ id: null, name: "Super Admin", role: "SUPER_ADMIN", email: null, isLegacy: true });
  }

  const { data: staff } = await supabaseAdmin
    .from("staff_accounts")
    .select("id, name, email, role, phone, is_active")
    .eq("id", session.staffId)
    .single();

  if (!staff || !staff.is_active) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ...staff, isLegacy: false });
}
