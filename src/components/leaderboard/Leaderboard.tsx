'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ExternalLink, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface LeaderboardEntry {
  id: string;
  rank: number;
  productName: string;
  productSlug: string;
  logoUrl?: string;
  websiteUrl: string;
  score: number;
  feedbackCount: number;
  testimonialCount: number;
  badgeCount: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const [sortField, setSortField] = useState<keyof LeaderboardEntry>('score');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedEntries = [...entries].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // Safely handle undefined values (though they shouldn't be undefined based on our schema)
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
    if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const handleSort = (field: keyof LeaderboardEntry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: keyof LeaderboardEntry) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-card text-card-foreground">
        <CardTitle className="text-2xl">SaaS Leaderboard</CardTitle>
        <CardDescription className="text-muted-foreground">
          Top products ranked by user feedback, testimonials, and engagement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-12 text-foreground">Rank</TableHead>
              <TableHead className="text-foreground">Product</TableHead>
              <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort('score')}>
                Score {getSortIcon('score')}
              </TableHead>
              <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort('feedbackCount')}>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Feedback {getSortIcon('feedbackCount')}</span>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort('testimonialCount')}>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Testimonials {getSortIcon('testimonialCount')}</span>
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-foreground" onClick={() => handleSort('badgeCount')}>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>Badges {getSortIcon('badgeCount')}</span>
                </div>
              </TableHead>
              <TableHead className="text-right text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map((entry) => (
              <TableRow key={entry.id} className="border-b hover:bg-muted/20">
                <TableCell className="font-medium text-foreground">
                  {entry.rank <= 3 ? (
                    <Badge
                      className={
                        entry.rank === 1
                          ? 'bg-yellow-500 text-white'
                          : entry.rank === 2
                            ? 'bg-gray-500 text-white'
                            : 'bg-amber-700 text-white'
                      }
                    >
                      #{entry.rank}
                    </Badge>
                  ) : (
                    `#${entry.rank}`
                  )}
                </TableCell>
                <TableCell className="text-foreground">
                  <div className="flex items-center gap-2">
                    {entry.logoUrl && (
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-background p-1 border border-border">
                        <img src={entry.logoUrl} alt={entry.productName} className="h-full w-full object-contain" />
                      </div>
                    )}
                    <span className="font-medium">{entry.productName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-foreground">{entry.score}</TableCell>
                <TableCell className="text-foreground">{entry.feedbackCount}</TableCell>
                <TableCell className="text-foreground">{entry.testimonialCount}</TableCell>
                <TableCell className="text-foreground">{entry.badgeCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/products/${entry.productSlug}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={entry.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
