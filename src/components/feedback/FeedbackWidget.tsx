'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FeedbackWidgetProps {
  productId: string;
  onSubmit?: (feedback: { content: string; type: string }) => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FeedbackWidget({ productId, onSubmit, position = 'bottom-right' }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [type, setType] = useState('feature_request');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your feedback',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically make an API call to submit the feedback
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit({ content, type });
      }
      
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
      });
      
      setContent('');
      setType('feature_request');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      {isOpen ? (
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Send Feedback</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Share your thoughts, ideas, or report issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature_request">Feature Request</SelectItem>
                    <SelectItem value="bug_report">Bug Report</SelectItem>
                    <SelectItem value="plan_suggestion">Plan Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
