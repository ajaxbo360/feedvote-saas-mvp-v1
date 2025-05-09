import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface Props {
  user: User | null;
}

export default function Header({ user }: Props) {
  return (
    <nav>
      <div className="mx-auto max-w-7xl relative px-[32px] py-[18px] flex items-center justify-between">
        <div className="flex flex-1 items-center justify-start">
          <Link className="flex items-center" href={'/'}>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">FeedFeature</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex items-center space-x-6">
            <Link
              href="#leaderboard"
              className="header-link-box text-gray-800 dark:text-white hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
            <Link
              href="#pricing"
              className="header-link-box text-gray-800 dark:text-white hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <ThemeToggle />
            {user?.id ? (
              <Button
                variant={'secondary'}
                asChild={true}
                className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <Link href={'/dashboard'}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild={true}
                  variant={'secondary'}
                  className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white mr-2"
                >
                  <Link href={'/login'}>Sign in</Link>
                </Button>
                <Button asChild={true} className="gradient-button rounded-xl px-6 py-2">
                  <Link href={'/signup'}>Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
