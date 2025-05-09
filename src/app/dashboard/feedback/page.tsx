'use client';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ThumbsUp } from 'lucide-react';

// Define types for the feedback items
interface Product {
  name: string;
  slug: string;
}

interface User {
  name: string;
  email: string;
}

interface FeedbackItem {
  id: string;
  content: string;
  type: string;
  votes: number;
  status: string;
  createdAt: string;
  product: Product;
  createdBy: User;
}

// Mock data - in a real app, this would come from an API call
const mockFeedbackItems: FeedbackItem[] = [
  {
    id: '1',
    content: 'I would love to see a dark mode option in the next update.',
    type: 'feature_request',
    votes: 42,
    status: 'planned',
    createdAt: '2023-09-15T10:30:00Z',
    product: {
      name: 'Product One',
      slug: 'product-one',
    },
    createdBy: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  },
  {
    id: '2',
    content: 'The dashboard is not loading correctly on mobile devices.',
    type: 'bug_report',
    votes: 18,
    status: 'in_progress',
    createdAt: '2023-09-10T14:20:00Z',
    product: {
      name: 'Product One',
      slug: 'product-one',
    },
    createdBy: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  },
  {
    id: '3',
    content: 'Could you add a monthly subscription option?',
    type: 'plan_suggestion',
    votes: 31,
    status: 'new',
    createdAt: '2023-09-05T09:15:00Z',
    product: {
      name: 'Product Two',
      slug: 'product-two',
    },
    createdBy: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
    },
  },
  {
    id: '4',
    content: 'Please add integration with Slack.',
    type: 'feature_request',
    votes: 56,
    status: 'completed',
    createdAt: '2023-09-12T08:30:00Z',
    product: {
      name: 'Product Two',
      slug: 'product-two',
    },
    createdBy: {
      name: 'Alex Turner',
      email: 'alex@example.com',
    },
  },
  {
    id: '5',
    content: 'The search functionality is not working properly.',
    type: 'bug_report',
    votes: 23,
    status: 'in_progress',
    createdAt: '2023-09-08T13:45:00Z',
    product: {
      name: 'Product Two',
      slug: 'product-two',
    },
    createdBy: {
      name: 'Emma Wilson',
      email: 'emma@example.com',
    },
  },
];

export default function FeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: 'all',
    type: 'all',
    product: 'all',
    search: '',
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeedbackItems(mockFeedbackItems);
      setLoading(false);
    }, 500);
  }, []);

  const filteredItems = feedbackItems.filter((item) => {
    if (filter.status !== 'all' && item.status !== filter.status) return false;
    if (filter.type !== 'all' && item.type !== filter.type) return false;
    if (filter.product !== 'all' && item.product.slug !== filter.product) return false;
    if (filter.search && !item.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  // Define status colors with proper TypeScript index signature
  const statusColors: Record<string, string> = {
    new: 'bg-blue-500',
    planned: 'bg-purple-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
    declined: 'bg-red-500',
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // In a real app, this would make an API call to update the status
    setFeedbackItems(feedbackItems.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={'Feedback Management'} />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Feedback Items</CardTitle>
          <CardDescription>Manage and respond to user feedback for your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search feedback..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
            <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.type} onValueChange={(value) => setFilter({ ...filter, type: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="bug_report">Bug Report</SelectItem>
                <SelectItem value="plan_suggestion">Plan Suggestion</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.product} onValueChange={(value) => setFilter({ ...filter, product: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="product-one">Product One</SelectItem>
                <SelectItem value="product-two">Product Two</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse">Loading feedback data...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">{item.content}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{item.votes}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status]}>{item.status.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Select value={item.status} onValueChange={(value) => handleStatusChange(item.id, value)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
