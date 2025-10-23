'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

interface FormData {
  title: string;
  description: string;
}

function SuggestFeatureContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const slug = searchParams.get('slug');
  const userId = searchParams.get('user_id');
  const userEmail = searchParams.get('user_email');
  const userName = searchParams.get('user_name');
  const imgUrl = searchParams.get('img_url');
  const colorMode = searchParams.get('color_mode') || 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/widget/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          project_slug: slug,
          user_id: userId,
          user_email: userEmail,
          user_name: userName,
          img_url: imgUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSuccess(true);
      setFormData({ title: '', description: '' });

      // Close the popup after 2 seconds
      setTimeout(() => {
        window.close();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 ${colorMode === 'dark' ? 'dark' : ''}`}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Suggest a Feature</h1>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              Thank you for your suggestion! We'll review it shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700"
                placeholder="What would you like to suggest?"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-700"
                rows={4}
                placeholder="Please provide more details about your suggestion..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg bg-teal-500 text-white hover:bg-teal-600 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SuggestFeatureEmbed() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      }
    >
      <SuggestFeatureContent />
    </Suspense>
  );
}
