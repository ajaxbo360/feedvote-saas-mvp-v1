'use client';

import { useParams } from 'next/navigation';
import { AppHeader } from '@/components/app/app-header';

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="flex-1">
        <main className="h-full">{children}</main>
      </div>
    </div>
  );
}
