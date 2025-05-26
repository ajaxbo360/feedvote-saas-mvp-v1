'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { KanbanBoard } from '@/components/dashboard/kanban/KanbanBoard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

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
    <main className="flex flex-1 flex-col h-[calc(100vh-4rem)] overflow-auto">
      <div className="flex flex-col flex-1">
        <div className="w-full sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex justify-between items-center px-8 py-4">
            <h1 className="text-2xl font-semibold">Roadmap</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Anonymous session</span>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  Sort by Votes <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Upvotes</DropdownMenuItem>
                  <DropdownMenuItem>Release date</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex-1 pb-8">
          <KanbanBoard />
        </div>
      </div>
    </main>
  );
}
