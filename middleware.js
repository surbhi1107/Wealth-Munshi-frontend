import Cookies from "js-cookie";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies?.get("access-token")?.value;
  const role = request.cookies.get("role")?.value;
  // console.log(accessToken);

  // if (accessToken === undefined) {
  //   return NextResponse.redirect("/login");
  // } else
  if (
    accessToken?.length > 0 &&
    (request.nextUrl.pathname.includes("password") ||
      request.nextUrl.pathname === "/register" ||
      request.nextUrl.pathname === "/login")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (role === 1) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  } else return NextResponse.next();
}
