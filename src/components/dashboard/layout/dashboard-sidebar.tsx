'use client';

import { Kanban, Settings, CreditCard, BarChart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarUserInfo } from './sidebar-user-info';

const sidebarItems = [
  {
    title: 'Projects',
    icon: <Kanban className="h-6 w-6" />,
    href: '/app',
  },
  {
    title: 'Analytics',
    icon: <BarChart className="h-6 w-6" />,
    href: '/app/analytics',
  },
  {
    title: 'Payments',
    icon: <CreditCard className="h-6 w-6" />,
    href: '/app/payments',
  },
  {
    title: 'Settings',
    icon: <Settings className="h-6 w-6" />,
    href: '/app/settings',
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40 h-screen">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/app" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">FeedVote</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarItems.map((item) => {
              // Check if the current pathname matches this nav item
              const isActive =
                item.href === '/app' ? pathname === '/app' || pathname === '/app#' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn('flex items-center gap-3 rounded-lg px-3 py-2 transition-all', {
                    'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50': isActive,
                    'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700': !isActive,
                  })}
                >
                  {item.icon}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <SidebarUserInfo />
        </div>
      </div>
    </div>
  );
}
