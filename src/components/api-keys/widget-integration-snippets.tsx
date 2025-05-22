'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ApiKey } from '@/types/api-keys';

interface WidgetIntegrationSnippetsProps {
  projectId: string;
  apiKey: ApiKey;
}

export function WidgetIntegrationSnippets({ projectId, apiKey }: WidgetIntegrationSnippetsProps) {
  const [activeTab, setActiveTab] = useState('javascript');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate code snippets for different platforms
  const snippets = {
    javascript: `<script>
  (function(w, d, s, o, f, js, fjs) {
    w['FeedVote-Widget'] = o;
    w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'feedvote', 'https://cdn.feedvote.app/widget.js'));
  
  feedvote('init', {
    apiKey: '${apiKey.key_value}',
    position: 'bottom-right',
    theme: 'light'
  });
</script>`,

    react: `import { useEffect } from 'react';

function initFeedVote() {
  (function(w, d, s, o, f, js, fjs) {
    w['FeedVote-Widget'] = o;
    w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'feedvote', 'https://cdn.feedvote.app/widget.js'));
  
  // @ts-ignore
  window.feedvote('init', {
    apiKey: '${apiKey.key_value}',
    position: 'bottom-right',
    theme: 'light'
  });
}

export function FeedVoteWidget() {
  useEffect(() => {
    initFeedVote();
    
    return () => {
      // Clean up if needed
    };
  }, []);
  
  return null; // This component doesn't render anything
}`,

    vue: `<!-- In your App.vue or main layout component -->
<template>
  <!-- Your app content -->
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.initFeedVote();
  },
  methods: {
    initFeedVote() {
      (function(w, d, s, o, f, js, fjs) {
        w['FeedVote-Widget'] = o;
        w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
      }(window, document, 'script', 'feedvote', 'https://cdn.feedvote.app/widget.js'));
      
      window.feedvote('init', {
        apiKey: '${apiKey.key_value}',
        position: 'bottom-right',
        theme: 'light'
      });
    }
  }
}
</script>`,

    flutter: `// In your Flutter app
import 'package:flutter/material.dart';
import 'dart:html' as html;

class FeedVoteWidget extends StatefulWidget {
  @override
  _FeedVoteWidgetState createState() => _FeedVoteWidgetState();
}

class _FeedVoteWidgetState extends State<FeedVoteWidget> {
  @override
  void initState() {
    super.initState();
    _initFeedVote();
  }

  void _initFeedVote() {
    final script = '''
      (function(w, d, s, o, f, js, fjs) {
        w['FeedVote-Widget'] = o;
        w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
      }(window, document, 'script', 'feedvote', 'https://cdn.feedvote.app/widget.js'));
      
      feedvote('init', {
        apiKey: '${apiKey.key_value}',
        position: 'bottom-right',
        theme: 'light'
      });
    ''';
    
    // Inject the script into the web page
    html.window.document.createElement('script')
      ..innerHtml = script
      ..id = 'feedvote-script';
    html.window.document.body?.append(script);
  }

  @override
  Widget build(BuildContext context) {
    // This widget doesn't render anything visible
    return SizedBox.shrink();
  }
}`,

    angular: `// In your app.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.initFeedVote();
  }

  initFeedVote() {
    (function(w: any, d: Document, s: string, o: string, f: string, js: HTMLElement, fjs: HTMLElement) {
      w['FeedVote-Widget'] = o;
      w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) };
      js = d.createElement(s) as HTMLElement;
      fjs = d.getElementsByTagName(s)[0] as HTMLElement;
      (js as HTMLScriptElement).id = o;
      (js as HTMLScriptElement).src = f;
      (js as HTMLScriptElement).async = true;
      fjs.parentNode?.insertBefore(js, fjs);
    }(window, document, 'script', 'feedvote', 'https://cdn.feedvote.app/widget.js'));
    
    (window as any).feedvote('init', {
      apiKey: '${apiKey.key_value}',
      position: 'bottom-right',
      theme: 'light'
    });
  }
}`,
  };

  const handleCopySnippet = (platform: string) => {
    navigator.clipboard.writeText(snippets[platform as keyof typeof snippets]);
    setCopiedSnippet(platform);
    setTimeout(() => setCopiedSnippet(null), 2000);

    toast({
      title: 'Copied!',
      description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} snippet copied to clipboard`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Widget Integration</CardTitle>
        <CardDescription>Add the FeedVote widget to your application using these code snippets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="vue">Vue</TabsTrigger>
            <TabsTrigger value="flutter">Flutter</TabsTrigger>
            <TabsTrigger value="angular">Angular</TabsTrigger>
          </TabsList>

          {Object.entries(snippets).map(([platform, code]) => (
            <TabsContent key={platform} value={platform} className="relative">
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-2"
                  onClick={() => handleCopySnippet(platform)}
                >
                  {copiedSnippet === platform ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">{code}</pre>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Configuration Options</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">apiKey</code>: Your API key for
                    authenticating with FeedVote
                  </li>
                  <li>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">position</code>: Widget position
                    (bottom-right, bottom-left, top-right, top-left)
                  </li>
                  <li>
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">theme</code>: Widget theme (light, dark,
                    auto)
                  </li>
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
