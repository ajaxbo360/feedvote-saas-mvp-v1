import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center mb-6">Authentication Error</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
          There was an error processing your authentication. This could be due to an expired code or session.
        </p>

        <div className="flex justify-center">
          <Button
            asChild
            className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
