import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

const CSRF_TOKEN_COOKIE = 'feedvote-csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
const TOKEN_EXPIRY = 60 * 60; // 1 hour in seconds

/**
 * Middleware to validate CSRF tokens for state-changing requests
 * Skips validation for safe methods (GET, HEAD, OPTIONS)
 */
export async function validateCsrfToken(req: NextRequest) {
  const method = req.method;

  // Skip validation for safe methods
  if (SAFE_METHODS.includes(method)) {
    return NextResponse.next();
  }

  // For state-changing methods (POST, PUT, DELETE, etc.), validate CSRF token
  const tokenFromHeader = req.headers.get(CSRF_HEADER_NAME);
  const tokenFromCookie = req.cookies.get(CSRF_TOKEN_COOKIE)?.value;

  // If there's no token in the cookie, this might be the first request
  // or the client may not have received a token yet
  if (!tokenFromCookie) {
    return generateNewCsrfTokenResponse(req);
  }

  // Both header and cookie tokens must be present and match
  if (!tokenFromHeader || tokenFromHeader !== tokenFromCookie) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  // Valid token, generate a new one for the next request
  return generateNewCsrfTokenResponse(req);
}

/**
 * Generate a new CSRF token and set it as a cookie in the response
 */
function generateNewCsrfTokenResponse(req: NextRequest): NextResponse {
  const newToken = nanoid(32);
  const response = NextResponse.next();

  // Set the CSRF token as a cookie
  response.cookies.set({
    name: CSRF_TOKEN_COOKIE,
    value: newToken,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOKEN_EXPIRY,
  });

  return response;
}

/**
 * Generate a CSRF token and return it
 * This can be used in API routes to generate a token for forms
 */
export function generateCsrfToken(): string {
  const token = nanoid(32);
  const cookieStore = cookies();

  cookieStore.set({
    name: CSRF_TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOKEN_EXPIRY,
  });

  return token;
}
