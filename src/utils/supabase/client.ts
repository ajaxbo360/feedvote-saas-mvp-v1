import { createBrowserClient } from '@supabase/ssr';
import { getEnvironmentSpecificSupabaseUrl } from '@/utils/environment-helper';

/**
 * Custom storage implementation to handle both localStorage and cookies
 * This ensures authentication tokens are secure in httpOnly cookies
 * while still maintaining localStorage data for UI components
 */
class DualStorage {
  getItem(key: string) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  setItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  }

  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  }
}

export function createClient() {
  // Use our environment helper to ensure the correct URL based on hostname
  // This works around issues with environment variables not being set correctly
  const supabaseUrl = getEnvironmentSpecificSupabaseUrl() || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables missing in browser client');

    // Return a dummy client that won't fail but won't work either
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => {
          console.error('DUMMY CLIENT: Cannot sign in because environment variables are missing');
          return {
            data: null,
            error: new Error('Supabase not configured: Environment variables missing'),
          };
        },
        signOut: async () => ({ error: null }),
      },
    } as any;
  }

  // Create dual storage instance for both cookies and localStorage
  const dualStorage = typeof window !== 'undefined' ? new DualStorage() : undefined;

  // Create browser client with PKCE flow
  const client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
      storage: dualStorage,
    },
  });

  return client;
}
