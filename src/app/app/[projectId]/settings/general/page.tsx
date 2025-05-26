'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';
import { Search, Shield, Info, Lock, CheckIcon, CopyIcon, RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Layout, Globe, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCsrfHeader } from '@/utils/csrf-protection';
import { ApiKey } from '@/types/api-keys';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/utils/supabase/client';
import { getProjectUrl } from '@/utils/url-helper';

// Sample data for the charts - replace with real data from your API
const analyticsData = [
  { date: '2024-01', value: 40 },
  { date: '2024-02', value: 120 },
  { date: '2024-03', value: 90 },
  { date: '2024-04', value: 180 },
  { date: '2024-05', value: 250 },
];

export default function GeneralSettingsPage() {
  const params = useParams<{ projectId: string }>();
  const slug = params.projectId; // This is actually the slug from the URL
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Config & Theming state
  const [config, setConfig] = useState({
    apiSecret: 'sk_live_1234567890abcdef',
    logoUrl: 'https://placehold.co/120x40',
    name: 'Project Name',
    website: 'https://example.com',
    slug: 'project-slug',
    metaDescription: 'Meta description for SEO...',
    primaryColorLight: '#2563eb',
    primaryColorDark: '#60a5fa',
    hidePoweredBy: false,
  });
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Security & Privacy state
  const [securityConfig, setSecurityConfig] = useState({
    jwtAuth: false,
    preventAnonymous: false,
    privateBoard: false,
  });

  // Preview state
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  // Regenerate API Key state
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Fetch project ID from slug
  useEffect(() => {
    async function fetchProjectId() {
      try {
        const supabase = createClient();
        const { data: project, error } = await supabase.from('projects').select('id').eq('slug', slug).single();

        if (error || !project) {
          throw new Error('Project not found');
        }

        setProjectId(project.id);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project. Please try again.',
          variant: 'destructive',
        });
      }
    }

    if (slug) {
      fetchProjectId();
    }
  }, [slug, toast]);

  // Fetch API keys when we have the project ID
  useEffect(() => {
    async function fetchApiKeys() {
      try {
        setLoadingKeys(true);

        // First ensure we have an authenticated session
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('Not authenticated');
        }

        if (!projectId) {
          throw new Error('Project ID not available');
        }

        const response = await fetch(`/api/api-keys?project_id=${projectId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch API keys');
        }

        const data = await response.json();
        setApiKeys(data.data);
      } catch (error) {
        console.error('Error fetching API keys:', error);
        toast({
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Failed to fetch API keys. Please ensure you are logged in.',
          variant: 'destructive',
        });
      } finally {
        setLoadingKeys(false);
      }
    }

    if (projectId) {
      fetchApiKeys();
    }
  }, [projectId, toast]);

  // Get the secret API key
  const secretKey = apiKeys.find((key) => key.key_type === 'secret');

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);

    toast({
      title: 'Settings saved',
      description: 'Your project settings have been updated successfully.',
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    // TODO: Call API to delete project
    setTimeout(() => {
      setDeleting(false);
      setShowDeleteModal(false);
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted.',
      });
      // TODO: Redirect user after deletion
    }, 1500);
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      newValue = e.target.checked;
    }
    setConfig((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCopySecret = async () => {
    if (!secretKey?.key_value) return;

    try {
      await navigator.clipboard.writeText(secretKey.key_value);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
      toast({
        title: 'Copied!',
        description: 'API Secret Key copied to clipboard',
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy API key to clipboard',
        variant: 'destructive',
      });
    }
  };

  const handleRegenerateKey = async () => {
    if (!secretKey) return;

    setRegenerating(true);
    try {
      const response = await fetch(`/api/api-keys/${secretKey.id}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await getCsrfHeader()),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate API key');
      }

      const { data } = await response.json();

      // Update the API keys list with the new key
      setApiKeys((prev) => prev.map((key) => (key.id === data.id ? data : key)));

      toast({
        title: 'API Key Regenerated',
        description: 'Your new API Secret Key has been generated.',
      });
    } catch (error) {
      console.error('Error regenerating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate API key. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRegenerating(false);
      setShowRegenerateModal(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      {/* Security Section */}
      <Card className="border-2 border-green-500/20">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            <CardTitle>Security & Privacy</CardTitle>
          </div>
          <CardDescription>Protect your board from spam and unauthorized access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-green-500/5 p-4 border border-green-500/20">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-500 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Your board is currently vulnerable to spam and posts from unverified accounts. We recommend enabling one
                of the security mechanisms below.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-base">JWT Authentication</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Only allow users with valid JWT tokens to post, vote and comment.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">Require JWT token for all interactions</p>
              </div>
              <Switch
                checked={securityConfig.jwtAuth}
                onCheckedChange={(checked) => setSecurityConfig((prev) => ({ ...prev, jwtAuth: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-base">Prevent Anonymous Access</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Block anonymous sessions from posting, voting and commenting.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">Users must be logged in to interact</p>
              </div>
              <Switch
                checked={securityConfig.preventAnonymous}
                onCheckedChange={(checked) => setSecurityConfig((prev) => ({ ...prev, preventAnonymous: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-base">Private Board</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Make your board private. Public links will be disabled.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">Only authorized users can access the board</p>
              </div>
              <Switch
                checked={securityConfig.privateBoard}
                onCheckedChange={(checked) => setSecurityConfig((prev) => ({ ...prev, privateBoard: checked }))}
              />
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-base mb-2 block">Whitelisted URLs</Label>
            <div className="space-y-2">
              <Input
                placeholder="Enter comma-separated URLs (e.g., example.com, app.example.com)"
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to allow all domains. Add base URLs to restrict widget embedding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">Track your project's performance and engagement</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,350</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,274</div>
              <p className="text-xs text-muted-foreground">+10.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upvotes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4,123</div>
              <p className="text-xs text-muted-foreground">+35.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">+12.3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Feedback Activity</CardTitle>
            <CardDescription>Your project's feedback activity over time</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                    className="text-xs"
                  />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                <span className="font-bold text-muted-foreground">
                                  {new Date(payload[0].payload.date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">Feedback</span>
                                <span className="font-bold">{payload[0].value}</span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    className="stroke-primary fill-primary"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Project Settings */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Project Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your project configuration and appearance</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Basic information about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={config.name}
                    onChange={handleConfigChange}
                    placeholder="My Awesome Project"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={config.website}
                    onChange={handleConfigChange}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Project URL</Label>
                  <div className="space-y-2">
                    <Input
                      id="slug"
                      name="slug"
                      value={config.slug}
                      disabled
                      className="h-12 px-4 bg-muted font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Your project is available at:{' '}
                      <a
                        href={getProjectUrl(config.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        https://{config.slug}.feedvote.com/board
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Project slugs cannot be changed after creation to maintain URL stability.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={config.metaDescription}
                    onChange={handleConfigChange}
                    placeholder="A brief description of your project..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how your feedback widget looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Section */}
                <div className="space-y-4">
                  <Label htmlFor="logoUrl">Logo</Label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <Input
                        id="logoUrl"
                        name="logoUrl"
                        type="url"
                        value={config.logoUrl}
                        onChange={handleConfigChange}
                        placeholder="https://example.com/logo.png"
                      />
                      <p className="text-sm text-muted-foreground">
                        Recommended size: 120x40px. Supports PNG, JPG, or SVG.
                      </p>
                    </div>
                    <div className="w-[120px] h-[40px] bg-white dark:bg-gray-800 border rounded-md p-2 flex items-center justify-center">
                      <img src={config.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>
                </div>

                {/* Color Theme Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Theme Preview</Label>
                    <div className="inline-flex h-11 items-center gap-[8px] justify-center rounded-sm bg-background px-[6px] py-[6px] text-muted-foreground border-border border">
                      <button
                        className={cn(
                          'inline-flex items-center justify-center whitespace-nowrap rounded-xs h-9 px-4 py-2 text-sm font-medium cursor-pointer ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:bg-muted/50',
                          previewMode === 'light' ? 'bg-foreground/5 text-foreground shadow-sm' : '',
                        )}
                        onClick={() => setPreviewMode('light')}
                      >
                        Light
                      </button>
                      <button
                        className={cn(
                          'inline-flex items-center justify-center whitespace-nowrap rounded-xs h-9 px-4 py-2 text-sm font-medium cursor-pointer ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background hover:bg-muted/50',
                          previewMode === 'dark' ? 'bg-foreground/5 text-foreground shadow-sm' : '',
                        )}
                        onClick={() => setPreviewMode('dark')}
                      >
                        Dark
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColorLight">Primary Color (Light)</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Input
                            id="primaryColorLight"
                            name="primaryColorLight"
                            type="text"
                            value={config.primaryColorLight}
                            onChange={handleConfigChange}
                            className="font-mono"
                          />
                        </div>
                        <Input
                          type="color"
                          value={config.primaryColorLight}
                          onChange={(e) =>
                            handleConfigChange({
                              target: { name: 'primaryColorLight', value: e.target.value },
                            } as any)
                          }
                          className="w-10 h-10 p-1 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryColorDark">Primary Color (Dark)</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Input
                            id="primaryColorDark"
                            name="primaryColorDark"
                            type="text"
                            value={config.primaryColorDark}
                            onChange={handleConfigChange}
                            className="font-mono"
                          />
                        </div>
                        <Input
                          type="color"
                          value={config.primaryColorDark}
                          onChange={(e) =>
                            handleConfigChange({
                              target: { name: 'primaryColorDark', value: e.target.value },
                            } as any)
                          }
                          className="w-10 h-10 p-1 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme Preview */}
                  <div
                    className={`p-6 rounded-lg border ${previewMode === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-sm`}
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`text-lg font-medium ${previewMode === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        >
                          Preview
                        </h3>
                        <div className="space-x-2">
                          <Button
                            size="sm"
                            style={{
                              background: `linear-gradient(to right, ${
                                previewMode === 'dark' ? config.primaryColorDark : config.primaryColorLight
                              }, ${
                                previewMode === 'dark'
                                  ? adjustColor(config.primaryColorDark, 20)
                                  : adjustColor(config.primaryColorLight, 20)
                              })`,
                            }}
                            className="text-white hover:opacity-90 transition-opacity"
                          >
                            Primary Button
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            style={{
                              borderColor: previewMode === 'dark' ? config.primaryColorDark : config.primaryColorLight,
                              color: previewMode === 'dark' ? config.primaryColorDark : config.primaryColorLight,
                            }}
                            className="hover:opacity-90 transition-opacity"
                          >
                            Secondary Button
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            background: `linear-gradient(to right, ${
                              previewMode === 'dark' ? config.primaryColorDark : config.primaryColorLight
                            }, ${
                              previewMode === 'dark'
                                ? adjustColor(config.primaryColorDark, 20)
                                : adjustColor(config.primaryColorLight, 20)
                            })`,
                          }}
                        />
                        <div
                          className="h-2 rounded-full opacity-60"
                          style={{
                            background: `linear-gradient(to right, ${
                              previewMode === 'dark' ? config.primaryColorDark : config.primaryColorLight
                            }, ${
                              previewMode === 'dark'
                                ? adjustColor(config.primaryColorDark, 20)
                                : adjustColor(config.primaryColorLight, 20)
                            })`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Branding Option */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hidePoweredBy"
                    checked={config.hidePoweredBy}
                    onCheckedChange={(checked) =>
                      handleConfigChange({
                        target: { name: 'hidePoweredBy', type: 'checkbox', checked },
                      } as any)
                    }
                  />
                  <Label htmlFor="hidePoweredBy">Hide "Powered by FeedVote" badge</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Your project's API credentials and integration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API Secret Key</Label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        {loadingKeys ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Input
                            id="apiSecret"
                            name="apiSecret"
                            type="text"
                            value={secretKey?.key_value || 'No API key found'}
                            readOnly
                            className="font-mono text-sm bg-muted pr-24"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 hover:bg-muted/50"
                          onClick={handleCopySecret}
                          disabled={loadingKeys || !secretKey?.key_value}
                        >
                          {copiedSecret ? (
                            <span className="flex items-center gap-1 text-green-500">
                              <CheckIcon className="h-3 w-3" />
                              Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <CopyIcon className="h-3 w-3" />
                              Copy
                            </span>
                          )}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        onClick={() => setShowRegenerateModal(true)}
                        disabled={loadingKeys || !secretKey}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        <p>Keep this key secure and never share it publicly. Used to authenticate your API requests.</p>
                        {secretKey && (
                          <p>
                            Created:{' '}
                            {new Date(secretKey.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                            {secretKey.last_used_at && (
                              <>
                                {' '}
                                · Last used:{' '}
                                {new Date(secretKey.last_used_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
              Delete Project
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your project and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate API Key Dialog */}
      <Dialog open={showRegenerateModal} onOpenChange={setShowRegenerateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate API Secret Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to regenerate your API Secret Key? Your old key will stop working immediately and
              you'll need to update any services using it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegenerateModal(false)} disabled={regenerating}>
              Cancel
            </Button>
            <Button
              onClick={handleRegenerateKey}
              disabled={regenerating}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
            >
              {regenerating ? 'Regenerating...' : 'Yes, Regenerate Key'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
