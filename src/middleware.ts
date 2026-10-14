import { NextResponse } from "next/server";

// Passthrough for now. Once the API issues session cookies, redirect unauthenticated
// requests for (private) routes to /login here — presence check only; the API authorises.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
