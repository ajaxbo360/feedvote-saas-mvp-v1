import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * API endpoint to help synchronize authentication between localStorage and cookies
 * This is used by the AuthBridge component to ensure cookie auth state is in sync
 */
export async function POST(request: NextRequest) {
  try {
    // Get the Supabase client with server-side cookie handling
    const supabase = await createClient();

    // Check if the user is already authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If authenticated, refresh the session to ensure cookies are set properly
    if (user) {
      // Since the user is already authenticated, this won't create a new session
      // but will ensure cookies are set correctly
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Auth sync: Error refreshing session:', error);
        return NextResponse.json({ success: false, error: 'Failed to refresh session' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Auth state synchronized' });
    }

    // User not authenticated
    return NextResponse.json({ success: false, error: 'No active session' }, { status: 401 });
  } catch (error) {
    console.error('Auth sync error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
