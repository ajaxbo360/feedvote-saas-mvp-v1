'use client';

import { WidgetIntegrationDocs } from './widget-integration-docs';

interface WidgetIntegrationSnippetsProps {
  projectId: string;
  apiKey: {
    key_value: string;
    key_type: string;
  };
}

export function WidgetIntegrationSnippets({ projectId }: WidgetIntegrationSnippetsProps) {
  return <WidgetIntegrationDocs projectSlug={projectId} />;
}
