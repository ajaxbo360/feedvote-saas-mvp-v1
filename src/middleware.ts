import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { apiRateLimiter } from '@/utils/rate-limiter';

const API_ROUTES = ['/api'];
const AUTH_ROUTES = ['/api/auth', '/auth/callback', '/auth/signout'];

// List of reserved subdomains that should not be treated as project slugs
const RESERVED_SUBDOMAINS = ['www', 'app', 'api', 'admin', 'staging', 'dev'];

export async function middleware(request: NextRequest) {
  try {
    // Check if Supabase environment variables exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables missing, skipping auth middleware');
      return NextResponse.next();
    }

    // Apply rate limiting for API routes
    if (API_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route))) {
      const rateLimitResponse = apiRateLimiter(request);
      if (rateLimitResponse) {
        return rateLimitResponse; // Return 429 Too Many Requests
      }
    }

    // Special handling for auth callback route - always allow
    if (request.nextUrl.pathname.startsWith('/auth/callback')) {
      return NextResponse.next();
    }

    // Update the session (this will handle auth token refresh via cookies)
    const response = await updateSession(request);

    // Check if it's a protected route
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/app');

    if (isProtectedRoute) {
      const allCookies = request.cookies.getAll();
      const cookieNames = allCookies.map((c) => c.name);

      // Check for Supabase auth cookies with pattern matching
      // Supabase prefixes cookies with the project ID and may add indices
      const hasAuthCookie = cookieNames.some((name) => {
        return (
          // Check for any cookie containing 'auth-token' pattern
          name.includes('auth-token') ||
          // Check for other common Supabase auth cookie patterns
          name.includes('refresh-token') ||
          name.startsWith('sb-') ||
          name.includes('supabase')
        );
      });

      // Also check for auth in localStorage (client might have sent it via a custom header)
      const authHeader = request.headers.get('x-supabase-auth') || '';
      const hasAuthHeader = authHeader.length > 0;

      if (!hasAuthCookie && !hasAuthHeader) {
        const redirectUrl = new URL('/', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Extract subdomain (handle both production and local development)
    const subdomain = hostname.split('.')[0];
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    const isCustomDomain = !hostname.includes('feedvote.com') && !isLocalhost;

    // Skip middleware for static files and API routes
    if (
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/static') ||
      url.pathname.startsWith('/api') ||
      url.pathname === '/favicon.ico'
    ) {
      return NextResponse.next();
    }

    // Handle custom domains (if implemented in the future)
    if (isCustomDomain) {
      // TODO: Implement custom domain handling
      return NextResponse.next();
    }

    // Skip middleware for reserved subdomains
    if (RESERVED_SUBDOMAINS.includes(subdomain)) {
      return NextResponse.next();
    }

    // Handle project subdomains
    if (hostname !== 'feedvote.com' && hostname !== 'www.feedvote.com' && !isLocalhost) {
      // Rewrite the URL to the project route
      const newUrl = new URL(`/app/${subdomain}${url.pathname}`, request.url);
      return NextResponse.rewrite(newUrl);
    }

    // For localhost development, check if the URL starts with /app/
    if (isLocalhost && url.pathname.startsWith('/app/')) {
      return NextResponse.next();
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Always allow the request to continue in case of errors
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
