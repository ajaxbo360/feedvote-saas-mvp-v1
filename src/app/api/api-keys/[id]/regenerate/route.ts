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

    const id = params.id;

    // Verify the API key exists and the user owns it
    const { data: existingKey, error: keyError } = await supabase
      .from('project_api_keys')
      .select('id, key_type, project_id, projects!inner(user_id)')
      .eq('id', id)
      .eq('projects.user_id', user.id)
      .single();

    if (keyError || !existingKey) {
      return NextResponse.json({ error: 'API key not found or not authorized' }, { status: 404 });
    }

    // Generate a new key value with the same key type
    const { data: newKeyValue, error: genError } = await supabase
      .rpc('generate_api_key', { key_type: existingKey.key_type })
      .single();

    if (genError || !newKeyValue) {
      console.error('Error generating new key value:', genError);
      return NextResponse.json({ error: 'Failed to generate new key value' }, { status: 500 });
    }

    // Update the API key with the new value
    const { data, error } = await supabase
      .from('project_api_keys')
      .update({
        key_value: newKeyValue,
        last_used_at: null,
        created_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error regenerating API key:', error);
      return NextResponse.json({ error: 'Failed to regenerate API key' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
