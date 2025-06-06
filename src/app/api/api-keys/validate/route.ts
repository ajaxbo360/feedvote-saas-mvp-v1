import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { extractApiKeyFromHeaders } from '@/utils/api-key-utils';

/**
 * POST - Validate an API key from widget requests
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Extract API key from headers
    const apiKey = extractApiKeyFromHeaders(req.headers);

    if (!apiKey) {
      return NextResponse.json(
        {
          valid: false,
          error: 'API key is required',
        },
        { status: 401 },
      );
    }

    // Get the API key details
    const { data, error } = await supabase
      .from('project_api_keys')
      .select('id, project_id, key_type, is_active, expires_at')
      .eq('key_value', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid or inactive API key',
        },
        { status: 401 },
      );
    }

    // Check if the API key has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json(
        {
          valid: false,
          error: 'API key has expired',
        },
        { status: 401 },
      );
    }

    // Update the last_used_at timestamp
    await supabase.from('project_api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id);

    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name, slug')
      .eq('id', data.project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Project not found',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      valid: true,
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
      },
      key: {
        id: data.id,
        type: data.key_type,
      },
    });
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      {
        valid: false,
        error: 'Error validating API key',
      },
      { status: 500 },
    );
  }
}
