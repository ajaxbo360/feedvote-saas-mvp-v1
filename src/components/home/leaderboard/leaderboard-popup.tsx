'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Trophy, Star, Clock, ArrowUpRight, X } from 'lucide-react';
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
  {
    rank: 6,
    name: 'PostBridge',
    logo: '/assets/logos/postbridge.svg',
    improvementScore: 78,
    responseTime: '14h avg',
    shippedFeatures: 18,
    testimonials: 24,
    maker: {
      name: 'Jack Friks',
      avatar: '/assets/avatars/avatar-6.png',
    },
  },
  {
    rank: 7,
    name: 'The100kDatabase',
    logo: '/assets/logos/the100kdatabase.svg',
    improvementScore: 76,
    responseTime: '16h avg',
    shippedFeatures: 15,
    testimonials: 22,
    maker: {
      name: 'Fraser',
      avatar: '/assets/avatars/avatar-7.png',
    },
  },
  {
    rank: 8,
    name: 'ArbiChat',
    logo: '/assets/logos/arbichat.svg',
    improvementScore: 74,
    responseTime: '18h avg',
    shippedFeatures: 14,
    testimonials: 19,
    maker: {
      name: 'Miquel Palet',
      avatar: '/assets/avatars/avatar-8.png',
    },
  },
  {
    rank: 9,
    name: 'WcMultiShipping',
    logo: '/assets/logos/wcmultishipping.svg',
    improvementScore: 72,
    responseTime: '20h avg',
    shippedFeatures: 12,
    testimonials: 17,
    maker: {
      name: 'Alexandre Derocq',
      avatar: '/assets/avatars/avatar-9.png',
    },
  },
  {
    rank: 10,
    name: 'TranslateMom',
    logo: '/assets/logos/translatemom.svg',
    improvementScore: 70,
    responseTime: '22h avg',
    shippedFeatures: 10,
    testimonials: 15,
    maker: {
      name: 'Monta Gao',
      avatar: '/assets/avatars/avatar-10.png',
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

interface LeaderboardPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardPopup({ isOpen, onClose }: LeaderboardPopupProps) {
  const [timeframe, setTimeframe] = useState<'month' | 'all-time'>('month');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-[#0F1720] border border-[#1E2A38] rounded-xl p-6">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-muted-foreground hover:text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 landing-headline">
            SaaS Feedback Leaderboard
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Ranked by feedback responsiveness, not just revenue. See which products are
            <span className="text-accent font-medium"> actually listening</span> to their users.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border rounded-lg p-1">
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
        <Card className="bg-background/50 backdrop-blur-sm border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-3">Product</div>
            <div className="col-span-2 text-center">Improvement Score</div>
            <div className="col-span-2 text-center">Response Time</div>
            <div className="col-span-2 text-center">Shipped Features</div>
            <div className="col-span-2 text-center">Maker</div>
          </div>

          {/* Table Rows */}
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className="grid grid-cols-12 gap-4 p-4 border-b border-border items-center hover:bg-background/70 transition-colors"
            >
              {/* Rank */}
              <div className="col-span-1 flex justify-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${
                    entry.rank === 1
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : entry.rank === 2
                        ? 'bg-gray-400/20 text-gray-400'
                        : entry.rank === 3
                          ? 'bg-amber-700/20 text-amber-700'
                          : 'bg-primary/10 text-primary'
                  }`}
                >
                  {entry.rank}
                </div>
              </div>

              {/* Product */}
              <div className="col-span-3 flex items-center gap-3">
                {entry.logo ? (
                  <Image src={entry.logo} alt={entry.name} width={32} height={32} className="rounded-full" />
                ) : (
                  <LogoPlaceholder name={entry.name} />
                )}
                <div>
                  <div className="font-medium">{entry.name}</div>
                  {entry.badge && (
                    <Badge
                      className={`mt-1 bg-${entry.badge.color}-500/20 text-${entry.badge.color}-400 border border-${entry.badge.color}-500/50`}
                    >
                      <Check className="h-3 w-3 mr-1" /> {entry.badge.text}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Improvement Score */}
              <div className="col-span-2 text-center">
                <div className="font-bold text-lg">{entry.improvementScore}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>

              {/* Response Time */}
              <div className="col-span-2 text-center">
                <div className="font-medium">{entry.responseTime}</div>
                <div className="text-xs text-muted-foreground">to feedback</div>
              </div>

              {/* Shipped Features */}
              <div className="col-span-2 text-center">
                <div className="font-medium">{entry.shippedFeatures}</div>
                <div className="text-xs text-muted-foreground">this {timeframe}</div>
              </div>

              {/* Maker */}
              <div className="col-span-2 flex items-center justify-center gap-2">
                {entry.maker.avatar ? (
                  <Image
                    src={entry.maker.avatar}
                    alt={entry.maker.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                    {entry.maker.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm">{entry.maker.name}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
