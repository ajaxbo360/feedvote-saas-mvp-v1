import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

interface PageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectHomePage({ params }: PageProps) {
  const { projectId } = params;
  const slug = projectId; // The URL param is actually the slug
  const supabase = await createClient();

  // Get the current user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Fetch project by slug
  const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).single();

  // If project not found, redirect to projects list
  if (error || !project) {
    console.error('Project not found:', error?.message || 'No project with this slug');
    redirect('/app');
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <div className="flex flex-col gap-4">
        <div className="py-2 mb-6">
          <h1 className="text-2xl font-semibold">Your Board</h1>
        </div>

        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-semibold mb-3">Project Dashboard Coming Soon</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            We're working on an improved project management interface. Check back soon for updates.
          </p>
          <Link href="/app" className={buttonVariants({ variant: 'outline' })}>
            Return to Projects
          </Link>
        </Card>
      </div>
    </main>
  );
}
