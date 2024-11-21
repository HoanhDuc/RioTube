import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Get session token from cookies
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Debug information using Response headers
  const response = NextResponse.next();
  response.headers.set("x-path", path);
  response.headers.set("x-token-exists", token ? "true" : "false");
  response.headers.set("x-cookies", JSON.stringify(request.cookies.getAll()));

  const isAuthPage = path.startsWith("/auth");

  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp)$).*)",
  ],
};
