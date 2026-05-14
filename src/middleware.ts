import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const DEV_ONLY_ROUTES = [
  "/completion-options",
  "/drafts",
  "/icons",
  "/intro-options",
  "/nav-options",
  "/transitions",
];

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (DEV_ONLY_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/completion-options/:path*",
    "/drafts/:path*",
    "/icons/:path*",
    "/intro-options/:path*",
    "/nav-options/:path*",
    "/transitions/:path*",
  ],
};
