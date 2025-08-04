import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';

// Admin routes that require authentication
const PROTECTED_ROUTES = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for existing session
  const sessionToken = request.cookies.get('admin-session')?.value;

  if (sessionToken) {
    // Verify session token
    try {
      const isValidSession = verifySessionToken(sessionToken);
      if (isValidSession) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Session verification failed:', error);
    }
  }

  // Check for basic auth header
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    const credentials = authHeader.slice(6);
    const [username, password] = Buffer.from(credentials, 'base64')
      .toString()
      .split(':');

    if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
      // Create session and redirect
      const response = NextResponse.next();
      const sessionToken = createSessionToken(username);

      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }
  }

  // Redirect to login page
  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);

  return NextResponse.redirect(loginUrl);
}

// Simple session token creation (in production, use proper JWT or similar)
function createSessionToken(username: string): string {
  const timestamp = Date.now();
  const payload = `${username}:${timestamp}`;

  // In production, use proper encryption/signing
  return Buffer.from(payload).toString('base64');
}

// Simple session token verification
function verifySessionToken(token: string): boolean {
  try {
    const payload = Buffer.from(token, 'base64').toString();
    const [username, timestamp] = payload.split(':');

    // Check if username matches
    if (username !== env.ADMIN_USERNAME) {
      return false;
    }

    // Check if token is not expired (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    return tokenAge < maxAge;
  } catch (error) {
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
