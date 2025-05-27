import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const feedbackSchema = z.object({
  project_id: z.string().min(1, 'Project ID is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(5000, 'Description is too long'),
  tags: z.array(z.string()).optional(),
  attachment_url: z.string().url('Invalid attachment URL').optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    // Validate required fields
    const { project_id, title, description } = body;
    if (!project_id || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get project by slug
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('slug', project_id)
      .single();

    if (projectError || !project) {
      console.error('Error finding project:', projectError);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Insert feedback into Supabase
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        project_id: project.id,
        title,
        description,
        status: 'Open',
        votes: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting feedback:', error);
      return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in feedback submission:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
