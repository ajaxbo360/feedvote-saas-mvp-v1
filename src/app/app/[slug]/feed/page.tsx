'use client';

import { KanbanBoard } from '@/components/dashboard/kanban/KanbanBoard';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

interface FeedPageProps {
  params: {
    slug: string;
  };
}

export default function FeedPage({ params }: FeedPageProps) {
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
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

    async function getProject() {
      const { data: project } = await supabase.from('projects').select('*').eq('slug', params.slug).single();

      if (!project) {
        redirect('/app');
      }
      setProject(project);
    }

    getUser();
    getProject();
  }, [params.slug]);

  if (!user || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
          <KanbanBoard />
        </div>
      </div>
    </main>
  );
}
