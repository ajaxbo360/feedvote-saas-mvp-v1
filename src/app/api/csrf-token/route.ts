import { NextRequest, NextResponse } from 'next/server';
import { generateCsrfToken } from '@/utils/csrf-middleware';

/**
 * API route to get a CSRF token for forms
 * This token should be included in forms as a hidden input
 * and sent back as a header for state-changing operations
 */
export async function GET(req: NextRequest) {
  // Generate a CSRF token and set it as a cookie
  const token = generateCsrfToken();

  // Return the token to be used in forms and API requests
  return NextResponse.json({ csrfToken: token });
}
