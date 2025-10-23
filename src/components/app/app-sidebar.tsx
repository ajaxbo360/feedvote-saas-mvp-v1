'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, Activity, Users, PackageOpen, Share2, Settings } from 'lucide-react';

interface AppSidebarProps {
  projectSlug?: string;
}

export function AppSidebar({ projectSlug }: AppSidebarProps) {
  const pathname = usePathname();

  // Only show project navigation if a project slug is provided
  if (!projectSlug) {
    return null;
  }

  const baseUrl = `/app/${projectSlug}`;

  const navigationItems = [
    {
      name: 'Home',
      href: `${baseUrl}/home`,
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Activity',
      href: `${baseUrl}/activity`,
      icon: <Activity className="h-5 w-5" />,
    },
    {
      name: 'Users',
      href: `${baseUrl}/users`,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'Releases',
      href: `${baseUrl}/releases`,
      icon: <PackageOpen className="h-5 w-5" />,
    },
    {
      name: 'Share & Embed',
      href: `${baseUrl}/share`,
      icon: <Share2 className="h-5 w-5" />,
    },
    {
      name: 'Settings & Team',
      href: `${baseUrl}/settings`,
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="w-60 flex-shrink-0 h-full bg-background border-r border-border flex flex-col py-4 sticky top-0">
      <nav className="flex-1">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-teal-50 text-teal-500 dark:bg-teal-950/40 dark:text-teal-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                  )}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
