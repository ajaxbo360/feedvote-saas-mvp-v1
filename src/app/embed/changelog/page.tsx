'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ChangelogItem {
  id: string;
  title: string;
  description: string;
  release_date: string;
  version: string;
}

export default function ChangelogEmbed() {
  const searchParams = useSearchParams();
  const [changelog, setChangelog] = useState<ChangelogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = searchParams.get('slug');
  const colorMode = searchParams.get('color_mode') || 'light';
  const variant = searchParams.get('variant') || 'v1';

  useEffect(() => {
    async function fetchChangelog() {
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

        // Then fetch changelog items
        const { data: changelogData, error: changelogError } = await supabase
          .from('changelog')
          .select('*')
          .eq('project_id', projectData.id)
          .order('release_date', { ascending: false });

        if (changelogError) {
          throw changelogError;
        }

        setChangelog(changelogData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load changelog');
      } finally {
        setLoading(false);
      }
    }

    fetchChangelog();
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
        <div className="max-w-3xl mx-auto">
          {changelog.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No changelog entries yet</div>
          ) : (
            <div className="space-y-8">
              {changelog.map((item) => (
                <div
                  key={item.id}
                  className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-[2px] before:bg-gray-200 dark:before:bg-gray-700"
                >
                  <div className="absolute left-0 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-500"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.release_date).toLocaleDateString()}
                        </span>
                        {item.version && (
                          <span className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 rounded">
                            v{item.version}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
