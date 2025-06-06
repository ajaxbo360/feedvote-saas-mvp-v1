// API Key Utilities
import { createClient } from '@/utils/supabase/server';
import { ApiKey, ApiKeyType } from '@/types/api-keys';
import { cookies } from 'next/headers';

/**
 * Validate an API key by checking if it exists and is active
 * @param keyValue The API key value to validate
 * @returns Object containing validation result and key info if valid
 */
export async function validateApiKey(keyValue: string): Promise<{
  isValid: boolean;
  apiKey?: ApiKey;
  error?: string;
}> {
  try {
    if (!keyValue) {
      return { isValid: false, error: 'API key is required' };
    }

    const supabase = await createClient();

    // Query the API key
    const { data, error } = await supabase
      .from('project_api_keys')
      .select('*')
      .eq('key_value', keyValue)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { isValid: false, error: 'Invalid or inactive API key' };
    }

    // Update the last_used_at timestamp
    await supabase.from('project_api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id);

    return { isValid: true, apiKey: data as ApiKey };
  } catch (error) {
    console.error('Error validating API key:', error);
    return { isValid: false, error: 'Error validating API key' };
  }
}

/**
 * Extract API key from request headers
 * @param headers Request headers
 * @returns The API key value or null if not found
 */
export function extractApiKeyFromHeaders(headers: Headers): string | null {
  // Check Authorization header first (Bearer token format)
  const authHeader = headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check custom X-API-Key header
  const apiKeyHeader = headers.get('X-API-Key');
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  return null;
}

/**
 * Generate a new API key with proper formatting
 * @param keyType The type of API key to generate
 * @returns A formatted API key string
 */
export function generateApiKey(keyType: ApiKeyType): string {
  // This is a client-side fallback, server should use the SQL function
  const prefix = keyType === 'public' ? 'pub_' : keyType === 'secret' ? 'sec_' : 'mob_';

  // Generate a random string (simplified version)
  const randomBytes = new Uint8Array(24);
  crypto.getRandomValues(randomBytes);
  const randomPart = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${prefix}${randomPart}`;
}

/**
 * Check if a user has permission to manage API keys for a project
 * @param projectId The project ID to check
 * @returns Whether the user has permission
 */
export async function hasApiKeyManagementPermission(projectId: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if the user owns the project
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    return !!data && !error;
  } catch (error) {
    console.error('Error checking API key permissions:', error);
    return false;
  }
}

/**
 * Generate code snippets for different platforms
 * @param projectId The project ID
 * @param apiKey The API key to use
 * @returns Code snippets for different platforms
 */
export function generateCodeSnippets(projectId: string, apiKey: string): Record<string, string> {
  return {
    javascript: `<div id="your-container-id-here"></div>
<script
  src="https://feedvote.com/widget/widget.js" 
  slug="${projectId}"
  user_id="<optional>"
  user_email="<optional>"
  user_name="<optional>"
  img_url="<optional>"
  onload="window.loadVotingBoard('your-container-id-here')"
></script>`,

    react: `import { useEffect } from 'react';

function FeedbackWidget() {
  useEffect(() => {
    // Load the FeedVote widget script
    const script = document.createElement('script');
    script.src = 'https://feedvote.com/widget/widget.js';
    script.async = true;
    script.dataset.apiKey = '${apiKey}';
    script.dataset.userId = 'YOUR_USER_ID'; // Optional
    script.dataset.userEmail = 'user@example.com'; // Optional
    
    script.onload = () => {
      window.FeedVote.init({
        containerId: 'feedvote-container',
        // Additional configuration options
      });
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return <div id="feedvote-container" />;
}`,

    flutter: `import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'dart:convert';

class FeedbackWidget extends StatelessWidget {
  final String apiKey = '${apiKey}';
  final String userId = 'YOUR_USER_ID'; // Optional
  
  @override
  Widget build(BuildContext context) {
    final String html = '''
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <div id="feedvote-container"></div>
          <script src="https://feedvote.com/widget/widget.js"></script>
          <script>
            window.FeedVote.init({
              apiKey: '$apiKey',
              userId: '$userId',
              containerId: 'feedvote-container'
            });
          </script>
        </body>
      </html>
    ''';
    
    return WebView(
      initialUrl: Uri.dataFromString(
        html,
        mimeType: 'text/html',
        encoding: Encoding.getByName('utf-8')
      ).toString(),
      javascriptMode: JavascriptMode.unrestricted,
    );
  }
}`,

    swift: `import SwiftUI
import WebKit

struct FeedbackView: UIViewRepresentable {
    let apiKey = "${apiKey}"
    let userId = "YOUR_USER_ID" // Optional
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let html = """
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body>
            <div id="feedvote-container"></div>
            <script src="https://feedvote.com/widget/widget.js"></script>
            <script>
              window.FeedVote.init({
                apiKey: '\(apiKey)',
                userId: '\(userId)',
                containerId: 'feedvote-container'
              });
            </script>
          </body>
        </html>
        """
        
        webView.loadHTMLString(html, baseURL: nil)
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: FeedbackView
        
        init(_ parent: FeedbackView) {
            self.parent = parent
        }
    }
}`,
  };
}
