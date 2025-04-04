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

// Define admin-direct routes that should bypass authentication
const ADMIN_DIRECT_ROUTES = [
  "/admin-direct",
  "/admin-direct/content",
  "/admin-direct/media",
  "/admin-direct/settings",
  "/admin-direct/users",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the requested path is an admin-direct route
  const isAdminDirectRoute = ADMIN_DIRECT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // If it's an admin-direct route, allow access without authentication
  if (isAdminDirectRoute) {
    return NextResponse.next();
  }

  // Check if the requested path is an admin route
  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

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

// Configure middleware to run on both admin and admin-direct routes
export const config = {
  matcher: ["/admin/:path*", "/admin-direct/:path*"],
};
