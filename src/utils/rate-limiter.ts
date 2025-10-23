import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  // Maximum number of requests in the time window
  maxRequests: number;
  // Time window in seconds
  windowSizeInSeconds: number;
  // Message to return when rate limit is exceeded
  message?: string;
}

// In-memory store for rate limiting
// In production, this should be replaced with Redis or similar distributed store
const ipRequests = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 * Limits requests based on IP address
 */
export function rateLimiter(config: RateLimitConfig) {
  const { maxRequests, windowSizeInSeconds, message = 'Too many requests, please try again later' } = config;

  return function (req: NextRequest): NextResponse | null {
    // Get client IP
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      // First request from this IP
      ipRequests.set(ip, {
        count: 1,
        resetTime: now + windowSizeInSeconds * 1000,
      });
      return null; // Continue processing the request
    }

    const requestData = ipRequests.get(ip)!;

    if (requestData.resetTime <= now) {
      // Reset window has passed, reset counter
      ipRequests.set(ip, {
        count: 1,
        resetTime: now + windowSizeInSeconds * 1000,
      });
      return null; // Continue processing the request
    }

    // Window is still active
    if (requestData.count >= maxRequests) {
      // Rate limit exceeded
      const retryAfterSeconds = Math.ceil((requestData.resetTime - now) / 1000);

      return NextResponse.json(
        { error: message },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfterSeconds.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(requestData.resetTime / 1000).toString(),
          },
        },
      );
    }

    // Increment request count
    requestData.count += 1;
    ipRequests.set(ip, requestData);

    return null; // Continue processing the request
  };
}

// Default rate limiters for different operations
export const authRateLimiter = rateLimiter({
  maxRequests: 5,
  windowSizeInSeconds: 60, // 5 requests per minute for auth
  message: 'Too many login attempts, please try again later',
});

export const apiRateLimiter = rateLimiter({
  maxRequests: 60,
  windowSizeInSeconds: 60, // 60 requests per minute for API
  message: 'Rate limit exceeded, please slow down your requests',
});

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRequests.entries()) {
    if (data.resetTime < now) {
      ipRequests.delete(ip);
    }
  }
}, 60000); // Clean up every minute
