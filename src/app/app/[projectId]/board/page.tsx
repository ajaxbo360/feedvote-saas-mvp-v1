'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Inbox, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: {
    projectId: string;
  };
}

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'approved';
  votes: number;
}

export default function BoardPage({ params }: PageProps) {
  const { projectId } = params;
  const slug = projectId; // The URL param is actually the slug
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'open' | 'done'>('open');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  // Sample feature requests
  const [featureRequests] = useState<FeatureRequest[]>([
    {
      id: '1',
      title: 'This is an in-progress feature request',
      description: 'Show your users that you listen and care for them',
      status: 'in_progress',
      votes: 8,
    },
    {
      id: '2',
      title: 'This is a sample request',
      description: 'Drag this around to update the status',
      status: 'pending',
      votes: 5,
    },
    {
      id: '3',
      title: 'This is another sample request',
      description: 'You can delete this by clicking on the three dots on the right portion of this card',
      status: 'pending',
      votes: 4,
    },
    {
      id: '4',
      title: 'This is another sample request',
      description: 'You can delete this by clicking on the three dots on the right portion of this card',
      status: 'approved',
      votes: 2,
    },
  ]);

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
    <div className="container max-w-3xl mx-auto py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Feature Requests</h1>
          <Button onClick={() => setCreateModalOpen(true)} size="sm">
            + Add
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === 'open'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('open')}
          >
            Open
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'done'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('done')}
          >
            Done
          </button>
        </div>

        {/* Feature Requests List */}
        <div className="space-y-4">
          {featureRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">There are no features requested for this app.</p>
            </div>
          ) : (
            featureRequests.map((request) => (
              <Card key={request.id} className="p-4 hover:border-primary/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <button className="hover:bg-accent rounded-full p-1">
                      <ChevronUp className="h-5 w-5 text-primary" />
                    </button>
                    <span className="text-sm font-medium">{request.votes}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium leading-none mb-2">{request.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{request.description}</p>
                    <Badge
                      variant={
                        request.status === 'in_progress'
                          ? 'default'
                          : request.status === 'approved'
                            ? 'outline'
                            : 'secondary'
                      }
                      className="capitalize"
                    >
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
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
                  Email <span className="text-muted-foreground">(Optional)</span>
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
                <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".jpeg,.jpg,.png,.svg"
                    onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                    <p className="text-xs text-muted-foreground mt-1">.jpeg, .jpg, .png, .svg up to 5MB</p>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
