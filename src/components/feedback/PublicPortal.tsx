'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FeedbackItem {
  id: string;
  content: string;
  type: string;
  votes: number;
  status: string;
  createdAt: string;
  createdBy: {
    name: string;
    avatar?: string;
  };
}

interface Testimonial {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  createdBy: {
    name: string;
    avatar?: string;
  };
}

interface PublicPortalProps {
  productName: string;
  productDescription: string;
  productLogo?: string;
  feedbackItems: FeedbackItem[];
  testimonials: Testimonial[];
}

export function PublicPortal({
  productName,
  productDescription,
  productLogo,
  feedbackItems,
  testimonials,
}: PublicPortalProps) {
  const [activeTab, setActiveTab] = useState('feedback');

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500',
    planned: 'bg-purple-500',
    in_progress: 'bg-yellow-500',
    completed: 'bg-green-500',
    declined: 'bg-red-500',
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        {productLogo && (
          <div className="h-16 w-16 rounded-full overflow-hidden bg-white p-2">
            <img src={productLogo} alt={productName} className="h-full w-full object-contain" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{productName}</h1>
          <p className="text-muted-foreground">{productDescription}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
        <TabsContent value="feedback" className="mt-6">
          <div className="grid gap-4">
            {feedbackItems.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.type.replace('_', ' ')}</Badge>
                      <Badge className={statusColors[item.status]}>{item.status.replace('_', ' ')}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{item.votes}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{item.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.createdBy.avatar} />
                        <AvatarFallback>{item.createdBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{item.createdBy.name}</span>
                    </div>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="testimonials" className="mt-6">
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {renderStars(testimonial.rating)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{testimonial.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={testimonial.createdBy.avatar} />
                        <AvatarFallback>{testimonial.createdBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{testimonial.createdBy.name}</span>
                    </div>
                    <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
