## Custom Rules and Guidelines for Cursor (AI Coding Agent) - Feedvote.com Development

**Project:** Feedvote.com
**Primary Goal:** Develop a high-quality, maintainable SaaS application using Next.js and Supabase, strictly adhering to Test-Driven Development (TDD).

These rules are designed to guide Cursor in generating code and tests that align with our development philosophy and technical requirements.

### 1. Core Principle: Test-Driven Development (TDD) First!

- **Rule 1.1 (Non-Negotiable):** For any new functionality or modification, **tests MUST be written BEFORE the implementation code.** No exceptions.
- **Rule 1.2 (Red-Green-Refactor):** Follow the TDD cycle rigorously:
  - **RED:** Write a failing test that clearly defines a small piece of desired functionality or improvement.
  - **GREEN:** Write the simplest possible production code to make the test pass.
  - **REFACTOR:** Clean up the code (both test and implementation) while ensuring all tests still pass. Remove duplication, improve clarity, and optimize if necessary.
- **Rule 1.3 (Small Steps):** Implement functionality in small, testable increments. Each commit should ideally represent a complete TDD cycle for a tiny piece of behavior.

### 2. Test Types and Coverage

- **Rule 2.1 (Unit Tests):** All individual functions, methods, and components (especially utility functions, business logic, and UI components with logic) MUST have comprehensive unit tests. Aim for high branch and statement coverage.
  - Use Jest for unit testing React components, Next.js API routes, and utility functions.
- **Rule 2.2 (Integration Tests):** Write integration tests for interactions between components, API routes and database calls, or different modules. Focus on verifying the contracts between units.
  - For Next.js API routes, test them by making actual HTTP requests (e.g., using `supertest` or a similar library with Jest) and verifying responses, including interactions with Supabase (mocked appropriately).
- **Rule 2.3 (End-to-End Tests - E2E - As Needed):** For critical user flows (e.g., user sign-up, feedback submission, project creation), E2E tests should be considered. (Initially, focus heavily on unit and integration tests; E2E can be added progressively).
  - If E2E tests are written, use Playwright or Cypress.

### 3. Test Implementation Guidelines

- **Rule 3.1 (Clarity and Readability):** Tests should be easy to understand. Use descriptive names for test suites (`describe` blocks) and individual tests (`it` or `test` blocks) that clearly state the intent and expected outcome.
- **Rule 3.2 (AAA Pattern):** Structure tests using the Arrange-Act-Assert (AAA) pattern:
  - **Arrange:** Set up the necessary preconditions and inputs.
  - **Act:** Execute the code being tested.
  - **Assert:** Verify that the outcome is as expected.
- **Rule 3.3 (Isolation):** Tests should be independent and isolated. The outcome of one test should not affect another. Ensure proper setup and teardown if shared state is unavoidable (though strive to avoid it).
- **Rule 3.4 (Mocking):**
  - Mock external dependencies (e.g., Supabase client calls, third-party APIs, `Date.now()`, `Math.random()`) to ensure tests are deterministic and fast.
  - Use Jest's built-in mocking capabilities (`jest.mock`, `jest.fn`, `jest.spyOn`).
  - When mocking Supabase, mock the specific client methods being used (e.g., `supabase.from(...).select()`, `supabase.auth.signUp()`).
- **Rule 3.5 (No Logic in Tests):** Avoid conditional logic (if/else, loops) within test assertions. Each test should verify a single, specific outcome.
- **Rule 3.6 (Test File Location):** Place test files alongside the code they are testing, typically in a `__tests__` subdirectory or using a `.test.ts` / `.spec.ts` (or `.test.tsx` / `.spec.tsx`) naming convention (e.g., `Button.tsx` and `Button.test.tsx`).

### 4. Code Generation and Style

- **Rule 4.1 (PRD Adherence):** All generated code MUST align with the features and requirements outlined in the Feedvote.com Product Requirements Document (PRD).
- **Rule 4.2 (Technology Stack):** Strictly use Next.js (App Router preferred for new features), React, TypeScript, and Supabase as per the PRD.
- **Rule 4.3 (TypeScript First):** All new code should be written in TypeScript with strong typing. Avoid `any` where possible; use specific types or `unknown`.
- **Rule 4.4 (Clarity and Simplicity):** Prioritize clear, concise, and maintainable code. Avoid overly complex solutions.
- **Rule 4.5 (Error Handling):** Implement robust error handling. API routes should return appropriate HTTP status codes and error messages. Frontend code should gracefully handle errors and provide user feedback.
- **Rule 4.6 (Security):** Be mindful of security best practices (e.g., validating inputs, preventing XSS, using Supabase RLS effectively).
- **Rule 4.7 (Environment Variables):** Use environment variables for all sensitive information (API keys, database URLs) and ensure they are not hardcoded. Follow Next.js conventions for environment variables.

### 5. Supabase Interaction

- **Rule 5.1 (Supabase Client):** Use the official Supabase JavaScript client for all database and authentication interactions.
- **Rule 5.2 (RLS):** Assume Row Level Security (RLS) is enabled on Supabase tables. Queries and mutations should be written with RLS policies in mind. Tests may need to mock authenticated user contexts.
- **Rule 5.3 (Service Role Key):** Use the service role key ONLY in secure backend environments (e.g., Supabase Functions or trusted API routes) where necessary to bypass RLS. Never expose it on the client-side.
- **Rule 5.4 (Data Validation):** Validate data before sending it to Supabase and upon retrieval if necessary.

### 6. Next.js Specifics

- **Rule 6.1 (App Router):** For new features, prefer the Next.js App Router over the Pages Router unless there's a compelling reason otherwise.
- **Rule 6.2 (Server Components & Client Components):** Use Server Components by default. Only use Client Components (`'use client'`) when interactivity or browser APIs are needed.
- **Rule 6.3 (API Routes):** API routes should be well-defined, follow RESTful principles where appropriate, and include input validation and clear response structures.
- **Rule 6.4 (State Management):** For client-side state, use React Context, Zustand, or other appropriate libraries as decided by the team. Keep it simple initially.

### 7. Iteration and Refinement

- **Rule 7.1 (Feedback Loop):** Be prepared to iterate on generated code based on feedback and failing tests.
- **Rule 7.2 (Refactor Aggressively):** After getting tests to pass, always look for opportunities to refactor and improve the code quality and test clarity.

By adhering to these rules, Cursor will significantly contribute to building a robust and reliable Feedvote.com platform.
