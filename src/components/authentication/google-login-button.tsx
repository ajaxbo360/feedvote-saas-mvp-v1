'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { getAuthRedirectUrl } from '@/utils/url-helper';
import { getEnvironmentSpecificSupabaseUrl } from '@/utils/environment-helper';
import Image from 'next/image';

interface Props {
  label: string;
}

export function GoogleLoginButton({ label }: Props) {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      // Add extensive debug logging
      console.log('=== GOOGLE LOGIN DEBUG ===');

      // Log environment information
      console.log('Window Location:', {
        hostname: window.location.hostname,
        origin: window.location.origin,
        href: window.location.href,
      });

      // Log Supabase URL that will be used
      const supabaseUrlToUse = getEnvironmentSpecificSupabaseUrl();
      console.log('Supabase URL being used:', supabaseUrlToUse);
      console.log('Env Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

      // Log redirect URL
      const redirectUrl = getAuthRedirectUrl();
      console.log('Auth Redirect URL:', redirectUrl);

      console.log('=========================');

      const supabase = createClient();
      console.log('Starting OAuth flow with Supabase...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            // Add a timestamp to prevent caching issues
            _t: new Date().getTime().toString(),
          },
        },
      });

      if (error) {
        console.error('OAuth Error:', error);
        toast({
          title: 'Authentication error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('OAuth successful, redirecting to:', data?.url);
      }
    } catch (err) {
      console.error('Unexpected error during authentication:', err);
      toast({
        title: 'Authentication error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div
      className={
        'mx-auto w-[343px] md:w-[488px] bg-background/80 backdrop-blur-[6px] px-6 md:px-16 pt-0 py-8 gap-6 flex flex-col items-center justify-center rounded-b-lg'
      }
    >
      <Button
        onClick={handleGoogleLogin}
        className={
          'w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl px-6 py-3 font-semibold'
        }
      >
        <svg viewBox="0 0 24 24" width="24" height="24" className="mr-3">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {label}
      </Button>
    </div>
  );
}
