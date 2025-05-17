import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AuthBridge } from '@/components/auth/auth-bridge';

export const metadata: Metadata = {
  title: 'FeedVote - App',
  description: 'Manage your projects and feature requests',
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // The user might have a valid session in localStorage but not in cookies
      // The AuthBridge component will help synchronize this state if needed
      console.log('AppLayout: No session found, redirecting to home');
      redirect('/');
    }

    console.log('AppLayout: Valid session found, rendering app');

    // Include AuthBridge to help synchronize auth state
    return (
      <div className="flex min-h-screen flex-col">
        <AuthBridge />
        {children}
      </div>
    );
  } catch (error) {
    console.error('Error in AppLayout:', error);
    // If there's an error checking the session, redirect to home
    redirect('/');
  }
}
