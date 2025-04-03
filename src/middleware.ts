import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define admin routes that should be protected
const ADMIN_ROUTES = [
  "/admin",
  "/admin/dashboard",
  "/admin/content",
  "/admin/media",
  "/admin/settings",
  "/admin/users",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the requested path is an admin route
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    // Check for admin session from cookies
    const isAdminSession =
      request.cookies.get("admin-session")?.value === "true";
    const isAuthenticated =
      request.cookies.get("auth-session")?.value === "true";

    // If not authenticated or not admin, redirect to login
    if (!isAuthenticated || !isAdminSession) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);

      // Redirect to login page
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure middleware to run only on admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
