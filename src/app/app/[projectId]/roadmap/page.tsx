'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { KanbanBoard } from '@/components/dashboard/kanban/KanbanBoard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Calendar, LayoutGrid, TrendingUp, Users, Clock, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PageProps {
  params: {
    projectId: string;
  };
}

// Enhanced timeline item interface
interface TimelineItem {
  id: string;
  title: string;
  description: string;
  quarter: 'Q1 2024' | 'Q2 2024' | 'Q3 2024' | 'Q4 2024';
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  effort: 'S' | 'M' | 'L' | 'XL';
  impact: 'low' | 'medium' | 'high';
  assignedTeam: string;
  dependencies?: string[];
  blockers?: string[];
}

// Resource capacity interface
interface TeamCapacity {
  team: string;
  icon: string;
  current: number;
  total: number;
  upcoming: string[];
}

export default function RoadmapPage({ params }: PageProps) {
  const { projectId } = params;
  const slug = projectId; // The URL param is actually the slug
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline'>('kanban');
  const supabase = createClient();

  // Sample timeline data following our roadmap design
  const [timelineItems] = useState<TimelineItem[]>([
    {
      id: '1',
      title: 'Dark Mode Support',
      description: 'Implement comprehensive dark mode across all components',
      quarter: 'Q1 2024',
      status: 'in_progress',
      progress: 65,
      effort: 'M',
      impact: 'high',
      assignedTeam: 'Frontend Team',
      dependencies: [],
      blockers: [],
    },
    {
      id: '2',
      title: 'Advanced API v2',
      description: 'New API with improved performance and GraphQL support',
      quarter: 'Q2 2024',
      status: 'not_started',
      progress: 0,
      effort: 'XL',
      impact: 'high',
      assignedTeam: 'Backend Team',
      dependencies: ['infrastructure-upgrade'],
      blockers: [],
    },
    {
      id: '3',
      title: 'Mobile App',
      description: 'Native mobile applications for iOS and Android',
      quarter: 'Q3 2024',
      status: 'not_started',
      progress: 0,
      effort: 'XL',
      impact: 'high',
      assignedTeam: 'Mobile Team',
      dependencies: ['api-v2'],
      blockers: ['team-hiring'],
    },
    {
      id: '4',
      title: 'Real-time Collaboration',
      description: 'Live collaboration features with real-time updates',
      quarter: 'Q2 2024',
      status: 'not_started',
      progress: 0,
      effort: 'L',
      impact: 'medium',
      assignedTeam: 'Frontend Team',
      dependencies: [],
      blockers: [],
    },
  ]);

  // Team capacity data
  const [teamCapacity] = useState<TeamCapacity[]>([
    {
      team: 'Frontend',
      icon: '🎨',
      current: 7,
      total: 10,
      upcoming: ['Dark Mode', 'UI Components'],
    },
    {
      team: 'Backend',
      icon: '⚙️',
      current: 8,
      total: 10,
      upcoming: ['API v2', 'Database Migration'],
    },
    {
      team: 'Mobile',
      icon: '📱',
      current: 3,
      total: 10,
      upcoming: ['iOS App', 'Android App'],
    },
    {
      team: 'Design',
      icon: '✨',
      current: 2,
      total: 5,
      upcoming: ['Mobile Designs', 'Accessibility'],
    },
  ]);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }
      setUser(user);
    }

    async function getProject() {
      const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).single();

      if (error || !project) {
        console.error('Project not found:', error?.message || 'No project with this slug');
        redirect('/app');
      }
      setProject(project);
    }

    getUser();
    getProject();
  }, [slug]);

  const getQuarterItems = (quarter: string) => {
    return timelineItems.filter((item) => item.quarter === quarter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getEffortBadgeColor = (effort: string) => {
    switch (effort) {
      case 'XL':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'L':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'M':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  if (!user || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col h-[calc(100vh-4rem)] overflow-auto">
      <div className="flex flex-col flex-1">
        <div className="w-full sticky top-0 bg-white dark:bg-gray-900 z-10 border-b">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h1 className="text-2xl font-semibold">Roadmap</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Strategic planning • Progress tracking • Team coordination
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className="h-8"
                >
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Kanban
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  className="h-8"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Timeline
                </Button>
              </div>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  Sort by Votes <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Upvotes</DropdownMenuItem>
                  <DropdownMenuItem>Release date</DropdownMenuItem>
                  <DropdownMenuItem>Impact</DropdownMenuItem>
                  <DropdownMenuItem>Effort</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="flex-1 pb-8">
          {viewMode === 'kanban' ? (
            <KanbanBoard />
          ) : (
            <div className="p-8 space-y-8">
              {/* Timeline View */}
              <div className="grid grid-cols-4 gap-6">
                {['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'].map((quarter) => (
                  <div key={quarter} className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">{quarter}</h3>
                      <p className="text-sm text-muted-foreground">{getQuarterItems(quarter).length} items planned</p>
                    </div>

                    <div className="space-y-3">
                      {getQuarterItems(quarter).map((item) => (
                        <Card key={item.id} className="p-4">
                          <div className="space-y-3">
                            {/* Title and Status */}
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                                {item.status.replace('_', ' ')}
                              </Badge>
                            </div>

                            {/* Progress Bar */}
                            {item.status === 'in_progress' && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Progress</span>
                                  <span>{item.progress}%</span>
                                </div>
                                <Progress value={item.progress} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                  {item.progress < 30
                                    ? 'Just started'
                                    : item.progress < 70
                                      ? 'Making progress'
                                      : 'Almost done'}
                                </p>
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className={getEffortBadgeColor(item.effort)}>
                                {item.effort}
                              </Badge>
                              <span className={getImpactColor(item.impact)}>{item.impact} impact</span>
                            </div>

                            {/* Team Assignment */}
                            <div className="flex items-center gap-1 text-xs">
                              <Users className="h-3 w-3" />
                              <span>{item.assignedTeam}</span>
                            </div>

                            {/* Dependencies & Blockers */}
                            {(item.dependencies?.length || item.blockers?.length) && (
                              <div className="space-y-1">
                                {item.dependencies && item.dependencies.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-blue-600">
                                    <ArrowRight className="h-3 w-3" />
                                    <span>Depends on {item.dependencies.length} items</span>
                                  </div>
                                )}
                                {item.blockers && item.blockers.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-red-600">
                                    <AlertTriangle className="h-3 w-3" />
                                    <span>{item.blockers.length} blockers</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Resource Planning Section */}
              <div className="mt-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Team Capacity & Resource Planning
                    </CardTitle>
                    <CardDescription>Current team allocation and upcoming workload</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {teamCapacity.map((team) => (
                        <div key={team.team} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">{team.icon}</span>
                            <div>
                              <h4 className="font-medium text-sm">{team.team}</h4>
                              <p className="text-xs text-muted-foreground">
                                {team.current}/{team.total} capacity
                              </p>
                            </div>
                          </div>

                          <Progress value={(team.current / team.total) * 100} className="h-2 mb-3" />

                          <div className="space-y-1">
                            <p className="text-xs font-medium">Upcoming:</p>
                            {team.upcoming.map((item, index) => (
                              <p key={index} className="text-xs text-muted-foreground">
                                • {item}
                              </p>
                            ))}
                          </div>

                          {/* Capacity Warning */}
                          {team.current / team.total > 0.8 && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Near capacity</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Insights */}
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        Resource Insights
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="text-blue-700 dark:text-blue-300">
                          • Frontend team approaching capacity - consider prioritizing or adding resources
                        </div>
                        <div className="text-blue-700 dark:text-blue-300">
                          • Mobile team needs 2 more developers for Q3 goals
                        </div>
                        <div className="text-blue-700 dark:text-blue-300">
                          • Backend team has bandwidth for additional API features
                        </div>
                        <div className="text-blue-700 dark:text-blue-300">
                          • Design bottleneck detected - outsourcing UI work recommended
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Dependency Visualization */}
              <div className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      Feature Dependencies
                    </CardTitle>
                    <CardDescription>Visual representation of feature relationships and blockers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Dependency Flow */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-950 rounded-lg overflow-x-auto">
                        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded whitespace-nowrap">
                          <span className="text-sm font-medium">API v2</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-3 py-2 rounded whitespace-nowrap">
                          <span className="text-sm font-medium">Mobile App</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-3 py-2 rounded whitespace-nowrap">
                          <span className="text-sm font-medium">Offline Mode</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-950 rounded-lg overflow-x-auto">
                        <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded whitespace-nowrap">
                          <span className="text-sm font-medium">API v2</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded whitespace-nowrap">
                          <span className="text-sm font-medium">Advanced Analytics</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-950 rounded-lg overflow-x-auto">
                        <div className="flex items-center gap-2 bg-teal-100 dark:bg-teal-900 px-3 py-2 rounded whitespace-nowrap">
                          <span className="text-sm font-medium">SSO Login</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 px-3 py-2 rounded whitespace-nowrap">
                          <span className="text-sm font-medium">Team Management</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center gap-2 bg-pink-100 dark:bg-pink-900 px-3 py-2 rounded whitespace-nowrap">
                          <span className="text-sm font-medium">Advanced Permissions</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
