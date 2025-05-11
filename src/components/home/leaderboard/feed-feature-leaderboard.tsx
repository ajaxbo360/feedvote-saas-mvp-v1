'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Trophy, Star, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Define the leaderboard entry type
interface LeaderboardEntry {
  rank: number;
  name: string;
  logo: string;
  improvementScore: number;
  responseTime: string;
  shippedFeatures: number;
  testimonials: number;
  maker: {
    name: string;
    avatar: string;
  };
  badge?: {
    text: string;
    color: string;
  };
}

// Sample leaderboard data
const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'TaskEasy',
    logo: '/assets/logos/taskeasy.svg',
    improvementScore: 98,
    responseTime: '2h avg',
    shippedFeatures: 32,
    testimonials: 45,
    maker: {
      name: 'Sarah Chen',
      avatar: '/assets/avatars/avatar-1.png',
    },
    badge: {
      text: 'Fast Responder',
      color: 'green',
    },
  },
  {
    rank: 2,
    name: 'CRMPro',
    logo: '/assets/logos/crmpro.svg',
    improvementScore: 92,
    responseTime: '5h avg',
    shippedFeatures: 28,
    testimonials: 36,
    maker: {
      name: 'Alex Rivera',
      avatar: '/assets/avatars/avatar-2.png',
    },
    badge: {
      text: 'User Favorite',
      color: 'blue',
    },
  },
  {
    rank: 3,
    name: 'DevFlow',
    logo: '/assets/logos/devflow.svg',
    improvementScore: 87,
    responseTime: '8h avg',
    shippedFeatures: 24,
    testimonials: 29,
    maker: {
      name: 'Jamie Wong',
      avatar: '/assets/avatars/avatar-3.png',
    },
  },
  {
    rank: 4,
    name: 'AnalyticsPro',
    logo: '/assets/logos/analyticspro.svg',
    improvementScore: 85,
    responseTime: '12h avg',
    shippedFeatures: 19,
    testimonials: 27,
    maker: {
      name: 'Michael Scott',
      avatar: '/assets/avatars/avatar-4.png',
    },
  },
  {
    rank: 5,
    name: 'Yeema',
    logo: '/assets/logos/yeema.svg',
    improvementScore: 82,
    responseTime: '10h avg',
    shippedFeatures: 22,
    testimonials: 31,
    maker: {
      name: 'Lisa Johnson',
      avatar: '/assets/avatars/avatar-5.png',
    },
  },
];

// Placeholder for missing logos
const LogoPlaceholder = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
      {initials}
    </div>
  );
};

export function FeedVoteLeaderboard() {
  const [timeframe, setTimeframe] = useState<'month' | 'all-time'>('month');

  return (
    <section className="py-16 relative" id="leaderboard">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 landing-headline">SaaS Leaderboard</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ranked by feedback responsiveness, not just revenue. See which products are
            <span className="text-accent font-medium"> actually listening</span> to their users.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-1 shadow-sm">
            <Button
              variant={timeframe === 'month' ? 'default' : 'ghost'}
              onClick={() => setTimeframe('month')}
              className="rounded-md"
            >
              This Month
            </Button>
            <Button
              variant={timeframe === 'all-time' ? 'default' : 'ghost'}
              onClick={() => setTimeframe('all-time')}
              className="rounded-md"
            >
              All-time
            </Button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-card/95 backdrop-blur-sm border border-border overflow-hidden shadow-md">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-sm font-medium bg-muted/30">
            <div className="col-span-1 text-center text-foreground">Rank</div>
            <div className="col-span-3 text-foreground">Product</div>
            <div className="col-span-2 text-center text-foreground">Improvement Score</div>
            <div className="col-span-2 text-center text-foreground">Response Time</div>
            <div className="col-span-2 text-center text-foreground">Shipped Features</div>
            <div className="col-span-2 text-center text-foreground">Maker</div>
          </div>

          {/* Table Rows */}
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className="grid grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-muted/20 transition-colors"
            >
              {/* Rank */}
              <div className="col-span-1 flex justify-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1
                      ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-500'
                      : entry.rank === 2
                        ? 'bg-gray-400/20 text-gray-700 dark:text-gray-400'
                        : entry.rank === 3
                          ? 'bg-amber-700/20 text-amber-800 dark:text-amber-700'
                          : 'bg-primary/10 text-primary'
                  }`}
                >
                  {entry.rank}
                </div>
              </div>

              {/* Product */}
              <div className="col-span-3 flex items-center gap-3">
                {entry.logo ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-background border border-border p-1">
                    <Image src={entry.logo} alt={entry.name} width={32} height={32} className="rounded-full" />
                  </div>
                ) : (
                  <LogoPlaceholder name={entry.name} />
                )}
                <div>
                  <div className="font-medium text-foreground">{entry.name}</div>
                  {entry.badge && (
                    <Badge
                      className={`mt-1 bg-${entry.badge.color}-500/20 text-${entry.badge.color}-700 dark:text-${entry.badge.color}-400 border border-${entry.badge.color}-500/50`}
                    >
                      <Check className="h-3 w-3 mr-1" /> {entry.badge.text}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Improvement Score */}
              <div className="col-span-2 text-center">
                <div className="font-bold text-lg text-foreground">{entry.improvementScore}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>

              {/* Response Time */}
              <div className="col-span-2 text-center">
                <div className="font-medium text-foreground">{entry.responseTime}</div>
                <div className="text-xs text-muted-foreground">to feedback</div>
              </div>

              {/* Shipped Features */}
              <div className="col-span-2 text-center">
                <div className="font-medium text-foreground">{entry.shippedFeatures}</div>
                <div className="text-xs text-muted-foreground">this {timeframe}</div>
              </div>

              {/* Maker */}
              <div className="col-span-2 flex items-center justify-center gap-2">
                {entry.maker.avatar ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-border">
                    <Image
                      src={entry.maker.avatar}
                      alt={entry.maker.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                    {entry.maker.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm text-foreground">{entry.maker.name}</span>
              </div>
            </div>
          ))}
        </Card>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button
            className="backdrop-blur-sm border border-border hover:bg-muted/20 rounded-xl px-6 py-2 font-semibold transition-all"
            asChild
          >
            <Link href="/signup">Join the Leaderboard</Link>
          </Button>
        </div>

        {/* Press L to see leaderboards */}
        <div className="mt-12 text-center text-sm opacity-70">
          <kbd className="px-2 py-1 bg-muted border border-border rounded-md shadow-sm">L</kbd>
          <span className="ml-2 text-muted-foreground">to see the Leaderboards</span>
        </div>
      </div>
    </section>
  );
}
