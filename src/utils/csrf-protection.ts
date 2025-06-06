'use client';

import { nanoid } from 'nanoid';

const CSRF_TOKEN_KEY = 'feedvote-csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const TOKEN_EXPIRY = 1000 * 60 * 60; // 1 hour

interface StoredToken {
  token: string;
  expires: number;
}

/**
 * Generates a new CSRF token and stores it in localStorage
 */
export function generateCsrfToken(): string {
  const token = nanoid(32); // Generate a random token
  const expires = Date.now() + TOKEN_EXPIRY;

  if (typeof window !== 'undefined') {
    const storedTokens: StoredToken[] = getStoredTokens();

    // Clean up expired tokens
    const validTokens = storedTokens.filter((t) => t.expires > Date.now());

    // Add new token and store
    validTokens.push({ token, expires });
    localStorage.setItem(CSRF_TOKEN_KEY, JSON.stringify(validTokens));
  }

  return token;
}

/**
 * Get all stored tokens from localStorage
 */
function getStoredTokens(): StoredToken[] {
  if (typeof window !== 'undefined') {
    try {
      const tokens = localStorage.getItem(CSRF_TOKEN_KEY);
      return tokens ? JSON.parse(tokens) : [];
    } catch (error) {
      console.error('Error getting CSRF tokens from localStorage:', error);
      return [];
    }
  }
  return [];
}

/**
 * Validates a CSRF token against stored tokens
 */
export function validateCsrfToken(token: string): boolean {
  if (!token || typeof window === 'undefined') return false;

  const storedTokens = getStoredTokens();
  const isValid = storedTokens.some((t) => t.token === token && t.expires > Date.now());

  if (isValid) {
    // Remove the used token (one-time use)
    const updatedTokens = storedTokens.filter((t) => t.token !== token && t.expires > Date.now());
    localStorage.setItem(CSRF_TOKEN_KEY, JSON.stringify(updatedTokens));
  }

  return isValid;
}

/**
 * Returns the CSRF token header for fetch requests
 */
export function getCsrfHeader(): Record<string, string> {
  const token = generateCsrfToken();
  return {
    [CSRF_HEADER_NAME]: token,
  };
}

/**
 * Hook for forms to include CSRF protection
 */
export function useCsrfToken() {
  return {
    csrfToken: generateCsrfToken(),
    csrfTokenName: CSRF_HEADER_NAME,
  };
}

/**
 * Adds CSRF token to fetch options
 */
export function withCsrf(options: RequestInit = {}): RequestInit {
  const token = generateCsrfToken();
  return {
    ...options,
    headers: {
      ...options.headers,
      [CSRF_HEADER_NAME]: token,
    },
  };
}
