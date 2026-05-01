import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/* ── Email regex (RFC-5322 simplified) ─────────────────── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface NewsletterBody {
  email: string;
}

export async function POST(req: NextRequest) {
  /* ── Parse body ─────────────────────────────────────── */
  let body: NewsletterBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Dữ liệu không hợp lệ." },
      { status: 400 }
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();

  /* ── Validate ───────────────────────────────────────── */
  if (!email) {
    return NextResponse.json(
      { success: false, error: "Vui lòng nhập địa chỉ email." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { success: false, error: "Địa chỉ email không hợp lệ." },
      { status: 400 }
    );
  }

  /* ── Upsert into Supabase ───────────────────────────── */
  // Use upsert so duplicate emails are handled gracefully.
  // `active` defaults to true; if already subscribed the row is untouched.
  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .upsert(
      { email, active: true },
      {
        onConflict: "email",   // unique constraint on email column
        ignoreDuplicates: true // silently skip if already exists
      }
    );

  if (error) {
    console.error("[newsletter] Supabase error:", error.message);
    return NextResponse.json(
      { success: false, error: "Không thể lưu đăng ký. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Đăng ký thành công!" },
    { status: 200 }
  );
}
