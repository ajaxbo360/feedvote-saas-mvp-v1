import { NextRequest, NextResponse } from 'next/server';
import { authRateLimiter } from '@/utils/rate-limiter';
import { validation } from '@/utils/validation';
import { validateCsrfToken } from '@/utils/csrf-middleware';

/**
 * Example authentication endpoint with security best practices:
 * 1. CSRF protection
 * 2. Rate limiting
 * 3. Input validation
 */
export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = authRateLimiter(req);
  if (rateLimitResponse) {
    return rateLimitResponse; // Return 429 Too Many Requests if rate limit exceeded
  }

  // Validate CSRF token
  const csrfResponse = await validateCsrfToken(req);
  if (csrfResponse.status === 403) {
    return csrfResponse; // Return 403 Forbidden if CSRF validation fails
  }

  try {
    // Parse request body
    const body = await req.json();

    // Validate and sanitize inputs
    const email = validation.email(body.email || '');
    const password = body.password || '';

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!validation.minLength(password, 8)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // In a real app, this would call your authentication service
    // For this example, we'll just return a success response

    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });
  } catch (error) {
    console.error('Authentication error:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
