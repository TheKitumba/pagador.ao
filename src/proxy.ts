import { type NextRequest, NextResponse } from "next/server";

import { areaRedirect, homePath, isGuestOnlyPath, isPublicPath } from "@/config/access";
import { AUTH_COOKIES, ROUTES } from "@/config/app";

interface AccessClaims {
  roles: string[];
  employeeId: string | null;
}

/**
 * Reads the access token's claims to route the user, without verifying its signature: this only
 * decides which page to show. The API verifies the token on every request, so a forged token gets
 * a page shell and no data.
 */
function readAccessClaims(token: string | undefined): AccessClaims | null {
  const payload = token?.split(".")[1];
  if (!payload) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number; roles?: unknown; eid?: unknown };
    if (typeof claims.exp !== "number" || claims.exp * 1000 <= Date.now() || !Array.isArray(claims.roles)) return null;
    return { roles: claims.roles.map(String), employeeId: typeof claims.eid === "string" ? claims.eid : null };
  } catch {
    return null;
  }
}

function redirect(request: NextRequest, pathname: string, search = "") {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = search;
  return NextResponse.redirect(url);
}

/**
 * Page access (Next.js Proxy, formerly Middleware):
 * - signed-out visitors to a protected page go to /login, which brings them back afterwards;
 * - signed-in users are kept off the sign-in and sign-up pages;
 * - employee-only accounts use the portal, everyone else the back office.
 * Per-page permissions are checked by the app shell against GET /auth/me.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const claims = readAccessClaims(request.cookies.get(AUTH_COOKIES.access)?.value);
  // An expired access token with a live refresh token is still a session: the API client
  // refreshes it on the first call.
  const signedIn = claims !== null || request.cookies.has(AUTH_COOKIES.session);

  if (isGuestOnlyPath(pathname)) {
    return signedIn ? redirect(request, claims ? homePath(claims) : ROUTES.dashboard) : NextResponse.next();
  }
  if (isPublicPath(pathname)) return NextResponse.next();

  if (!signedIn) {
    return redirect(request, ROUTES.login, `?next=${encodeURIComponent(pathname + search)}`);
  }

  const target = claims ? areaRedirect(pathname, claims) : null;
  return target ? redirect(request, target) : NextResponse.next();
}

export const config = {
  // Pages only: no build assets, images, files from /public or the favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)"],
};
