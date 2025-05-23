'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function LoginForm() {
  const { toast } = useToast();

  function handleGoogleLogin() {
    // This will be implemented with Supabase Google OAuth
    toast({ description: 'Google login will be implemented with Supabase' });
  }

  return (
    <div className={'px-6 md:px-16 pb-6 py-8 gap-6 flex flex-col items-center justify-center'}>
      <div className={'text-[30px] leading-[36px] font-medium tracking-[-0.6px] text-center mb-6'}>
        Log in to your account
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
        Continue with your Google account to access FeedVote.
      </p>

      <Button
        onClick={handleGoogleLogin}
        type={'button'}
        variant={'outline'}
        className={
          'w-full rounded-full border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2'
        }
      >
        <svg viewBox="0 0 24 24" width="18" height="18">
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
        Continue with Google
      </Button>

      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        By continuing, you agree to our{' '}
        <a href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-300">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-300">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
