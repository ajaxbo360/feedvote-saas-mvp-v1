'use client';

import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Star, Check, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

// Mock data - in a real app, this would come from an API call
const mockTestimonials = [
  {
    id: '1',
    content: 'This product has completely transformed our workflow. Highly recommended!',
    rating: 5,
    approved: true,
    createdAt: '2023-08-20T11:45:00Z',
    product: {
      name: 'Product One',
      slug: 'product-one',
    },
    createdBy: {
      name: 'Sarah Williams',
      email: 'sarah@example.com',
    },
  },
  {
    id: '2',
    content: "Great product, but there's still room for improvement in the reporting features.",
    rating: 4,
    approved: true,
    createdAt: '2023-08-15T16:30:00Z',
    product: {
      name: 'Product One',
      slug: 'product-one',
    },
    createdBy: {
      name: 'David Brown',
      email: 'david@example.com',
    },
  },
  {
    id: '3',
    content: 'This tool has saved our support team countless hours. The automation is fantastic!',
    rating: 5,
    approved: true,
    createdAt: '2023-08-25T10:15:00Z',
    product: {
      name: 'Product Two',
      slug: 'product-two',
    },
    createdBy: {
      name: 'Robert Davis',
      email: 'robert@example.com',
    },
  },
  {
    id: '4',
    content: 'The interface is intuitive and easy to use. Our team was up and running in minutes.',
    rating: 5,
    approved: false,
    createdAt: '2023-09-01T09:30:00Z',
    product: {
      name: 'Product One',
      slug: 'product-one',
    },
    createdBy: {
      name: 'Lisa Johnson',
      email: 'lisa@example.com',
    },
  },
  {
    id: '5',
    content: 'Customer support is responsive and helpful. They resolved our issue quickly.',
    rating: 4,
    approved: false,
    createdAt: '2023-09-05T14:20:00Z',
    product: {
      name: 'Product Two',
      slug: 'product-two',
    },
    createdBy: {
      name: 'Michael Thompson',
      email: 'michael@example.com',
    },
  },
];

// Interface for testimonial items
interface TestimonialItem {
  id: string;
  content: string;
  rating: number;
  approved: boolean;
  createdAt: string;
  product: {
    name: string;
    slug: string;
  };
  createdBy: {
    name: string;
    email: string;
  };
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    approved: 'all',
    rating: 'all',
    product: 'all',
    search: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTestimonials(mockTestimonials);
      setLoading(false);
    }, 500);
  }, []);

  const filteredItems = testimonials.filter((item) => {
    if (filter.approved !== 'all') {
      const isApproved = filter.approved === 'approved';
      if (item.approved !== isApproved) return false;
    }
    if (filter.rating !== 'all' && item.rating !== parseInt(filter.rating)) return false;
    if (filter.product !== 'all' && item.product.slug !== filter.product) return false;
    if (filter.search && !item.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleApprovalChange = async (id: string, approved: boolean) => {
    // In a real app, this would make an API call to update the approval status
    setTestimonials(testimonials.map((item) => (item.id === id ? { ...item, approved } : item)));

    toast({
      title: approved ? 'Testimonial approved' : 'Testimonial unapproved',
      description: `The testimonial has been ${approved ? 'approved' : 'unapproved'} successfully.`,
      variant: approved ? 'default' : 'destructive',
    });
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle={'Testimonials Management'} />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Testimonials</CardTitle>
          <CardDescription>Manage and approve user testimonials for your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search testimonials..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
            <Select value={filter.approved} onValueChange={(value) => setFilter({ ...filter, approved: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="unapproved">Pending Approval</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.rating} onValueChange={(value) => setFilter({ ...filter, rating: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
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
              <div className="animate-pulse">Loading testimonials data...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Testimonial</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">{item.content}</TableCell>
                    <TableCell>
                      <div className="flex">{renderStars(item.rating)}</div>
                    </TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.createdBy.name}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={item.approved ? 'default' : 'outline'}>
                        {item.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.approved}
                          onCheckedChange={(checked) => handleApprovalChange(item.id, checked)}
                        />
                        <span className="text-sm text-muted-foreground">{item.approved ? 'Approved' : 'Approve'}</span>
                      </div>
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
