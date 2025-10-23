import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const supabase = await createClient();

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Sign out (this will clear the auth cookies automatically)
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');

  // Return HTML with script to clear localStorage profile cache as well
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=/">
        <script>
          // Clear the user profile cache from localStorage
          localStorage.removeItem('feedvote-user-profile');
          console.log('User profile cache cleared from localStorage');
          window.location.href = "/";
        </script>
      </head>
      <body>
        Signing out...
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
