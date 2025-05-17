'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Check, X, Sun, Moon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// App Header Component
const AppHeader = () => {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  // Only show theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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
          {mounted ? (
            theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )
          ) : (
            <span className="h-5 w-5" />
          )}
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                  <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Free Plan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form action="/auth/signout" method="post" className="w-full">
                  <button type="submit" className="w-full text-left">
                    Log out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

// Project Interface
interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  user_id: string;
}

// ProjectCard Component
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg bg-card flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
        </div>
        <CardDescription className="text-xs">feedvote.com/app/{project.slug}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow min-h-[60px]">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || 'No description provided.'}
        </p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Link href={`/app/${project.slug}/home`} passHref>
          <Button
            variant="default"
            size="sm"
            className="text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            View Home
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Create Project Component
const CreateProjectModal = ({
  open,
  onOpenChange,
  onProjectCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: Project) => void;
}) => {
  const [projectName, setProjectName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    // Auto-generate slug from name
    if (projectName) {
      setSlug(
        projectName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      );
    } else {
      setSlug('');
    }
  }, [projectName]);

  const handleCreateProject = async () => {
    if (!projectName || !slug) {
      toast({
        description: 'Please provide both project name and slug',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          description: 'You must be logged in to create a project',
          variant: 'destructive',
        });
        return;
      }

      // Check if slug already exists
      const { data: existingProject } = await supabase.from('projects').select('id').eq('slug', slug).single();

      if (existingProject) {
        toast({
          description: 'A project with this slug already exists. Please choose another one.',
          variant: 'destructive',
        });
        return;
      }

      // Create project
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectName,
          slug,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        description: 'Successfully added new project!',
        variant: 'default',
      });

      onProjectCreated(data as Project);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        description: `Error creating project: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl">Create New Project</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Create a new project to collect and manage feedback
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="project-name" className="text-right text-sm font-medium">
              Project Name
            </Label>
            <Input
              id="project-name"
              placeholder="Enter your project's name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3 h-12 px-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="project-slug" className="text-right text-sm font-medium">
              Project Slug
            </Label>
            <div className="col-span-3 space-y-3">
              <Input
                id="project-slug"
                placeholder="your-project-slug"
                value={slug}
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, ''),
                  )
                }
                className="h-12 px-4"
              />
              <p className="text-xs text-muted-foreground pl-1">
                URL: https://{slug || 'your-project-slug'}.feedvote.com/board
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-12 px-6">
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={loading || !projectName || !slug}
            className="text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 h-12 px-6"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Projects List Component
const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProjects([]);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error: any) {
      toast({
        description: `Error fetching projects: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      // Intentionally delay to show the skeleton for at least 1.5 seconds
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [supabase]);

  const handleProjectCreated = (project: Project) => {
    setProjects([project, ...projects]);
  };

  // Skeleton card for loading state
  const ProjectSkeleton = () => (
    <div className="bg-card border rounded-md p-4 shadow-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="h-5 w-1/2 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        </div>
        <div className="h-3 w-3/4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="h-12 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        <div className="flex justify-between">
          <div className="h-8 w-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="h-8 w-16 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-300">Each project has its own public voting board on FeedVote</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Project Card */}
          <Card
            className="overflow-hidden border-2 border-dashed border-muted-foreground/30 bg-card/50 flex flex-col h-full cursor-pointer hover:border-green-500/50 hover:scale-105 transition-all duration-200"
            onClick={() => setCreateModalOpen(true)}
          >
            <div className="flex items-center justify-center h-full p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <PlusCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Create Project</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get started with a new project</p>
              </div>
            </div>
          </Card>

          {/* Project Cards or Skeletons */}
          {loading ? (
            // Show multiple skeleton cards when loading
            Array.from({ length: 5 }).map((_, i) => <ProjectSkeleton key={i} />)
          ) : projects.length > 0 ? (
            projects.map((project) => <ProjectCard key={project.id} project={project} />)
          ) : (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-muted-foreground">You haven't created any projects yet.</p>
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onProjectCreated={handleProjectCreated}
      />
    </div>
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
