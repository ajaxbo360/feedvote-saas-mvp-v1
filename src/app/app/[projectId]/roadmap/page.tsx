'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { KanbanBoard } from '@/components/dashboard/kanban/KanbanBoard';

interface PageProps {
  params: {
    projectId: string;
  };
}

export default function RoadmapPage({ params }: PageProps) {
  const { projectId } = params;
  const slug = projectId; // The URL param is actually the slug
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }
      setUser(user);
    }

    async function getProject() {
      const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).single();

      if (error || !project) {
        console.error('Project not found:', error?.message || 'No project with this slug');
        redirect('/app');
      }
      setProject(project);
    }

    getUser();
    getProject();
  }, [slug]);

  if (!user || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center p-8">
          <h1 className="text-3xl font-bold">Roadmap</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Anonymous session</span>
            </div>
            <select className="border rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-800">
              <option value="votes">Sort by Votes</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        <div className="flex-1">
          <KanbanBoard />
        </div>
      </div>
    </main>
  );
}
