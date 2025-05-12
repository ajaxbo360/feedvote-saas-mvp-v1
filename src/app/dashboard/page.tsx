import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { DashboardLandingPage } from '@/components/dashboard/landing/dashboard-landing-page';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the current user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if not authenticated (this is a backup to middleware protection)
  if (!session) {
    redirect('/');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={'Dashboard'} />

      <div className="flex flex-col gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">You have successfully signed in using Google OAuth!</p>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Your User Information:</h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto">
              <pre className="text-xs">
                {JSON.stringify(
                  {
                    id: user?.id,
                    email: user?.email,
                    emailVerified: user?.email_confirmed_at ? 'Yes' : 'No',
                    lastSignIn: user?.last_sign_in_at,
                    provider: user?.app_metadata?.provider,
                    createdAt: user?.created_at,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              Sign out
            </Button>
          </form>
        </div>
      </div>

      <DashboardLandingPage />
    </main>
  );
}
