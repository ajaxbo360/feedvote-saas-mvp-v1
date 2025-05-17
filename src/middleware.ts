import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { apiRateLimiter } from '@/utils/rate-limiter';

const API_ROUTES = ['/api'];
const AUTH_ROUTES = ['/api/auth', '/auth/callback', '/auth/signout'];

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
      console.log('Auth callback route detected - bypassing authentication check');
      return NextResponse.next();
    }

    // Update the session (this will handle auth token refresh via cookies)
    const response = await updateSession(request);

    // Check if it's a protected route
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/app');

    if (isProtectedRoute) {
      // Debug all cookies to see what's available
      console.log('--- COOKIE DEBUG ---');
      console.log('Request URL:', request.nextUrl.pathname);
      const allCookies = request.cookies.getAll();
      const cookieNames = allCookies.map((c) => c.name);
      console.log('All cookies:', cookieNames);

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

      console.log('Has auth cookie:', hasAuthCookie);
      console.log('Has auth header:', hasAuthHeader);

      if (!hasAuthCookie && !hasAuthHeader) {
        console.log('No auth cookies or headers found, redirecting to home page');
        const redirectUrl = new URL('/', request.url);
        return NextResponse.redirect(redirectUrl);
      }

      console.log('Auth cookies or headers found, proceeding to protected route');
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Always allow the request to continue in case of errors
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
