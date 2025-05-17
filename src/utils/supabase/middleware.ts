import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Check if required environment variables are present
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables missing');
    return NextResponse.next();
  }

  try {
    // Debug cookies before processing
    console.log('updateSession - Cookies before:', [...request.cookies.getAll().map((c) => c.name)]);

    // Create a response that we'll use to set cookies on
    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Create supabase client
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => {
            // Log cookie being set
            console.log(`Setting cookie ${name} with options:`, options);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // IMPORTANT: Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // Get user data and refresh session if needed
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Log authentication status
    console.log('updateSession - User authenticated:', !!user);

    // Debug cookies after processing
    console.log('updateSession - Cookies after:', [...supabaseResponse.cookies.getAll().map((c) => c.name)]);

    return supabaseResponse;
  } catch (error) {
    console.error('Error in Supabase middleware:', error);
    return NextResponse.next();
  }
}
