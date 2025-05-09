'use client';

import { PublicPortal } from '@/components/feedback/PublicPortal';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Mock data - in a real app, this would come from an API call
const mockProducts = {
  'product-one': {
    name: 'Product One',
    description: 'A powerful SaaS tool for productivity',
    logo: '/assets/icons/logo/aeroedit-logo-icon.svg',
    feedbackItems: [
      {
        id: '1',
        content: 'I would love to see a dark mode option in the next update.',
        type: 'feature_request',
        votes: 42,
        status: 'planned',
        createdAt: '2023-09-15T10:30:00Z',
        createdBy: {
          name: 'John Doe',
        },
      },
      {
        id: '2',
        content: 'The dashboard is not loading correctly on mobile devices.',
        type: 'bug_report',
        votes: 18,
        status: 'in_progress',
        createdAt: '2023-09-10T14:20:00Z',
        createdBy: {
          name: 'Jane Smith',
        },
      },
      {
        id: '3',
        content: 'Could you add a monthly subscription option?',
        type: 'plan_suggestion',
        votes: 31,
        status: 'new',
        createdAt: '2023-09-05T09:15:00Z',
        createdBy: {
          name: 'Mike Johnson',
        },
      },
    ],
    testimonials: [
      {
        id: '1',
        content: 'This product has completely transformed our workflow. Highly recommended!',
        rating: 5,
        createdAt: '2023-08-20T11:45:00Z',
        createdBy: {
          name: 'Sarah Williams',
        },
      },
      {
        id: '2',
        content: 'Great product, but there\'s still room for improvement in the reporting features.',
        rating: 4,
        createdAt: '2023-08-15T16:30:00Z',
        createdBy: {
          name: 'David Brown',
        },
      },
    ],
  },
  'product-two': {
    name: 'Product Two',
    description: 'Streamline your customer support',
    logo: '/assets/icons/logo/aeroedit-logo-icon.svg',
    feedbackItems: [
      {
        id: '1',
        content: 'Please add integration with Slack.',
        type: 'feature_request',
        votes: 56,
        status: 'completed',
        createdAt: '2023-09-12T08:30:00Z',
        createdBy: {
          name: 'Alex Turner',
        },
      },
      {
        id: '2',
        content: 'The search functionality is not working properly.',
        type: 'bug_report',
        votes: 23,
        status: 'in_progress',
        createdAt: '2023-09-08T13:45:00Z',
        createdBy: {
          name: 'Emma Wilson',
        },
      },
    ],
    testimonials: [
      {
        id: '1',
        content: 'This tool has saved our support team countless hours. The automation is fantastic!',
        rating: 5,
        createdAt: '2023-08-25T10:15:00Z',
        createdBy: {
          name: 'Robert Davis',
        },
      },
    ],
  },
};

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (mockProducts[slug as keyof typeof mockProducts]) {
        setProduct(mockProducts[slug as keyof typeof mockProducts]);
      }
      setLoading(false);
    }, 500);
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="animate-pulse">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicPortal
        productName={product.name}
        productDescription={product.description}
        productLogo={product.logo}
        feedbackItems={product.feedbackItems}
        testimonials={product.testimonials}
      />
    </div>
  );
}
