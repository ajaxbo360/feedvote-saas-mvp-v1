import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { apiRateLimiter } from '@/utils/rate-limiter';

const API_ROUTES = ['/api'];
const AUTH_ROUTES = ['/api/auth', '/auth/callback', '/auth/signout'];

// Public routes that should NEVER require authentication
// These pages are accessible to everyone, including incognito/private browsing
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/pricing', '/products', '/demo', '/embed'];

// List of reserved subdomains that should not be treated as project slugs
const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'staging', 'dev'];

/**
 * Check if a pathname matches a public route.
 * Exact match for '/' and prefix match for others.
 */
function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_ROUTES.some((route) => route !== '/' && pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const pathname = url.pathname;

    // 1. Skip middleware entirely for static files and favicon
    if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname === '/favicon.ico') {
      return NextResponse.next();
    }

    // 2. Check if Supabase environment variables exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables missing, skipping auth middleware');
      return NextResponse.next();
    }

    // 3. Apply rate limiting for API routes
    if (API_ROUTES.some((route) => pathname.startsWith(route))) {
      const rateLimitResponse = apiRateLimiter(request);
      if (rateLimitResponse) {
        return rateLimitResponse; // Return 429 Too Many Requests
      }
      // API routes don't need session updates or auth checks here
      return NextResponse.next();
    }

    // 4. Always allow auth callback route
    if (pathname.startsWith('/auth/callback')) {
      return NextResponse.next();
    }

    // 5. Handle subdomain logic early (before any auth processing)
    const hostname = request.headers.get('host') || '';
    const subdomain = hostname.split('.')[0];
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    const isCustomDomain = !hostname.includes('feedvote.com') && !isLocalhost;

    // Handle custom domains
    if (isCustomDomain) {
      return NextResponse.next();
    }

    // Skip auth for reserved subdomains (www, staging, etc.) on non-protected routes
    // Note: reserved subdomains should still protect /app/* routes
    const isReservedSubdomain = RESERVED_SUBDOMAINS.includes(subdomain);

    // Handle project subdomains (non-reserved, non-localhost)
    if (!isReservedSubdomain && hostname !== 'feedvote.com' && !isLocalhost) {
      // Rewrite the URL to the project route
      const newUrl = new URL(`/app/${subdomain}${pathname}`, request.url);
      return NextResponse.rewrite(newUrl);
    }

    // 6. For PUBLIC routes — allow access WITHOUT any auth processing
    //    This is critical for incognito/private browsing to work
    if (isPublicRoute(pathname)) {
      // Still update session IF cookies exist (so logged-in users get refreshed tokens)
      // But don't block or redirect — just pass through
      try {
        const response = await updateSession(request);
        return response;
      } catch {
        // If session update fails (e.g., no cookies in incognito), just continue
        return NextResponse.next();
      }
    }

    // 7. For PROTECTED routes (/app/*) — require authentication
    const isProtectedRoute = pathname.startsWith('/app');

    if (isProtectedRoute) {
      // Try to update session first
      let response: NextResponse;
      try {
        response = await updateSession(request);
      } catch {
        // Session update failed — redirect to homepage
        const redirectUrl = new URL('/', request.url);
        return NextResponse.redirect(redirectUrl);
      }

      const allCookies = request.cookies.getAll();
      const cookieNames = allCookies.map((c) => c.name);

      // Check for Supabase auth cookies
      const hasAuthCookie = cookieNames.some((name) => {
        return (
          name.includes('auth-token') ||
          name.includes('refresh-token') ||
          name.startsWith('sb-') ||
          name.includes('supabase')
        );
      });

      // Also check for auth in localStorage (client might have sent it via a custom header)
      const authHeader = request.headers.get('x-supabase-auth') || '';
      const hasAuthHeader = authHeader.length > 0;

      if (!hasAuthCookie && !hasAuthHeader) {
        const redirectUrl = new URL('/login', request.url);
        return NextResponse.redirect(redirectUrl);
      }

      return response;
    }

    // 8. For any other routes — allow access
    try {
      return await updateSession(request);
    } catch {
      return NextResponse.next();
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // Always allow the request to continue in case of errors
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
