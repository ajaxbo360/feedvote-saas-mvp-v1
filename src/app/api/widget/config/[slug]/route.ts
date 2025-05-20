import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/utils/supabase/server';

// Define the project type
interface Project {
  id: string;
  name: string;
  branding_colors: {
    primary: string;
    secondary: string;
  } | null;
}

// Default branding colors
const DEFAULT_COLORS = {
  primary: '#2dd4bf', // Default teal color
  secondary: '#ff6f61', // Default coral color
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = createServerSupabaseClient();

    // Query the projects table with the given slug
    const { data: project, error } = await supabase
      .from('projects')
      .select('id, name, branding_colors')
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

    // Return project config with default colors if none are set
    return NextResponse.json({
      project_id: project.id,
      name: project.name,
      branding: {
        colors: project.branding_colors || DEFAULT_COLORS,
      },
    });
  } catch (error) {
    console.error('Error fetching widget config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
