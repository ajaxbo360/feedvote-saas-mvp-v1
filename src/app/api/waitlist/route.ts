import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendWaitlistConfirmationEmail } from '@/utils/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const supabase = await createClient();
    // Check if email already exists
    const { data: existing, error: selectError } = await supabase
      .from('waitlist_entries')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (selectError) {
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }
    if (existing) {
      return NextResponse.json({ error: 'This email is already on the waitlist.' }, { status: 409 });
    }

    // Insert new waitlist entry
    const { error: insertError } = await supabase.from('waitlist_entries').insert({ email });
    if (insertError) {
      return NextResponse.json({ error: 'Failed to add to waitlist.' }, { status: 500 });
    }

    // Send confirmation email (do not block user if email fails)
    try {
      await sendWaitlistConfirmationEmail(email);
    } catch (emailErr) {
      console.error('Failed to send waitlist confirmation email:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
