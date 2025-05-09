'use client';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Check, Info, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

// Define the badge type
interface BadgeCriteria {
  feedbackCount?: number;
  testimonialCount?: number;
  responseRate?: number;
  implementedFeatures?: number;
  totalUpvotes?: number;
  leaderboardRank?: number;
  current: number | string;
}

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
  criteria: BadgeCriteria;
  earnedAt?: string;
  locked?: boolean;
}

// Mock data - in a real app, this would come from an API call
const mockBadges: BadgeType[] = [
  {
    id: '1',
    name: 'Feedback Champion',
    description: 'Received 50+ pieces of feedback',
    icon: '🏆',
    earned: true,
    progress: 100,
    criteria: {
      feedbackCount: 50,
      current: 68,
    },
    earnedAt: '2023-08-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Testimonial Collector',
    description: 'Collected 25+ testimonials',
    icon: '⭐',
    earned: true,
    progress: 100,
    criteria: {
      testimonialCount: 25,
      current: 32,
    },
    earnedAt: '2023-09-01T14:20:00Z',
  },
  {
    id: '3',
    name: 'Responsive Founder',
    description: 'Responded to 90% of feedback within 48 hours',
    icon: '⚡',
    earned: true,
    progress: 100,
    criteria: {
      responseRate: 90,
      current: 95,
    },
    earnedAt: '2023-08-20T09:15:00Z',
  },
  {
    id: '4',
    name: 'Feature Implementer',
    description: 'Implemented 10+ user-requested features',
    icon: '🛠️',
    earned: false,
    progress: 70,
    criteria: {
      implementedFeatures: 10,
      current: 7,
    },
  },
  {
    id: '5',
    name: 'Community Builder',
    description: 'Achieved 100+ upvotes across all feedback',
    icon: '🌟',
    earned: false,
    progress: 85,
    criteria: {
      totalUpvotes: 100,
      current: 85,
    },
  },
  {
    id: '6',
    name: 'Top 10 Leaderboard',
    description: 'Reached the top 10 on the leaderboard',
    icon: '🏅',
    earned: false,
    progress: 0,
    criteria: {
      leaderboardRank: 10,
      current: 'Not ranked',
    },
    locked: true,
  },
];

export default function BadgesPage() {
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBadges(mockBadges);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={'Badges'} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-background/50 backdrop-blur-[24px] border-border">
                  <CardContent className="p-6">
                    <div className="animate-pulse flex flex-col items-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-gray-700"></div>
                      <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                      <div className="h-3 w-full bg-gray-700 rounded"></div>
                      <div className="h-2 w-full bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
          : badges.map((badge) => (
              <Card
                key={badge.id}
                className={`bg-background/50 backdrop-blur-[24px] border-border ${badge.locked ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`text-4xl mb-4 h-16 w-16 flex items-center justify-center rounded-full ${
                        badge.earned
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : badge.locked
                            ? 'bg-gray-500/20 border-2 border-gray-500'
                            : 'bg-blue-500/20 border-2 border-blue-500'
                      }`}
                    >
                      {badge.locked ? <Lock className="h-8 w-8 text-gray-400" /> : badge.icon}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{badge.name}</h3>
                      {badge.earned && <Check className="h-5 w-5 text-green-500" />}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>

                    {!badge.locked && (
                      <>
                        <div className="w-full mb-2">
                          <Progress value={badge.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                          <span>
                            {badge.earned
                              ? 'Earned on ' +
                                (badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'unknown date')
                              : `${badge.criteria.current}/${Object.values(badge.criteria)[0]} ${Object.keys(
                                  badge.criteria,
                                )[0]
                                  .replace(/([A-Z])/g, ' $1')
                                  .toLowerCase()}`}
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {Object.keys(badge.criteria)[0]
                                    .replace(/([A-Z])/g, ' $1')
                                    .toLowerCase()}
                                  : {badge.criteria.current}/{Object.values(badge.criteria)[0]}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </>
                    )}

                    {badge.locked && (
                      <Badge variant="outline" className="mt-2">
                        Locked
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </main>
  );
}
