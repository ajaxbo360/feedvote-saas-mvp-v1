'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getPaddleInstance } from '@/utils/paddle/get-paddle-instance';

interface Subscription {
  subscription_id: string;
  subscription_status: string;
  price_id: string;
  product_id: string;
  scheduled_change: string | null;
  customer_id: string;
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch customer and subscription data
        // We first need to find the customer by email
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('customer_id')
          .eq('email', user.email)
          .single();

        if (customerError && customerError.code !== 'PGRST116') {
          console.error('Error fetching customer:', customerError);
        }

        if (customerData) {
          const { data: subData, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('customer_id', customerData.customer_id)
            .single();

          if (subError && subError.code !== 'PGRST116') {
            console.error('Error fetching subscription:', subError);
          }

          if (subData) {
            setSubscription(subData);
          }
        }
      } catch (error) {
        console.error('Error loading billing data:', error);
        toast({
          description: 'Failed to load billing information',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, toast]);

  const handleManageSubscription = async () => {
    // In a real implementation, this would open the Paddle customer portal
    // For MVP, we can redirect to a generic management page or show a toast
    toast({
      description: 'Redirecting to subscription management...',
    });
    // window.location.href = 'YOUR_PADDLE_CUSTOMER_PORTAL_URL';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isPro = subscription?.subscription_status === 'active';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription & Billing</h3>
        <p className="text-sm text-muted-foreground">Manage your subscription plan and billing details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            <Badge variant={isPro ? 'default' : 'secondary'}>{isPro ? 'Pro Plan' : 'Free Plan'}</Badge>
          </CardTitle>
          <CardDescription>
            {isPro
              ? 'You are currently on the Pro plan. Thank you for your support!'
              : 'You are currently on the Free plan. Upgrade to unlock more features.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{isPro ? 'Pro Features Active' : 'Free Features'}</p>
              <p className="text-sm text-muted-foreground">
                {isPro
                  ? 'Unlimited projects, priority support, and advanced analytics.'
                  : 'Up to 1 project, community support, and basic analytics.'}
              </p>
            </div>
            {isPro ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
          </div>

          {subscription && (
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{subscription.subscription_status}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Next Billing Date</span>
                <span className="font-medium">
                  {subscription.scheduled_change ? new Date(subscription.scheduled_change).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleManageSubscription} disabled={!subscription}>
            Manage Subscription
          </Button>
          {!isPro && (
            <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600">
              Upgrade to Pro
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
