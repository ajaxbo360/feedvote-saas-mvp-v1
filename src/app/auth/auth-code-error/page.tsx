import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthCodeError({ searchParams }: { searchParams: { error?: string } }) {
  const errorMessage = searchParams.error ? decodeURIComponent(searchParams.error) : 'Unknown error';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6">Authentication Error</h1>

        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-xs font-semibold text-red-800 dark:text-red-200 mb-2">Error Details:</p>
          <p className="text-sm font-mono text-red-600 dark:text-red-400 break-words">{errorMessage}</p>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center text-sm">
          There was an error processing your authentication. This could be due to an expired code or session.
        </p>

        <div className="flex justify-center">
          <Button asChild className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
