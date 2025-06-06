'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * HashUrlManager is a component that ensures the URL has a # hash
 * This is used for the /app route to display properly with hash in URL
 * No visual rendering, just URL management
 */
export function HashUrlManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Only add hash if on the app root page and there's no hash
    if (pathname === '/app' && window.location.hash === '') {
      // Add empty hash to URL without causing a navigation
      window.history.replaceState(null, '', `${pathname}#`);
    }
  }, [pathname]);

  // This component doesn't render anything visible
  return null;
}
