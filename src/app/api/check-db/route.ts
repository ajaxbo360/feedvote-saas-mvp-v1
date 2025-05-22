import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check if project_api_keys table exists by attempting to query it
    const { data, error } = await supabase
      .from('project_api_keys')
      .select('id, key_type, key_value, created_at')
      .limit(5);

    return NextResponse.json({
      tableExists: !error,
      data: data || [],
      error: error ? error.message : null,
    });
  } catch (error) {
    console.error('Error checking database:', error);
    return NextResponse.json({ error: 'Error checking database structure' }, { status: 500 });
  }
}
