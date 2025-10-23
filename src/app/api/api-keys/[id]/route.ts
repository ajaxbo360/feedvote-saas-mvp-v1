import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { validateCsrfToken } from '@/utils/csrf-middleware';
import { z } from 'zod';

// Validation schema for updating an API key
const updateApiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
  is_active: z.boolean().optional(),
  expires_at: z.string().datetime().optional().nullable(),
});

/**
 * GET - Get a specific API key
 * Requires authentication and project ownership
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    // Get the API key and verify ownership
    const { data, error } = await supabase
      .from('project_api_keys')
      .select('*, projects!inner(user_id)')
      .eq('id', id)
      .eq('projects.user_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'API key not found or not authorized' }, { status: 404 });
    }

    // Remove the projects join data from the response
    const { projects, ...apiKey } = data;

    return NextResponse.json({ data: apiKey });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH - Update a specific API key
 * Requires authentication, CSRF protection, and project ownership
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

    const id = params.id;

    // Verify the API key exists and the user owns it
    const { data: existingKey, error: keyError } = await supabase
      .from('project_api_keys')
      .select('id, project_id, projects!inner(user_id)')
      .eq('id', id)
      .eq('projects.user_id', user.id)
      .single();

    if (keyError || !existingKey) {
      return NextResponse.json({ error: 'API key not found or not authorized' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await req.json();
    const result = updateApiKeySchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Update the API key
    const { data, error } = await supabase.from('project_api_keys').update(result.data).eq('id', id).select().single();

    if (error) {
      console.error('Error updating API key:', error);
      return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE - Delete a specific API key
 * Requires authentication, CSRF protection, and project ownership
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const id = params.id;

    // Verify the API key exists and the user owns it
    const { data: existingKey, error: keyError } = await supabase
      .from('project_api_keys')
      .select('id, project_id, projects!inner(user_id)')
      .eq('id', id)
      .eq('projects.user_id', user.id)
      .single();

    if (keyError || !existingKey) {
      return NextResponse.json({ error: 'API key not found or not authorized' }, { status: 404 });
    }

    // Delete the API key
    const { error } = await supabase.from('project_api_keys').delete().eq('id', id);

    if (error) {
      console.error('Error deleting API key:', error);
      return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
