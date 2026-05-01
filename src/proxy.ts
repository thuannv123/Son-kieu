import { NextRequest, NextResponse } from "next/server";
import { parseSessionToken } from "@/lib/admin-auth";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token   = req.cookies.get("admin_session")?.value;
  const session = token ? await parseSessionToken(token) : null;

  if (session) return NextResponse.next();

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

/* Next.js 16 dùng tên file "proxy.ts" nhưng vẫn có thể lookup tên hàm "middleware"
   — export cả hai để chắc chắn hoạt động */
export { proxy as middleware };

export const config = {
  matcher: ["/admin/:path*"],
};
