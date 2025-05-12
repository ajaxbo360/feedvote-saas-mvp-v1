# Google OAuth Authentication with Supabase

## Task: Implement Google OAuth Authentication

### 1. Supabase Project Setup

- [ ] Create a new Supabase project (or use existing)
- [ ] Note down Supabase URL and anon key
- [ ] Create user_profiles table in SQL Editor:

  ```sql
  CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Set up RLS
  ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

  -- Create policies
  CREATE POLICY "Users can view own profile"
      ON public.user_profiles
      FOR SELECT
      USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
      ON public.user_profiles
      FOR UPDATE
      USING (auth.uid() = id);

  CREATE POLICY "System can create profiles"
      ON public.user_profiles
      FOR INSERT
      WITH CHECK (true);

  -- Create trigger for updated_at column
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
  ```

### 2. Google Cloud Configuration

- [ ] Create a new Google Cloud project
- [ ] Configure OAuth Consent Screen:
  - [ ] Set User Type (External)
  - [ ] Add App Name and basic information
  - [ ] Add `<project-id>.supabase.co` to Authorized Domains
  - [ ] Configure scopes (userinfo.email, userinfo.profile, openid)
- [ ] Create OAuth Credentials:
  - [ ] Application Type: Web application
  - [ ] Add Authorized JavaScript origins:
    - [ ] `https://yourdomain.com` (production)
    - [ ] `http://localhost:3000` (development)
  - [ ] Add Authorized redirect URIs:
    - [ ] `https://<project-id>.supabase.co/auth/v1/callback`
    - [ ] `http://localhost:3000/auth/callback` (for development)
  - [ ] Note down Client ID and Client Secret

### 3. Supabase Auth Configuration

- [ ] Go to Authentication > Providers in Supabase dashboard
- [ ] Enable Google provider
- [ ] Add Client ID and Client Secret from Google Cloud
- [ ] Configure Auth Settings:
  - [ ] Go to Authentication > URL Configuration
  - [ ] Add Site URL: `https://yourdomain.com` or `http://localhost:3000`
  - [ ] Add Redirect URLs:
    - [ ] `https://yourdomain.com/auth/callback`
    - [ ] `http://localhost:3000/auth/callback`

### 4. Next.js Project Setup

- [ ] Install Supabase packages:
  ```bash
  npm install @supabase/ssr @supabase/supabase-js
  ```
- [ ] Create `.env.local` file with:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
  ```

### 5. Supabase Client Implementation

- [ ] Create browser client (client-side) at `src/utils/supabase/client.ts`:

  ```typescript
  import { createBrowserClient } from '@supabase/ssr';

  export function createClient() {
    return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  }
  ```

- [ ] Create server client (server-side) at `src/utils/supabase/server.ts`:

  ```typescript
  import { createServerClient } from '@supabase/ssr';
  import { cookies } from 'next/headers';

  export async function createClient() {
    const cookieStore = cookies();

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set(name, value, options);
        },
        remove(name, options) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    });
  }
  ```

### 6. Authentication Components

- [ ] Create Google Login Button component at `src/components/GoogleLoginButton.tsx`:

  ```typescript
  'use client';

  import { createClient } from '@/utils/supabase/client';

  export default function GoogleLoginButton() {
    const handleGoogleLogin = async () => {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    };

    return (
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors"
      >
        <svg viewBox="0 0 24 24" width="20" height="20">
          {/* Google icon SVG paths */}
        </svg>
        Continue with Google
      </button>
    );
  }
  ```

### 7. Auth Flow Pages

- [ ] Create Login Page at `src/app/login/page.tsx`:

  ```typescript
  import { redirect } from 'next/navigation';
  import GoogleLoginButton from '@/components/GoogleLoginButton';
  import { createClient } from '@/utils/supabase/server';

  export default async function LoginPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      redirect('/dashboard');
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Sign in to your account</h1>
            <p className="mt-2 text-gray-600">
              Use your Google account to continue
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    );
  }
  ```

- [ ] Create Auth Callback Handler at `src/app/auth/callback/route.ts`:

  ```typescript
  import { NextResponse } from 'next/server';
  import { createClient } from '@/utils/supabase/server';

  export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Redirect to dashboard after successful login
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      }
    }

    // Redirect to login with error if authentication fails
    return NextResponse.redirect(new URL('/login?error=callback_error', requestUrl.origin));
  }
  ```

### 8. Profile Service

- [ ] Create Profile Service at `src/utils/profile-service.ts`:

  ```typescript
  import { createClient } from '@/utils/supabase/server';

  export async function createUserProfile(userId: string, userData: any) {
    const supabase = await createClient();

    // Check if profile exists
    const { data: existingProfile } = await supabase.from('user_profiles').select('id').eq('id', userId).single();

    if (existingProfile) {
      return;
    }

    // Create profile with Google data
    const { error } = await supabase.from('user_profiles').insert({
      id: userId,
      full_name: userData.user_metadata?.full_name || userData.user_metadata?.name,
      avatar_url: userData.user_metadata?.avatar_url,
    });

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }
  ```

### 9. Protected Routes

- [ ] Create Dashboard Page at `src/app/dashboard/page.tsx`:

  ```typescript
  import { redirect } from 'next/navigation';
  import { createClient } from '@/utils/supabase/server';
  import { createUserProfile } from '@/utils/profile-service';

  export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Redirect to login if not authenticated
    if (!session) {
      redirect('/login');
    }

    // Get user profile, create if it doesn't exist
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      await createUserProfile(session.user.id, session.user);
    }

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            {session.user.user_metadata.avatar_url && (
              <img
                src={session.user.user_metadata.avatar_url}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">
                Welcome, {session.user.user_metadata.full_name || session.user.user_metadata.name || 'User'}
              </p>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  ```

### 10. Authentication Middleware

- [ ] Create Middleware for Protected Routes at `src/middleware.ts`:

  ```typescript
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';
  import { createClient } from '@/utils/supabase/middleware';

  export async function middleware(request: NextRequest) {
    try {
      const { supabase, response } = createClient(request);

      // Get session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Protect dashboard routes
      const path = new URL(request.url).pathname;
      if (path.startsWith('/dashboard') && !session) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return response;
    } catch (e) {
      return NextResponse.next();
    }
  }

  export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
  };
  ```

### 11. Sign Out Functionality

- [ ] Create Sign Out Route at `src/app/auth/signout/route.ts`:

  ```typescript
  import { NextResponse } from 'next/server';
  import { createClient } from '@/utils/supabase/server';

  export async function POST(request: Request) {
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL('/', request.url));
  }
  ```

### 12. Testing & Verification

- [ ] Test login flow by navigating to `/login`
- [ ] Verify Google OAuth redirects work correctly
- [ ] Verify user profile is created in database
- [ ] Test protected routes redirect properly if not logged in
- [ ] Test sign out functionality
- [ ] Ensure session persistence across page refreshes

### 13. Deployment

- [ ] Configure environment variables in deployment platform
- [ ] Update Google Cloud OAuth credentials with production URLs
- [ ] Update Supabase Auth settings with production URLs
- [ ] Deploy the application
