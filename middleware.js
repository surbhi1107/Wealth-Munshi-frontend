import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req, res) {
  const token = req?.cookies?._parsed?.get("access-token")?.value;
  const path = req.nextUrl.pathname;
  const isPublicPath =
    path === "/login" || path === "/register" || path?.includes("password");
  const redirectLoginPath = (a) => {
    return "/login";
  };
  const redirectPagePath = (a) => {
    return "/";
  };

  if (req.nextUrl.pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }
  if (req.nextUrl.pathname.startsWith("/.next/")) {
    return NextResponse.next();
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL(redirectLoginPath(path), req.nextUrl));
  }
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL(redirectPagePath(path), req.nextUrl));
  }
}

export const config = {
  matcher: ["/:path*"],
};
