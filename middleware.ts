import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/" || pathname === "/signup";
  const isTaskBoardRoute = pathname.startsWith("/taskboard");

  if (!token && isTaskBoardRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/taskboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signup", "/taskboard/:path*"],
};
