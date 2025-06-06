import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { WidgetSettings, DEFAULT_WIDGET_SETTINGS } from '@/types/widget-settings';

// Define the project type
interface Project {
  id: string;
  name: string;
  widget_settings: WidgetSettings;
}

// Default branding colors
const DEFAULT_COLORS = {
  primary: '#2dd4bf', // Default teal color
  secondary: '#ff6f61', // Default coral color
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient();
    const origin = request.headers.get('origin');

    // Query the projects table with the given slug
    const { data: project, error } = await supabase
      .from('projects')
      .select('id, name, widget_settings')
      .eq('slug', params.slug)
      .single();

    // Handle database errors
    if (error) {
      console.error('Database error:', error.message);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Handle non-existent project
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Merge default settings with project settings
    const settings: WidgetSettings = {
      ...DEFAULT_WIDGET_SETTINGS,
      ...project.widget_settings,
    };

    // Validate domain if whitelisted domains are set
    if (settings.whitelistedDomains.length > 0 && origin) {
      const domain = new URL(origin).hostname;
      if (!settings.whitelistedDomains.some((d) => domain.endsWith(d))) {
        return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
      }
    }

    // Return project config with settings
    return NextResponse.json({
      project_id: project.id,
      name: project.name,
      settings: {
        appearance: {
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          position: settings.position,
          theme: settings.theme,
          buttonText: settings.buttonText,
          customClass: settings.customClass,
        },
        userParameters: settings.userParameters,
        allowAnonymous: settings.allowAnonymous,
        analytics: settings.enableAnalytics
          ? {
              trackEvents: settings.trackEvents,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching widget config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
