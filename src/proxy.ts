import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only block unauthenticated access to /dashboard routes
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Only run middleware on dashboard routes — NOT on /login or /signup
export const config = {
  matcher: ["/dashboard/:path*"],
};
