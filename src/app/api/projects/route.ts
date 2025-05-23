import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all projects for the user
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, name, slug')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error('Error in projects request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
