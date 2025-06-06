# Subdomain-Based Project URLs Implementation

## Overview

This task involves implementing subdomain-based project URLs for FeedVote, similar to how Features.Vote uses them (e.g., `https://your-project-slug.feedvote.com/board`). This approach provides each project with its own domain identity, which feels more professional and branded.

## Technical Requirements

To implement subdomain-based project URLs, we need to set up the following components:

### 1. DNS Configuration

- Set up a wildcard DNS record (`*.feedvote.com`) pointing to our hosting service
- This allows any subdomain to resolve to our application
- Configuration steps:
  - Log in to the domain registrar/DNS provider
  - Add an A record with `*` as the hostname, pointing to the IP address of our hosting
  - Alternatively, add a CNAME record with `*` pointing to `feedvote.com` or your Vercel deployment URL

### 2. Next.js Middleware for Subdomain Routing

- Create a `middleware.ts` file in the project root to handle subdomain-based routing
- The middleware will:
  - Extract the subdomain from incoming requests
  - Rewrite the request to the appropriate route based on the subdomain
  - Forward any path segments after the subdomain to the rewritten URL

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Check if using a subdomain (excluding www and app)
  const subdomain = hostname.split('.')[0];
  if (hostname !== 'feedvote.com' && hostname !== 'www.feedvote.com' && subdomain !== 'app') {
    // If board page is accessed from the subdomain
    if (url.pathname === '/board') {
      return NextResponse.rewrite(new URL(`/app/${subdomain}/board`, request.url));
    }

    // For other routes accessed via subdomain
    return NextResponse.rewrite(new URL(`/app/${subdomain}${url.pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 3. Vercel Configuration

- Configure Vercel to handle wildcard subdomains:
  1. In the Vercel dashboard, go to Project Settings → Domains
  2. Add the main domain (feedvote.com)
  3. Add a wildcard domain (\*.feedvote.com)
  4. Verify both domains are connected correctly

### 4. Application Logic Updates

- Update the project creation functionality:
  - Validate slugs to ensure they're valid as subdomains (no special characters, etc.)
  - Add validation to ensure slugs don't conflict with reserved subdomains (www, app, api, etc.)
- Update navigation and link generation:
  - Modify links to project boards to use the subdomain format
  - Example: Instead of linking to `/app/project-slug/board`, link to `https://project-slug.feedvote.com/board`

### 5. Environment Detection

- Add environment detection to handle local development:

```typescript
// utils/get-project-url.ts
export function getProjectUrl(slug: string, path: string = '/') {
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  if (isLocalhost) {
    // For local development, use path-based URLs
    return `/app/${slug}${path}`;
  } else {
    // For production, use subdomain-based URLs
    return `https://${slug}.feedvote.com${path}`;
  }
}
```

## Testing Considerations

- Local development testing:
  - Use `.localhost` suffix for testing subdomains locally
  - Example: `project-slug.localhost:3000`
  - Modern browsers like Chrome treat `.localhost` domains as secure contexts
- Live environment testing:
  - Create test projects with different slug patterns
  - Test subdomain routing with various path combinations
  - Verify that authentication state is maintained across subdomains

## Security Considerations

- Ensure that authentication cookies work across subdomains
- Set cookie domain to `.feedvote.com` (note the leading dot) to make cookies accessible from all subdomains
- Update CORS settings to allow requests from all subdomains

## Implementation Phases

1. **Phase 1**: Set up DNS and Vercel configuration
2. **Phase 2**: Implement middleware for subdomain routing
3. **Phase 3**: Update application logic to support subdomain URLs
4. **Phase 4**: Test thoroughly and deploy

## Resources

- [Next.js Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware)
- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [DNS Configuration Guide](https://vercel.com/docs/concepts/projects/domains#adding-a-domain)
