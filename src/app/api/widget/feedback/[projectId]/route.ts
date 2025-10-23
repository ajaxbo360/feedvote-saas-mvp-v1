import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const projectIdSchema = z.string().min(1, 'Project ID is required');

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const projectId = params.projectId;

    // Validate project ID
    const validationResult = projectIdSchema.safeParse(projectId);
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 });
    }

    // Fetch feedback items for the project
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('project_id', projectId)
      .order('votes', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error processing feedback request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
