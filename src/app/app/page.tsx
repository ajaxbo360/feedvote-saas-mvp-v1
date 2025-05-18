'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Check, X, Sun, Moon, Trash2, Edit, MoreHorizontal } from 'lucide-react';
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
import { validation } from '@/utils/validation';
import { getCsrfHeader } from '@/utils/csrf-protection';
import { AppHeader } from '@/components/app/app-header';
import { useOnboarding } from '@/providers/OnboardingProvider';

// Project Interface
interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  user_id: string;
}

// Project Delete Confirmation Modal Component
const DeleteProjectModal = ({
  open,
  onOpenChange,
  project,
  onProjectDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onProjectDeleted: (projectId: string) => void;
}) => {
  const [projectNameConfirmation, setProjectNameConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  // Clear field when modal is closed
  useEffect(() => {
    if (!open) {
      setProjectNameConfirmation('');
    }
  }, [open]);

  const handleDeleteProject = async () => {
    if (projectNameConfirmation !== project.name) {
      toast({
        description: 'Project name does not match. Please type the exact project name to confirm deletion.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', project.id);

      if (error) {
        throw error;
      }

      toast({
        description: 'Project deleted successfully',
      });

      onProjectDeleted(project.id);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        description: `Failed to delete project: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-500">Delete Project</DialogTitle>
          <DialogDescription className="pt-2">
            This action cannot be undone. This will permanently delete the project and all associated data.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <Label htmlFor="project-name-confirmation" className="text-sm font-medium mb-2 block">
            Please type <span className="font-bold">{project.name}</span> to confirm deletion
          </Label>
          <Input
            id="project-name-confirmation"
            value={projectNameConfirmation}
            onChange={(e) => setProjectNameConfirmation(e.target.value)}
            className="mt-1"
            placeholder="Type project name here"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteProject}
            disabled={loading || projectNameConfirmation !== project.name}
          >
            {loading ? 'Deleting...' : 'Delete Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Edit Project Modal Component
const EditProjectModal = ({
  open,
  onOpenChange,
  project,
  onProjectUpdated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onProjectUpdated: (updatedProject: Project) => void;
}) => {
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(project.description || '');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  // Reset fields when modal opens
  useEffect(() => {
    if (open) {
      setProjectName(project.name);
      setProjectDescription(project.description || '');
    }
  }, [open, project]);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedName = validation.name(value);
    setProjectName(sanitizedName);
  };

  const handleUpdateProject = async () => {
    if (!validation.minLength(projectName, 3)) {
      toast({
        description: 'Project name must be at least 3 characters long',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: updatedProject, error } = await supabase
        .from('projects')
        .update({ name: projectName, description: projectDescription })
        .eq('id', project.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        description: 'Project updated successfully',
      });

      onProjectUpdated(updatedProject);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        description: `Failed to update project: ${error.message}`,
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
          <DialogTitle className="text-xl">Edit Project</DialogTitle>
          <DialogDescription className="text-base pt-2">Update your project details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="project-name" className="text-right text-sm font-medium flex items-center justify-end">
              Project Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="project-name"
              placeholder="Enter your project's name"
              value={projectName}
              onChange={handleProjectNameChange}
              className="col-span-3 h-12 px-4"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-6">
            <Label
              htmlFor="project-description"
              className="text-right text-sm font-medium flex items-center justify-end"
            >
              Description
            </Label>
            <Input
              id="project-description"
              placeholder="Brief description of your project"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="col-span-3 h-12 px-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="project-slug" className="text-right text-sm font-medium flex items-center justify-end">
              Project Slug
            </Label>
            <div className="col-span-3">
              <Input id="project-slug" value={project.slug} disabled className="h-12 px-4 bg-muted" />
              <p className="text-xs text-muted-foreground mt-2 pl-1">Slug cannot be changed after creation</p>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-12 px-6">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProject}
            disabled={loading || !projectName}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white h-12 px-6"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ProjectCard Component
const ProjectCard = ({
  project,
  onDeleteProject,
  onUpdateProject,
}: {
  project: Project;
  onDeleteProject: (projectId: string) => void;
  onUpdateProject: (updatedProject: Project) => void;
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg border-border hover:border-teal-500/50 flex flex-col h-full hover:scale-105 duration-200">
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
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
            >
              View Home
            </Button>
          </Link>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={() => setDeleteModalOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>

      <DeleteProjectModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        project={project}
        onProjectDeleted={onDeleteProject}
      />

      <EditProjectModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        project={project}
        onProjectUpdated={onUpdateProject}
      />
    </>
  );
};

// Create Project Modal Component
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
  const [projectDescription, setProjectDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEditedSlug, setUserEditedSlug] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  // Clear fields when modal is closed
  useEffect(() => {
    if (!open) {
      setProjectName('');
      setProjectDescription('');
      setSlug('');
      setUserEditedSlug(false);
    }
  }, [open]);

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sanitizedName = validation.name(value);
    setProjectName(sanitizedName);

    if (!userEditedSlug) {
      setSlug(validation.slug(sanitizedName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserEditedSlug(true);
    setSlug(validation.slug(e.target.value));
  };

  const handleCreateProject = async () => {
    if (!validation.minLength(projectName, 3)) {
      toast({
        title: 'Error',
        description: 'Project name must be at least 3 characters long',
        variant: 'destructive',
      });
      return;
    }

    if (!validation.minLength(slug, 3)) {
      toast({
        title: 'Error',
        description: 'Project slug must be at least 3 characters long',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getCsrfHeader(),
      };

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
          title: 'Error',
          description: 'A project with this slug already exists.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Insert the new project
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          name: projectName,
          slug: slug,
          description: projectDescription, // Add the description field
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Successfully added new project!',
        variant: 'default',
      });

      onProjectCreated(newProject);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to create project: ${error.message}`,
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
            <Label htmlFor="project-name" className="text-right text-sm font-medium flex items-center justify-end">
              Project Name <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="project-name"
              placeholder="Enter your project's name"
              value={projectName}
              onChange={handleProjectNameChange}
              className="col-span-3 h-12 px-4"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-6">
            <Label
              htmlFor="project-description"
              className="text-right text-sm font-medium flex items-center justify-end"
            >
              Description
            </Label>
            <Input
              id="project-description"
              placeholder="Brief description of your project"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="col-span-3 h-12 px-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-6">
            <Label htmlFor="project-slug" className="text-right text-sm font-medium flex items-center justify-end">
              Project Slug <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="col-span-3 space-y-3">
              <div className="relative">
                <Input
                  id="project-slug"
                  placeholder="your-project-slug"
                  value={slug}
                  onChange={handleSlugChange}
                  className="h-12 px-4"
                  required
                />
                <p className="text-xs mt-2 mb-3 pl-1 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent font-medium">
                  Auto-generated from project name. You can edit it if needed.
                </p>
              </div>
              <p className="text-xs text-muted-foreground pl-1">
                URL: https://feedvote.com/app/{slug || 'your-project-slug'}/board
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
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white h-12 px-6"
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
  const { setStepCompleted, currentStepId, setCurrentStep } = useOnboarding() as any;

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching projects:', error.message);
      toast({
        description: `Failed to fetch projects: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [supabase]);

  const handleProjectCreated = async (project: Project) => {
    setProjects([project, ...projects]);
    setCreateModalOpen(false);

    // If in the create_project onboarding step, mark it as completed and show success
    if (currentStepId === 'create_project') {
      console.log('[ProjectList] 🎯 Marking create_project step as completed');
      await setStepCompleted('create_project', { project_id: project.id });

      // Wait a bit before transitioning to show the success celebration
      setTimeout(async () => {
        await setCurrentStep('dashboard_tour');
      }, 500);
    }
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  // Skeleton card for loading state
  const ProjectSkeleton = () => (
    <div className="bg-card border rounded-md p-4 shadow-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-gray-700 animate-pulse"></div>
          <div className="h-5 w-1/2 rounded-md bg-gray-700 animate-pulse"></div>
        </div>
        <div className="h-3 w-3/4 rounded-md bg-gray-700 animate-pulse"></div>
        <div className="h-12 w-full rounded-md bg-gray-700 animate-pulse"></div>
        <div className="flex justify-between">
          <div className="h-8 w-24 rounded-md bg-gray-700 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 rounded-md bg-gray-700 animate-pulse"></div>
            <div className="h-8 w-16 rounded-md bg-gray-700 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col p-6 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Each project has its own public voting board on FeedVote</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Project Card */}
          <Card
            className="create-project-button overflow-hidden border-2 border-dashed border-border bg-card/20 flex flex-col h-full cursor-pointer hover:border-teal-500/50 hover:scale-105 transition-all duration-200"
            onClick={() => setCreateModalOpen(true)}
          >
            <div className="flex items-center justify-center h-full p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 flex items-center justify-center mb-4">
                  <PlusCircle className="h-8 w-8 text-teal-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Create Project</h3>
                <p className="text-sm text-muted-foreground">Get started with a new project</p>
              </div>
            </div>
          </Card>

          {/* Project Cards or Skeletons */}
          {loading ? (
            // Show multiple skeleton cards when loading
            Array.from({ length: 5 }).map((_, i) => <ProjectSkeleton key={i} />)
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDeleteProject={handleProjectDeleted}
                onUpdateProject={handleProjectUpdated}
              />
            ))
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
