import { createBrowserClient } from '@supabase/ssr';
import { getEnvironmentSpecificSupabaseUrl } from '@/utils/environment-helper';

export function createClient() {
  // Use our environment helper to ensure the correct URL based on hostname
  // This works around issues with environment variables not being set correctly
  const supabaseUrl = getEnvironmentSpecificSupabaseUrl() || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('==== SUPABASE CLIENT CREATION ====');
  console.log('Creating Supabase client with URL:', supabaseUrl);
  console.log('Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');
  console.log('Current origin:', typeof window !== 'undefined' ? window.location.origin : 'server-side');
  console.log(
    'Environment vars available:',
    process.env.NEXT_PUBLIC_SUPABASE_URL ? 'NEXT_PUBLIC_SUPABASE_URL ✓' : 'NEXT_PUBLIC_SUPABASE_URL ✗',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY ✓' : 'NEXT_PUBLIC_SUPABASE_ANON_KEY ✗',
  );
  console.log('================================');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables missing in browser client:');
    console.error(`- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'Missing'}`);
    console.error(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set' : 'Missing'}`);

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

  console.log('Creating real Supabase client with URL:', supabaseUrl);
  const client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
