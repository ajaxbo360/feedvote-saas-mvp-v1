'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, PlusCircle, Sun } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useTheme } from 'next-themes';

// Updated AppHeader Component
const AppHeader = () => {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser);
    };
    fetchUser();
  }, [supabase]);

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background">
      <Link href="/app" className="text-xl font-semibold text-foreground">
        FeedVote
      </Link>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-muted-foreground hover:text-foreground"
        >
          <Sun className="h-5 w-5" />
        </Button>
        {user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
        {!user && (
          <Avatar className="h-8 w-8 bg-muted">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
};

// Project Interface (can be simplified if not listing projects for now)
interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  user_id: string;
}

// ProjectCard Component (will not be used directly in ProjectList for now)
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg bg-card flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
        <CardDescription className="text-xs">
          Created: {new Date(project.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow min-h-[60px]">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || 'No description provided.'}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Link href={`/app/projects/${project.id}/home`} passHref legacyBehavior>
          <Button variant="outline" size="sm">
            View Home
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Updated ProjectList Component
const ProjectList = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 text-center bg-background">
      <div className="max-w-md">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Projects</h1>
        <p className="text-muted-foreground mb-8">Each project has their own public voting board on FeedVote</p>

        <button className="w-48 h-48 border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-150 bg-card/50 hover:bg-card">
          <PlusCircle className="h-10 w-10 mb-2" />
          <span className="text-sm font-medium">Create Project</span>
        </button>
      </div>
    </main>
  );
};

export default function AppPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProjectList />
      </div>
    </div>
  );
}
