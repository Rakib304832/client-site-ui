import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

export function porxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next()
}
export const config = {
  matcher:[
    "/add-studio",
    "/my-listings"
    "/studios/edit/:path*"
    "/my-bookings"
  ],
};