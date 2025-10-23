import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { validateCsrfToken } from '@/utils/csrf-middleware';
import { z } from 'zod';

// Validation schema for creating an API key
const createApiKeySchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  key_type: z.enum(['public', 'secret', 'mobile'], {
    errorMap: () => ({ message: 'Key type must be public, secret, or mobile' }),
  }),
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
  expires_at: z.string().datetime().optional().nullable(),
});

/**
 * GET - List all API keys for a project
 * Requires authentication and project ownership
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the project ID from the query string
    const url = new URL(req.url);
    const projectId = url.searchParams.get('project_id');

    if (!projectId) {
      console.log('Project ID not provided');
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    console.log('Checking project access:', { projectId, userId: user.id });

    // First check if the project exists
    const { data: projectExists, error: projectExistsError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectExistsError) {
      console.log('Project does not exist:', projectId);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Now check if the user owns this project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, user_id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    console.log('Project ownership check:', { project, error: projectError });

    if (projectError || !project) {
      return NextResponse.json({ error: 'Not authorized to access this project' }, { status: 403 });
    }

    // Get all API keys for the project
    const { data, error } = await supabase
      .from('project_api_keys')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error in API keys request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST - Create a new API key for a project
 * Requires authentication, CSRF protection, and project ownership
 */
export async function POST(req: NextRequest) {
  try {
    // Validate CSRF token
    const csrfResponse = await validateCsrfToken(req);
    if (csrfResponse.status === 403) {
      return csrfResponse;
    }

    const supabase = await createClient();

    // Check if the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();

    // Validate request body
    const result = createApiKeySchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { project_id, key_type, name, description, expires_at } = result.data;

    // Verify the user owns this project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found or not authorized' }, { status: 403 });
    }

    // Create the API key
    const { data, error } = await supabase
      .from('project_api_keys')
      .insert({
        project_id,
        key_type,
        name: name || `${key_type.charAt(0).toUpperCase() + key_type.slice(1)} API Key`,
        description: description || `API key for ${key_type} access`,
        expires_at: expires_at || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating API key:', error);
      return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Error in API key creation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
