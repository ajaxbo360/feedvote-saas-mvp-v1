'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Settings, Key, Globe, Palette, BellRing, Users } from 'lucide-react';

const navItems = [
  {
    title: 'General',
    href: '/general',
    icon: Settings,
  },
  {
    title: 'API Keys',
    href: '/api-keys',
    icon: Key,
  },
  {
    title: 'Integrations',
    href: '/integrations',
    icon: Globe,
  },
  {
    title: 'Appearance',
    href: '/appearance',
    icon: Palette,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: BellRing,
  },
  {
    title: 'Team',
    href: '/team',
    icon: Users,
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ projectId: string }>();
  const pathname = usePathname();
  const projectId = params.projectId;

  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] py-8">
      <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
        <nav className="grid items-start gap-2">
          {navItems.map((item) => {
            const baseHref = `/app/${projectId}/settings${item.href}`;
            const isActive = pathname === baseHref;

            return (
              <Link
                key={item.href}
                href={baseHref}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
