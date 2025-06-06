'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CopyIcon, CheckIcon, InfoIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

interface Parameter {
  name: string;
  description: string;
  type: 'required' | 'optional';
  example?: string;
}

interface WidgetDoc {
  title: string;
  description: string;
  parameters: Parameter[];
  snippet: (slug: string) => string;
}

const widgets: Record<string, WidgetDoc> = {
  'voting-board': {
    title: 'Voting Board',
    description: 'Embed a full voting board where users can view and vote on feature requests.',
    parameters: [
      {
        name: 'user_id',
        description: 'Unique identifier for the user in your application',
        type: 'optional',
        example: 'user_123',
      },
      {
        name: 'user_email',
        description: 'Email address of the user',
        type: 'optional',
        example: 'user@example.com',
      },
      {
        name: 'user_name',
        description: 'Display name of the user',
        type: 'optional',
        example: 'John Doe',
      },
      {
        name: 'img_url',
        description: "URL to the user's avatar image",
        type: 'optional',
        example: 'https://example.com/avatar.jpg',
      },
      {
        name: 'color_mode',
        description: 'Theme preference (light or dark)',
        type: 'optional',
        example: 'dark',
      },
      {
        name: 'token',
        description: 'JWT token for secure user identification',
        type: 'optional',
        example: 'eyJhbG...',
      },
    ],
    snippet: (slug) => `<div id="voting-board"></div>
<script
  src="https://feedvote.com/widget/widget.js"
  slug="${slug}"
  user_id="<Optional>"
  user_email="<Optional>"
  user_name="<Optional>"
  img_url="<Optional>"
  color_mode="light"
  token="<Optional>"
  onload="window.loadVotingBoard('voting-board')"
></script>`,
  },
  'suggest-feature': {
    title: 'Suggest Feature Button',
    description: 'Add a button that opens a popup form for users to suggest new features.',
    parameters: [
      {
        name: 'user_id',
        description: 'Unique identifier for the user in your application',
        type: 'optional',
        example: 'user_123',
      },
      {
        name: 'user_email',
        description: 'Email address of the user',
        type: 'optional',
        example: 'user@example.com',
      },
      {
        name: 'user_name',
        description: 'Display name of the user',
        type: 'optional',
        example: 'John Doe',
      },
      {
        name: 'user_spend',
        description: 'Amount spent by the user (for prioritization)',
        type: 'optional',
        example: '199.99',
      },
    ],
    snippet: (slug) => `<button id="suggest-feature-btn">Suggest a feature</button>
<script
  src="https://feedvote.com/widget/widget.js"
  slug="${slug}"
  user_id="<Optional>"
  user_email="<Optional>"
  user_name="<Optional>"
  user_spend="<Optional>"
></script>
<script>
  document.getElementById('suggest-feature-btn').addEventListener('click', function() {
    window.openFeatureRequestPopup();
  });
</script>`,
  },
  roadmap: {
    title: 'Roadmap View',
    description: 'Display your product roadmap showing planned, in-progress, and completed features.',
    parameters: [
      {
        name: 'color_mode',
        description: 'Theme preference (light or dark)',
        type: 'optional',
        example: 'dark',
      },
      {
        name: 'variant',
        description: 'Visual style variant (v1 or v2)',
        type: 'optional',
        example: 'v2',
      },
    ],
    snippet: (slug) => `<div id="roadmap"></div>
<script
  src="https://feedvote.com/widget/widget.js"
  slug="${slug}"
  color_mode="light"
  variant="v1"
  onload="window.loadRoadmap('roadmap')"
></script>`,
  },
  changelog: {
    title: 'Changelog',
    description: 'Show your product updates and feature releases in a beautiful timeline.',
    parameters: [
      {
        name: 'color_mode',
        description: 'Theme preference (light or dark)',
        type: 'optional',
        example: 'dark',
      },
      {
        name: 'variant',
        description: 'Visual style variant (v1 or v2)',
        type: 'optional',
        example: 'v2',
      },
    ],
    snippet: (slug) => `<div id="changelog"></div>
<script
  src="https://feedvote.com/widget/widget.js"
  slug="${slug}"
  color_mode="light"
  variant="v1"
  onload="window.loadChangelog('changelog')"
></script>`,
  },
};

interface WidgetIntegrationDocsProps {
  projectSlug: string;
}

export function WidgetIntegrationDocs({ projectSlug }: WidgetIntegrationDocsProps) {
  const { toast } = useToast();
  const [copiedWidget, setCopiedWidget] = useState<string | null>(null);

  const handleCopy = async (code: string, widgetType: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedWidget(widgetType);
      setTimeout(() => setCopiedWidget(null), 2000);
      toast({
        title: 'Copied!',
        description: 'Widget code copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy code to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Integration</CardTitle>
        <CardDescription>Choose a widget type below and copy the code to embed it in your application</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="voting-board" className="w-full">
          <TabsList className="mb-4">
            {Object.entries(widgets).map(([key, widget]) => (
              <TabsTrigger key={key} value={key}>
                {widget.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(widgets).map(([key, widget]) => (
            <TabsContent key={key} value={key}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{widget.title}</h3>
                  <p className="text-muted-foreground">{widget.description}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <InfoIcon className="h-4 w-4" />
                    Available Parameters
                  </h4>
                  <div className="grid gap-3">
                    {widget.parameters.map((param) => (
                      <div key={param.name} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">{param.name}</code>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                param.type === 'required' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {param.type}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{param.description}</p>
                          {param.example && (
                            <code className="mt-1 text-xs text-muted-foreground block">Example: {param.example}</code>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mt-6">
                  <pre className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 overflow-x-auto">
                    <code className="text-sm font-mono">{widget.snippet(projectSlug)}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(widget.snippet(projectSlug), key)}
                  >
                    {copiedWidget === key ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
