'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * AuthBridge - Client component that helps synchronize auth state between localStorage and cookies
 *
 * This component:
 * 1. Checks for auth state in localStorage
 * 2. Sets a custom header for middleware if user is authenticated in localStorage but not in cookies
 * 3. Handles refresh tokens via the client
 * 4. Ensures UI has access to user data via localStorage
 */
export function AuthBridge() {
  useEffect(() => {
    // Check for Supabase auth in localStorage and ensure UI has access to user data
    const checkAuthState = async () => {
      try {
        const supabase = createClient();

        // Get the session from Supabase
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          console.log('AuthBridge: User is authenticated');

          // Make sure user profile data is available in localStorage for UI components
          const userData = {
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.full_name || data.session.user.email,
            avatar_url: data.session.user.user_metadata?.avatar_url || null,
            provider: data.session.user.app_metadata?.provider || 'unknown',
          };

          // Store user data in localStorage for UI components
          localStorage.setItem('feedvote-user-profile', JSON.stringify(userData));

          // Add a custom auth header for our middleware
          // This helps when cookies might be missing but localStorage still has valid auth
          const headers = new Headers();
          headers.append('x-supabase-auth', 'true');

          // Make a request to an endpoint to help set cookies
          fetch('/api/auth/sync', {
            method: 'POST',
            headers,
          }).catch((err) => {
            console.error('Error syncing auth state:', err);
          });
        } else {
          console.log('AuthBridge: No active session found');

          // Clear user profile data if session is gone
          localStorage.removeItem('feedvote-user-profile');
        }
      } catch (error) {
        console.error('Error in AuthBridge:', error);
      }
    };

    // Run on mount and when the window gains focus (user returns to the tab)
    checkAuthState();

    // Add focus event listener to catch returning users
    window.addEventListener('focus', checkAuthState);

    return () => {
      window.removeEventListener('focus', checkAuthState);
    };
  }, []);

  // This is a "silent" component, it doesn't render anything
  return null;
}
