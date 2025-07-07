import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (except protected ones)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/settings', '/api/users', '/api/files', '/api/projects'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    try {
      const sessionCookie = getSessionCookie(request);

      if (!sessionCookie) {
        // Redirect to sign in page
        const signInUrl = new URL('/login', request.url);
        return NextResponse.redirect(signInUrl);
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      // Redirect to sign in on error
      const signInUrl = new URL('/login', request.url);
      return NextResponse.redirect(signInUrl);
    }

  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

