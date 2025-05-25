'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';
import { Inbox } from 'lucide-react';
import { redirect } from 'next/navigation';

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'done';
  votes: number;
  created_at: string;
}

interface PageProps {
  params: {
    projectId: string;
  };
}

export default function BoardPage({ params }: PageProps) {
  const { projectId } = params;
  const slug = projectId; // The URL param is actually the slug
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'open' | 'done'>('open');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement feature request creation
      // This is where you'll add the API call to create a new feature request

      toast({
        description: 'Feature request created successfully!',
      });

      setCreateModalOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setEmail('');
      setAttachedFile(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to create feature request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Feature Requests</h1>
          <Button onClick={() => setCreateModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
            + Add
          </Button>
        </div>

        <div className="px-8">
          <div className="flex gap-2 border-b">
            <button
              className={`px-4 py-2 ${
                activeTab === 'open' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('open')}
            >
              Open
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'done' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
              }`}
              onClick={() => setActiveTab('done')}
            >
              Done
            </button>
          </div>
        </div>

        <div className="flex-1 px-8 py-6">
          {featureRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Inbox className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No posts yet.</h3>
              <p className="text-gray-500">There are no features requested for this app.</p>
            </div>
          ) : (
            <div className="space-y-4">{/* Feature requests will be mapped here */}</div>
          )}
        </div>

        {/* Create Feature Request Modal */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create a feature request</DialogTitle>
              <DialogDescription>Share your idea for a new feature</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My awesome feature request"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Input description here"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email <span className="text-gray-500">(Optional)</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email to receive notifications on this request"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Attach File</label>
                <div className="border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".jpeg,.jpg,.png,.svg"
                    onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Click to upload or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 mt-1">.jpeg, .jpg, .png, .svg up to 5MB</p>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white">
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
