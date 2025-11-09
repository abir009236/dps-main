import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected routes for regular users (must be logged in)
const userProtectedPaths = [
  "/dashboard",
  "/delivered-products",
  "/orders",
  "/profile",
  "/change-password",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Read next-auth token (JWT)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = token?.role || token?.user?.role || null;

  // 1) Admin protection: any /admin path except the explicit login route
  if (pathname.startsWith("/admin")) {
    const isAdminLogin = pathname === "/admin/login";

    if (isAdminLogin) {
      return NextResponse.next();
    }

    // Require admin auth for all other /admin pages
    if (!token || role !== "Admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // 2) User protection: require login for specified user routes
  const isUserProtected = userProtectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isUserProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/delivered-products/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/change-password/:path*",
  ],
};
