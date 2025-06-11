'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: string;
  created_at: string;
  project_id: string;
}

export default function VotingBoardEmbed() {
  const searchParams = useSearchParams();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = searchParams.get('slug');
  const colorMode = searchParams.get('color_mode') || 'light';
  const variant = searchParams.get('variant') || 'v1';

  useEffect(() => {
    async function fetchFeedback() {
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

        // Then fetch feedback for this project
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select('*')
          .eq('project_id', projectData.id)
          .order('votes', { ascending: false })
          .order('created_at', { ascending: false });

        if (feedbackError) {
          throw feedbackError;
        }

        setFeedback(feedbackData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
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
        <div className="grid gap-4">
          {feedback.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{item.votes}</span>
                  <button
                    onClick={async () => {
                      // Handle vote
                      const response = await fetch('/api/widget/vote', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          feedback_id: item.id,
                          project_id: item.project_id,
                        }),
                      });

                      if (response.ok) {
                        // Update local state
                        setFeedback((prev) => prev.map((f) => (f.id === item.id ? { ...f, votes: f.votes + 1 } : f)));
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400"
                  >
                    👍
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
