import { SignupForm } from '@/components/authentication/sign-up-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - FeedVote',
  description: 'Create your FeedVote account',
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
