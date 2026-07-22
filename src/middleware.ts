import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveClientIp } from "@/lib/client-ip";

/**
 * Runs on every page/API visit: reads the client address from the incoming
 * request (proxy headers or platform IP) and forwards it to route handlers.
 */
export function middleware(request: NextRequest) {
  const visitorIp = resolveClientIp({
    headers: request.headers,
    ip: request.ip ?? null,
  });

  const requestHeaders = new Headers(request.headers);
  if (visitorIp) {
    requestHeaders.set("x-visitor-address", visitorIp);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (visitorIp) {
    response.headers.set("x-visitor-address", visitorIp);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
