'use client';

import OnboardingDebugger from '@/components/debug/OnboardingDebugger';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DebugPage() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Debug Tools</h1>
        <Button asChild>
          <Link href="/app">Back to App</Link>
        </Button>
      </div>

      <OnboardingDebugger />

      <div className="mt-4 space-y-4">
        <h2 className="text-xl font-semibold">Other Debug Actions</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>

          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            variant="destructive"
          >
            Clear LocalStorage & Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
