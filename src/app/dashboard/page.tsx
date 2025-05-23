'use client';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { KanbanBoard } from '@/components/dashboard/kanban/KanbanBoard';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect('/');
      }
      setUser(user);
    }
    getUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={'Dashboard'} />

      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Manage your feature requests and feedback with the board below.
          </p>

          <form action="/auth/signout" method="post">
            <Button
              type="submit"
              className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              Sign out
            </Button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <KanbanBoard />
        </div>
      </div>
    </main>
  );
}
