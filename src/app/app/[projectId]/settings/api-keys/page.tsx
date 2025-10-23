'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon, KeyIcon, CopyIcon, TrashIcon, CheckIcon } from 'lucide-react';
import { ApiKey } from '@/types/api-keys';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { CreateApiKeyDialog } from '@/components/api-keys/create-api-key-dialog';
import { WidgetIntegrationSnippets } from '@/components/api-keys/widget-integration-snippets';
import { getCsrfHeader } from '@/utils/csrf-protection';
import { createClient } from '@/utils/supabase/client';

// API client functions
async function listApiKeys(projectId: string): Promise<ApiKey[]> {
  const response = await fetch(`/api/api-keys?project_id=${projectId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch API keys');
  }
  const data = await response.json();
  return data.data;
}

async function deleteApiKey(id: string): Promise<void> {
  const response = await fetch(`/api/api-keys/${id}`, {
    method: 'DELETE',
    headers: {
      ...(await getCsrfHeader()),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete API key');
  }
}

export default function ApiKeysPage() {
  const params = useParams<{ projectId: string }>();
  const slug = params.projectId; // This is actually the slug from the URL
  const { toast } = useToast();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Function to fetch API keys
  const fetchApiKeys = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const keys = await listApiKeys(projectId);
      setApiKeys(keys);

      // Set the first public key as the selected key for widget integration
      const publicKey = keys.find((k) => k.key_type === 'public' && k.is_active);
      if (publicKey) {
        setSelectedApiKey(publicKey);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      setError('Failed to load API keys. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, toast]);

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
        setError('Failed to load project. Please try again.');
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
    fetchApiKeys();
  }, [projectId, fetchApiKeys]);

  const handleCreateSuccess = (newKey: ApiKey) => {
    setApiKeys((prev) => [newKey, ...prev]);

    // If the new key is public and we don't have a selected key yet, select it
    if (newKey.key_type === 'public' && !selectedApiKey) {
      setSelectedApiKey(newKey);
    }
  };

  const handleCopyKey = (key: ApiKey) => {
    navigator.clipboard.writeText(key.key_value);
    setCopiedKeyId(key.id);
    setTimeout(() => setCopiedKeyId(null), 2000);

    toast({
      title: 'Copied!',
      description: 'API key copied to clipboard',
    });
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteApiKey(id);
      setApiKeys((prev) => prev.filter((key) => key.id !== id));

      // If the deleted key is the selected one, find another public key
      if (selectedApiKey && selectedApiKey.id === id) {
        const newSelectedKey = apiKeys.find((k) => k.id !== id && k.key_type === 'public' && k.is_active);
        setSelectedApiKey(newSelectedKey || null);
      }

      toast({
        title: 'Success',
        description: 'API key deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete API key',
        variant: 'destructive',
      });
    }
  };

  const handleSelectKeyForWidget = (key: ApiKey) => {
    if (key.key_type !== 'public') {
      toast({
        title: 'Caution',
        description: 'Only public API keys should be used for widget integration',
        variant: 'destructive',
      });
    }

    setSelectedApiKey(key);
  };

  // Filter keys based on active tab
  const filteredKeys = activeTab === 'all' ? apiKeys : apiKeys.filter((key) => key.key_type === activeTab);

  function getKeyTypeColor(type: string) {
    switch (type) {
      case 'public':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'secret':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'mobile':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return 'Never';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  return (
    <div className="container space-y-8 py-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage API keys for integrating your project with external applications.
          </p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          <span>Create API Key</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Keys</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
          <TabsTrigger value="secret">Secret</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b">
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-72" />
                      </div>
                      <Skeleton className="h-9 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
              <CardHeader>
                <CardTitle>Error Loading API Keys</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (projectId) {
                      fetchApiKeys();
                    }
                  }}
                >
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : filteredKeys.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No API Keys Found</CardTitle>
                <CardDescription>
                  {activeTab === 'all'
                    ? "You haven't created any API keys yet."
                    : `You don't have any ${activeTab} API keys.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="flex items-center gap-2" onClick={() => setCreateDialogOpen(true)}>
                  <PlusIcon className="h-4 w-4" />
                  <span>Create Your First API Key</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  {activeTab === 'all' ? 'Manage all your API keys' : `Manage your ${activeTab} API keys`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex flex-col md:flex-row justify-between gap-4 pb-6 border-b last:border-0"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{key.name}</h3>
                          <Badge className={`${getKeyTypeColor(key.key_type)} capitalize`}>{key.key_type}</Badge>
                          {!key.is_active && (
                            <Badge variant="outline" className="text-red-500 border-red-200">
                              Inactive
                            </Badge>
                          )}
                          {selectedApiKey && selectedApiKey.id === key.id && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400"
                            >
                              Selected for Widget
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {key.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <KeyIcon className="h-3 w-3" />
                            {key.key_value.substring(0, 8)}•••••••
                          </span>
                          <span className="text-xs text-muted-foreground">Created {formatDate(key.created_at)}</span>
                          {key.last_used_at && (
                            <span className="text-xs text-muted-foreground">
                              Last used {formatDate(key.last_used_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-center">
                        {key.key_type === 'public' && (
                          <Button
                            size="sm"
                            variant={selectedApiKey && selectedApiKey.id === key.id ? 'default' : 'outline'}
                            className="h-8 px-2"
                            onClick={() => handleSelectKeyForWidget(key)}
                          >
                            Use for Widget
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 flex gap-1"
                          onClick={() => handleCopyKey(key)}
                        >
                          {copiedKeyId === key.id ? (
                            <CheckIcon className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <CopyIcon className="h-3.5 w-3.5" />
                          )}
                          <span className="md:inline hidden">{copiedKeyId === key.id ? 'Copied' : 'Copy'}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2 flex gap-1 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteKey(key.id)}
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                          <span className="md:inline hidden">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {projectId && selectedApiKey && (
        <div className="mt-8">
          <WidgetIntegrationSnippets projectId={projectId} apiKey={selectedApiKey} />
        </div>
      )}

      {projectId && (
        <CreateApiKeyDialog
          projectId={projectId}
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
