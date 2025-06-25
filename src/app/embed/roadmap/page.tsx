'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: string;
  created_at: string;
}

interface RoadmapColumn {
  title: string;
  status: string;
  items: FeedbackItem[];
}

function RoadmapContent() {
  const searchParams = useSearchParams();
  const [columns, setColumns] = useState<RoadmapColumn[]>([
    { title: 'Planned', status: 'planned', items: [] },
    { title: 'In Progress', status: 'in_progress', items: [] },
    { title: 'Completed', status: 'completed', items: [] },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = searchParams.get('slug');
  const colorMode = searchParams.get('color_mode') || 'light';
  const variant = searchParams.get('variant') || 'v1';

  useEffect(() => {
    async function fetchRoadmap() {
      if (!slug) {
        setError('Project slug is required');
        setLoading(false);
        return;
      }

      try {
        // First get the project ID from the slug
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('id')
          .eq('slug', slug)
          .single();

        if (projectError || !projectData) {
          throw new Error('Project not found');
        }

        // Then fetch feedback items for the roadmap
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select('*')
          .eq('project_id', projectData.id)
          .in('status', ['planned', 'in_progress', 'completed'])
          .order('votes', { ascending: false });

        if (feedbackError) {
          throw feedbackError;
        }

        // Organize feedback into columns
        const newColumns = columns.map((column) => ({
          ...column,
          items: (feedbackData || []).filter((item) => item.status === column.status),
        }));

        setColumns(newColumns);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmap();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className={`min-h-screen ${colorMode === 'dark' ? 'dark' : ''}`}>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <div key={column.status} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                {column.title}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({column.items.length})</span>
              </h2>
              <div className="space-y-3">
                {column.items.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">👍 {item.votes}</span>
                    </div>
                  </div>
                ))}
                {column.items.length === 0 && (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">No items yet</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RoadmapEmbed() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      }
    >
      <RoadmapContent />
    </Suspense>
  );
}
