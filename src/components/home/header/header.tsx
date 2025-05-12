import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { signInWithGoogle } from '@/utils/auth-helper';

interface Props {
  user: User | null;
}

export default function Header({ user }: Props) {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();

      if (error) {
        toast({
          description: `Authentication error: ${error.message}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        description: 'Failed to connect to authentication service',
        variant: 'destructive',
      });
    }
  };

  return (
    <nav className="bg-transparent backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl relative px-[32px] py-[18px] flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href={'/'}>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">FeedVote</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8 mx-4">
          {/* Product Hunt Badge now before links */}
          <div>
            <a
              href="https://www.producthunt.com/posts/features-vote?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-features-vote"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://s3.producthunt.com/static/badges/daily1.svg"
                alt="Features.Vote - Build profitable features from user feedback | Product Hunt"
                width="110"
                height="30"
              />
            </a>
          </div>

          <Link
            href="#features"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#leaderboard"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Wall of Love
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {user?.id ? (
            <Button
              variant={'default'}
              asChild={true}
              className="rounded-xl bg-green-600 hover:bg-green-700 text-white px-6"
            >
              <Link href={'/dashboard'}>Dashboard</Link>
            </Button>
          ) : (
            <Button
              onClick={handleGoogleLogin}
              className="h-11 gradient-button rounded-xl px-6 py-3 font-semibold text-sm shadow-md bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              Get Started for free
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Product Hunt Badge - only shown on small screens */}
      <div className="md:hidden flex justify-center pb-2">
        <a
          href="https://www.producthunt.com/posts/features-vote?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-features-vote"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://s3.producthunt.com/static/badges/daily1.svg"
            alt="Features.Vote - Build profitable features from user feedback | Product Hunt"
            width="110"
            height="30"
          />
        </a>
      </div>
    </nav>
  );
}
