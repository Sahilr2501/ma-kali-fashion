import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";

  if ((!isAdminPage && !isAdminApi) || isLogin) {
    return NextResponse.next();
  }

  const session = await verifySessionToken(request.cookies.get(COOKIE_NAME)?.value);
  if (session) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ ok: false, message: "Authentication required." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
