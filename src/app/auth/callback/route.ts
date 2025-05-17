import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL, otherwise go to app
  const next = searchParams.get('next') ?? '/app';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // At this point, we've successfully authenticated and have a session
      // Return HTML with script to save session to localStorage
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta http-equiv="refresh" content="0;url=${origin}${next}">
            <script>
              const session = ${JSON.stringify(data.session)};
              localStorage.setItem('feedvote-auth-state', JSON.stringify({
                access_token: session.access_token,
                expires_at: session.expires_at,
                expires_in: session.expires_in,
                provider_token: session.provider_token,
                refresh_token: session.refresh_token,
                token_type: session.token_type,
                user: session.user
              }));
              console.log('Auth session saved to localStorage');
              window.location.href = "${origin}${next}";
            </script>
          </head>
          <body>
            Redirecting to app...
          </body>
        </html>
      `;

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
