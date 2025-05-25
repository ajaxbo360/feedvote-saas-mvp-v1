'use client';

import { AppSidebar } from '@/components/app/app-sidebar';
import { useParams, usePathname } from 'next/navigation';
import { AppHeader } from '@/components/app/app-header';

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.projectId as string;

  // Don't render this layout for board and roadmap pages as they have their own layouts
  if (pathname.includes('/board') || pathname.includes('/roadmap')) {
    return children;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar projectSlug={projectId} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
