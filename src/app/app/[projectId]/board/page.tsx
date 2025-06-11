'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Inbox,
  ChevronUp,
  MessageSquare,
  Building2,
  DollarSign,
  Clock,
  TrendingUp,
  Brain,
  Users,
  AlertTriangle,
} from 'lucide-react';
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
  // Enhanced properties from our roadmap
  priority?: 'low' | 'medium' | 'high' | 'critical';
  customerSegment?: 'individual' | 'startup' | 'enterprise';
  revenueImpact?: 'low' | 'medium' | 'high';
  effortEstimate?: 'S' | 'M' | 'L' | 'XL';
  trendingScore?: number;
  aiSuggestion?: string;
  internalDiscussions?: number;
  assignedTo?: string | null;
  customerHealth?: 'good' | 'at_risk' | 'unhappy';
  similarRequests?: number;
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

  // Enhanced sample feature requests with new properties
  const [featureRequests] = useState<FeatureRequest[]>([
    {
      id: '1',
      title: 'This is an in-progress feature request',
      description: 'Show your users that you listen and care for them',
      status: 'in_progress',
      votes: 8,
      priority: 'high',
      customerSegment: 'enterprise',
      revenueImpact: 'high',
      effortEstimate: 'M',
      trendingScore: 40,
      aiSuggestion: 'Prioritize this - high customer impact',
      internalDiscussions: 3,
      assignedTo: 'dev-team',
      customerHealth: 'good',
      similarRequests: 2,
    },
    {
      id: '2',
      title: 'This is a sample request',
      description: 'Drag this around to update the status',
      status: 'pending',
      votes: 5,
      priority: 'medium',
      customerSegment: 'startup',
      revenueImpact: 'medium',
      effortEstimate: 'S',
      trendingScore: 15,
      aiSuggestion: 'Quick win - low effort, good impact',
      internalDiscussions: 1,
      assignedTo: null,
      customerHealth: 'good',
      similarRequests: 0,
    },
    {
      id: '3',
      title: 'This is another sample request',
      description: 'You can delete this by clicking on the three dots on the right portion of this card',
      status: 'pending',
      votes: 4,
      priority: 'low',
      customerSegment: 'individual',
      revenueImpact: 'low',
      effortEstimate: 'L',
      trendingScore: -10,
      aiSuggestion: 'Consider for future releases',
      internalDiscussions: 0,
      assignedTo: null,
      customerHealth: 'at_risk',
      similarRequests: 1,
    },
    {
      id: '4',
      title: 'Critical security enhancement needed',
      description: 'Multiple enterprise customers requesting enhanced security features',
      status: 'pending',
      votes: 12,
      priority: 'critical',
      customerSegment: 'enterprise',
      revenueImpact: 'high',
      effortEstimate: 'XL',
      trendingScore: 85,
      aiSuggestion: 'Critical - enterprise deals depend on this',
      internalDiscussions: 7,
      assignedTo: 'security-team',
      customerHealth: 'unhappy',
      similarRequests: 5,
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

  // Helper functions for enhanced UI
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'high':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-950';
      case 'medium':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950';
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-950';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getCustomerSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'enterprise':
        return <Building2 className="h-4 w-4" />;
      case 'startup':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRevenueImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCustomerHealthColor = (health: string) => {
    switch (health) {
      case 'unhappy':
        return 'text-red-600 dark:text-red-400';
      case 'at_risk':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getCustomerHealthIcon = (health: string) => {
    switch (health) {
      case 'unhappy':
        return '😞';
      case 'at_risk':
        return '⚠️';
      default:
        return '😊';
    }
  };

  if (!user || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Feature Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Smart prioritization • AI insights • Team collaboration
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)} size="sm" className="gradient-button">
            + Add Request
          </Button>
        </div>

        {/* Enhanced Tabs with Counters */}
        <div className="flex gap-2 border-b">
          <button
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === 'open'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('open')}
          >
            Open
            <Badge variant="secondary" className="text-xs">
              {featureRequests.filter((r) => r.status !== 'approved').length}
            </Badge>
          </button>
          <button
            className={`px-4 py-2 flex items-center gap-2 ${
              activeTab === 'done'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('done')}
          >
            Done
            <Badge variant="secondary" className="text-xs">
              {featureRequests.filter((r) => r.status === 'approved').length}
            </Badge>
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
            featureRequests
              .filter((request) =>
                activeTab === 'open' ? request.status !== 'approved' : request.status === 'approved',
              )
              .map((request) => (
                <Card
                  key={request.id}
                  className={`p-4 hover:shadow-md transition-all duration-200 border-l-4 ${getPriorityColor(request.priority || 'low')}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Voting Section */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <button className="hover:bg-accent rounded-full p-1 transition-colors">
                        <ChevronUp className="h-5 w-5 text-green-600" />
                      </button>
                      <span className="text-sm font-medium">{request.votes}</span>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Priority and Title */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getPriorityIcon(request.priority || 'low')}</span>
                            <span className="text-xs font-medium text-muted-foreground capitalize">
                              {request.priority || 'low'} Priority
                            </span>
                          </div>
                          <h3 className="font-medium leading-none">{request.title}</h3>
                        </div>

                        {/* Customer Health Alert */}
                        {request.customerHealth !== 'good' && (
                          <div
                            className={`flex items-center gap-1 text-xs ${getCustomerHealthColor(request.customerHealth || 'good')}`}
                          >
                            <span>{getCustomerHealthIcon(request.customerHealth || 'good')}</span>
                            <span className="capitalize">{request.customerHealth} customer</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">{request.description}</p>

                      {/* Enhanced Metadata Row */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {/* Customer Segment */}
                        <div className="flex items-center gap-1">
                          {getCustomerSegmentIcon(request.customerSegment || 'individual')}
                          <span className="capitalize">{request.customerSegment}</span>
                        </div>

                        {/* Revenue Impact */}
                        <div
                          className={`flex items-center gap-1 ${getRevenueImpactColor(request.revenueImpact || 'low')}`}
                        >
                          <DollarSign className="h-3 w-3" />
                          <span className="capitalize">{request.revenueImpact} Revenue Impact</span>
                        </div>

                        {/* Effort Estimate */}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Est. effort: {request.effortEstimate}</span>
                        </div>

                        {/* Trending Score */}
                        {request.trendingScore && request.trendingScore > 0 && (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{request.trendingScore}% trending</span>
                          </div>
                        )}

                        {/* Similar Requests */}
                        {request.similarRequests && request.similarRequests > 0 && (
                          <div className="flex items-center gap-1">
                            <span>{request.similarRequests} similar requests</span>
                          </div>
                        )}
                      </div>

                      {/* AI Suggestion */}
                      {request.aiSuggestion && (
                        <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                          <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div className="text-sm">
                            <span className="font-medium text-blue-700 dark:text-blue-300">AI suggests:</span>
                            <span className="text-blue-600 dark:text-blue-400 ml-1">{request.aiSuggestion}</span>
                          </div>
                        </div>
                      )}

                      {/* Bottom Row: Status, Discussions, Assignment */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Status Badge */}
                          <Badge
                            variant={
                              request.status === 'in_progress'
                                ? 'default'
                                : request.status === 'approved'
                                  ? 'default'
                                  : 'secondary'
                            }
                            className={`capitalize ${
                              request.status === 'approved'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : request.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : ''
                            }`}
                          >
                            {request.status.replace('_', ' ')}
                          </Badge>

                          {/* Internal Discussions */}
                          {request.internalDiscussions && request.internalDiscussions > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
                              <MessageSquare className="h-3 w-3" />
                              <span>{request.internalDiscussions} team comments</span>
                            </div>
                          )}
                        </div>

                        {/* Assignment */}
                        {request.assignedTo && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>@{request.assignedTo}</span>
                          </div>
                        )}
                      </div>
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
                <Button type="submit" disabled={loading} className="gradient-button">
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
