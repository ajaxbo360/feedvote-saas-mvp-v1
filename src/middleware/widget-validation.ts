import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { WidgetSettings } from '@/types/widget-settings';

export async function validateWidgetParameters(request: Request) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Project slug is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get project settings
    const { data: project, error } = await supabase
      .from('projects')
      .select('widget_settings')
      .eq('slug', slug)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const settings: WidgetSettings = project.widget_settings;

    // If anonymous feedback is not allowed, check for user parameters
    if (!settings.allowAnonymous) {
      const requiredParams = Object.entries(settings.userParameters)
        .filter(([_, config]) => config.required)
        .map(([param]) => param);

      for (const param of requiredParams) {
        const value = url.searchParams.get(param.toLowerCase());
        if (!value) {
          return NextResponse.json(
            { error: `${param} is required when anonymous feedback is disabled` },
            { status: 400 },
          );
        }
      }
    }

    // Validate domain if whitelisted domains are set
    const origin = request.headers.get('origin');
    if (settings.whitelistedDomains.length > 0 && origin) {
      const domain = new URL(origin).hostname;
      if (!settings.whitelistedDomains.some((d) => domain.endsWith(d))) {
        return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
      }
    }

    // All validations passed
    return NextResponse.next();
  } catch (error) {
    console.error('Error validating widget parameters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
