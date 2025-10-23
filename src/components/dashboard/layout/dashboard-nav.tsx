'use client';

import { Button } from '@/components/ui/button';
import { Menu, Bell, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export function DashboardNav() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data && data.user) {
        setUser(data.user);
      }
    }

    fetchUser();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6 dark:bg-gray-900">
      <div className="flex items-center gap-2 lg:hidden">
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      <div className="relative flex-1">
        <div className="flex w-full items-center gap-2 md:w-2/3 lg:w-1/3">
          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="search"
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              {user && (
                <div className="text-sm">
                  <div className="font-medium">{user.email?.split('@')[0] || 'User'}</div>
                </div>
              )}
              <Button variant="outline" className="rounded-full border-gray-200 dark:border-gray-800">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl uppercase dark:bg-gray-800">
                  {user?.email?.charAt(0) || 'U'}
                </span>
              </Button>
            </div>
            <div className="flex">
              <Link href="/auth/signout" className="text-sm text-gray-500 hover:text-gray-900">
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
