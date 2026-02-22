import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { FeedbackVote } from '@/types/api';
import { z } from 'zod';

const voteSchema = z.object({
  project_id: z.string().min(1, 'Project ID is required'),
  feedback_id: z.string().min(1, 'Feedback ID is required'),
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const body = await req.json();

    // Validate request body
    const validationResult = voteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400, headers: corsHeaders },
      );
    }

    const vote = validationResult.data as FeedbackVote;

    // Start a transaction to update votes
    const { data, error } = await supabase.rpc('increment_feedback_votes', {
      p_feedback_id: vote.feedback_id,
      p_project_id: vote.project_id,
    });

    if (error) {
      console.error('Error updating votes:', error);
      return NextResponse.json({ error: 'Failed to update votes' }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ data: { votes: data.votes } }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
