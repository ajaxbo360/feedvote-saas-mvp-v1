import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { validateCsrfToken } from '@/utils/csrf-middleware';

/**
 * POST - Regenerate an API key
 * Requires authentication, CSRF protection, and project ownership
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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

    const keyId = params.id;

    // First, verify the user owns this API key through the project
    const { data: apiKey, error: apiKeyError } = await supabase
      .from('project_api_keys')
      .select('project_id, key_type')
      .eq('id', keyId)
      .single();

    if (apiKeyError || !apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', apiKey.project_id)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Not authorized to modify this API key' }, { status: 403 });
    }

    // Generate a new key value using the database function
    const { data: newKey, error: regenerateError } = await supabase.rpc('generate_api_key', {
      key_type: apiKey.key_type,
    });

    if (regenerateError || !newKey) {
      console.error('Error generating new API key:', regenerateError);
      return NextResponse.json({ error: 'Failed to generate new API key' }, { status: 500 });
    }

    // Update the API key with the new value
    const { data: updatedKey, error: updateError } = await supabase
      .from('project_api_keys')
      .update({ key_value: newKey })
      .eq('id', keyId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating API key:', updateError);
      return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedKey });
  } catch (error) {
    console.error('Error in API key regeneration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
