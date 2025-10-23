import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // Debug incoming request
  console.log('=== AUTH CALLBACK ===');
  const { searchParams, origin, pathname, href } = new URL(request.url);
  console.log('Request URL:', href);
  console.log('Origin:', origin);
  console.log('Pathname:', pathname);

  // Get auth code and next URL
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL, otherwise go to app
  const next = searchParams.get('next') ?? '/app';

  console.log('Auth code present:', !!code);
  console.log('Next URL:', next);
  console.log('All search params:', Object.fromEntries(searchParams.entries()));

  if (code) {
    try {
      console.log('Exchanging code for session...');
      const supabase = await createClient();

      // Debug: check current cookies
      const cookieStore = cookies();
      const allCookies = cookieStore.getAll();
      console.log(
        'Cookies before session exchange:',
        allCookies.map((c) => c.name),
      );

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
      }

      console.log('Session exchange successful, user authenticated:', !!data.session);

      // Create a response with appropriate headers
      const response = NextResponse.redirect(`${origin}${next}`);

      // Log cookies after exchange
      const afterCookies = cookies().getAll();
      console.log(
        'Cookies after session exchange:',
        afterCookies.map((c) => c.name),
      );

      console.log('Redirecting to:', `${origin}${next}`);
      return response;
    } catch (err) {
      console.error('Unexpected error in auth callback:', err);
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unexpected_error`);
    }
  }

  // If no code is present, redirect to the error page
  console.log('No auth code found, redirecting to error page');
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`);
}
