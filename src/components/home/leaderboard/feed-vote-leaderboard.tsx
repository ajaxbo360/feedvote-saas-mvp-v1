'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Check, Clock, Star } from 'lucide-react';
import Image from 'next/image';

// Define types for the leaderboard entries
interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  logo: string;
  points: number;
  responseTime: string;
  shippedFeatures: number;
  testimonials: number;
  badges: Array<{
    type: 'fast-responder' | 'user-favorite' | 'trusted-builder';
    icon: React.ReactNode;
    label: string;
  }>;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: 'taskeasy',
    rank: 1,
    name: 'TaskEasy',
    logo: '/assets/avatars/avatar-6.png',
    points: 98,
    responseTime: '2h avg',
    shippedFeatures: 32,
    testimonials: 45,
    badges: [
      {
        type: 'fast-responder',
        icon: <Clock className="h-3 w-3 mr-1" />,
        label: 'Fast Responder',
      },
      {
        type: 'user-favorite',
        icon: <Star className="h-3 w-3 mr-1" />,
        label: 'User Favorite',
      },
      {
        type: 'trusted-builder',
        icon: <Check className="h-3 w-3 mr-1" />,
        label: 'Trusted Builder',
      },
    ],
  },
  {
    id: 'crmpro',
    rank: 2,
    name: 'CRMPro',
    logo: '/assets/avatars/avatar-2.png',
    points: 87,
    responseTime: '4h avg',
    shippedFeatures: 28,
    testimonials: 36,
    badges: [
      {
        type: 'user-favorite',
        icon: <Star className="h-3 w-3 mr-1" />,
        label: 'User Favorite',
      },
      {
        type: 'trusted-builder',
        icon: <Check className="h-3 w-3 mr-1" />,
        label: 'Trusted Builder',
      },
    ],
  },
  {
    id: 'devflow',
    rank: 3,
    name: 'DevFlow',
    logo: '/assets/avatars/avatar-3.png',
    points: 82,
    responseTime: '6h avg',
    shippedFeatures: 25,
    testimonials: 30,
    badges: [
      {
        type: 'trusted-builder',
        icon: <Check className="h-3 w-3 mr-1" />,
        label: 'Trusted Builder',
      },
    ],
  },
  {
    id: 'analyticspro',
    rank: 4,
    name: 'AnalyticsPro',
    logo: '/assets/avatars/avatar-4.png',
    points: 76,
    responseTime: '8h avg',
    shippedFeatures: 22,
    testimonials: 28,
    badges: [
      {
        type: 'trusted-builder',
        icon: <Check className="h-3 w-3 mr-1" />,
        label: 'Trusted Builder',
      },
    ],
  },
  {
    id: 'productly',
    rank: 5,
    name: 'Productly',
    logo: '/assets/avatars/avatar-5.png',
    points: 71,
    responseTime: '10h avg',
    shippedFeatures: 19,
    testimonials: 25,
    badges: [
      {
        type: 'trusted-builder',
        icon: <Check className="h-3 w-3 mr-1" />,
        label: 'Trusted Builder',
      },
    ],
  },
];

export function FeedVoteLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // In a real app, you would fetch data from an API
    setEntries(mockLeaderboardData);
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Product Feedback Leaderboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Products that listen to users and ship features faster, ranked by feedback responsiveness
        </p>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="bg-background/50 backdrop-blur-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center justify-center rounded-full bg-primary/10 w-8 h-8 mr-3">
                    <span className="font-medium text-primary">#{entry.rank}</span>
                  </div>
                  <Avatar className="mr-2">
                    <AvatarImage src={entry.logo} alt={entry.name} />
                    <AvatarFallback>{entry.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="flex items-center text-xs">
                      <span className="text-green-500 font-medium">{entry.points}</span>
                      <span className="text-muted-foreground ml-1">points</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex space-x-1">
                  {entry.badges.map((badge) => (
                    <Badge
                      key={badge.type}
                      variant="outline"
                      className={`
                        flex items-center text-xs px-2 py-1
                        ${badge.type === 'fast-responder' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' : ''}
                        ${badge.type === 'user-favorite' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : ''}
                        ${badge.type === 'trusted-builder' ? 'bg-green-500/10 text-green-500 border-green-500/30' : ''}
                      `}
                    >
                      {badge.icon}
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response time:</span>
                  <span className="font-medium">{entry.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipped:</span>
                  <span className="font-medium">{entry.shippedFeatures} features</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Testimonials:</span>
                  <span className="font-medium">{entry.testimonials}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
