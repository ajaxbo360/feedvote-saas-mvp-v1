## Feedvote.com: First Development Tasks (MVP - Auth & Core Structure)

**Goal:** Implement core authentication for Product Owners, set up user data storage, and establish the basic Next.js application structure for the dashboard and feedback features page. All development must follow Test-Driven Development (TDD).

**Key Technologies:** Next.js (App Router), Supabase (Auth, Database), Jest, TypeScript.

---

### Sprint 1: Core Authentication & User Setup

**User Story Focus:** "As a SaaS Founder, I want to securely sign up and log in to Feedvote so I can create and manage feedback boards for my products."

**General TDD Approach for Each Task:**

1.  **RED:** Write a failing test (unit or integration) for a small piece of functionality.
2.  **GREEN:** Write the minimum code to make the test pass.
3.  **REFACTOR:** Clean up code and tests.

**Task 1: Project Setup & Basic Dependencies**

- **1.1. Initialize Next.js Project (if not already done for landing page, or integrate into existing monorepo):**
  - Ensure Next.js with App Router and TypeScript is set up.
  - Confirm existing landing page code can coexist or be integrated.
- **1.2. Install Core Dependencies:**
  - `@supabase/supabase-js`
  - `jest`, `@testing-library/react`, `@testing-library/jest-dom` (for testing)
  - `eslint`, `prettier` (for code quality)
- **1.3. Configure Supabase Client:**
  - Set up environment variables for Supabase URL and anon key (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - Create a Supabase client utility function (e.g., `lib/supabase/client.ts`).
  - **TDD:** Write a simple test to ensure the Supabase client can be initialized (mocking environment variables).

**Task 2: User Authentication - Sign-up**

- **2.1. Design User Schema (Supabase):**
  - Supabase `auth.users` table will handle basic auth data.
  - Create a public `profiles` table linked to `auth.users` via user ID (UUID) to store additional profile information (e.g., `id` (matches auth.users.id), `email`, `full_name` (optional), `avatar_url` (optional), `created_at`).
  - Define RLS policies for the `profiles` table (users can only read/update their own profile).
- **2.2. Create Sign-up Page/Component (`/auth/signup` or similar route):**
  - **TDD (Component):**
    - Test for rendering of email input, password input, confirm password input, and sign-up button.
    - Test for form submission handling.
    - Test for client-side validation (e.g., email format, password complexity, passwords match).
  - Implement the UI component.
- **2.3. Implement Sign-up API Route/Server Action (using Supabase Auth):**
  - **TDD (API/Action):**
    - Test successful user creation with valid credentials (mock Supabase `auth.signUp`).
    - Test error handling for existing user (mock Supabase `auth.signUp` to return error).
    - Test error handling for invalid input (e.g., weak password, if not fully caught by client).
  - Implement the API route/Server Action that calls `supabase.auth.signUp()`.
  - Ensure it handles email confirmation flow (Supabase default).
- **2.4. Create User Profile on Sign-up:**
  - After successful Supabase `auth.signUp`, create a corresponding entry in the `profiles` table (can be done via a Supabase Function triggered on `auth.users` insert, or in the sign-up Server Action/API route using service role if necessary and secure).
  - **TDD:** Test that a profile is created after successful sign-up.

**Task 3: User Authentication - Login**

- **3.1. Create Login Page/Component (`/auth/login` or similar route):**
  - **TDD (Component):**
    - Test for rendering of email input, password input, and login button.
    - Test for form submission handling.
  - Implement the UI component.
- **3.2. Implement Login API Route/Server Action (using Supabase Auth):**
  - **TDD (API/Action):**
    - Test successful login with valid credentials (mock Supabase `auth.signInWithPassword`).
    - Test error handling for invalid credentials (mock Supabase `auth.signInWithPassword` to return error).
  - Implement the API route/Server Action that calls `supabase.auth.signInWithPassword()`.
- **3.3. Session Management:**
  - Leverage Supabase client-side session handling.
  - Implement logic to redirect authenticated users from login/signup pages to the app dashboard.
  - Implement logic to redirect unauthenticated users from protected app pages to the login page.
  - **TDD:** Test protected route behavior (mock auth state).

**Task 4: User Authentication - Logout**

- **4.1. Implement Logout Functionality:**
  - Create a logout button/link in the application layout (when user is authenticated).
  - **TDD (Component/Action):**
    - Test that clicking logout calls `supabase.auth.signOut()`.
    - Test that user is redirected to login page or home page after logout.
  - Implement the logout handler calling `supabase.auth.signOut()`.

**Task 5: Basic Application Structure & Protected Routes**

- **5.1. Create Main App Layout (`/app/layout.tsx`):**
  - Include basic navigation (e.g., placeholder for sidebar, top navigation with user profile/logout).
  - Implement logic to fetch user session/profile for display.
  - **TDD:** Test that layout renders correctly with/without authenticated user (mock auth state).
- **5.2. Create Dashboard Page (`/app/dashboard/page.tsx`):**
  - This will be the initial landing page after login.
  - Protect this route – only accessible to authenticated users.
  - Display a welcome message and placeholder for future project list.
  - **TDD:** Test that unauthenticated users are redirected. Test that authenticated users can access and see basic content.
- **5.3. Create Initial "Features" Page Structure (e.g., `/app/projects/[projectId]/board/page.tsx`):**
  - Set up the basic route structure for where a project-specific feedback board will live.
  - For now, it can be a placeholder page, also protected.
  - **TDD:** Test route protection.

**Task 6: User Profile Management (Basic)**

- **6.1. Create a Basic Profile Page (`/app/profile/page.tsx`):**
  - Allow users to view their email.
  - (Future tasks: allow updating name, avatar).
  - **TDD:** Test that profile data is displayed correctly for the logged-in user (mock Supabase calls to fetch profile).

---

### Definition of Done for Sprint 1:

- Product Owners can successfully sign up with email/password.
- Product Owners receive and can use email confirmation.
- Product Owners can log in with their credentials.
- Product Owners can log out.
- Basic user profile data is stored in Supabase (`profiles` table).
- A protected `/app/dashboard` page exists and is accessible only after login.
- A placeholder for a project-specific features/board page exists and is protected.
- All new functionality is covered by unit and/or integration tests following TDD principles.
- Code is committed to version control regularly with descriptive messages.

---

This first set of tasks establishes the foundational authentication and application structure, paving the way for project creation and feedback management features in subsequent sprints.
