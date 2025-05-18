'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function ResetOnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const resetOnboarding = async () => {
    setLoading(true);
    setMessage('Resetting onboarding status...');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage('Error: No authenticated user found');
        return;
      }

      // Reset onboarding status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          onboarding_status: { completed: false, steps: {} },
          onboarding_completed_at: null,
          onboarding_started_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Delete existing onboarding events
      const { error: deleteError } = await supabase.from('onboarding_events').delete().eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Add new onboarding start event
      const { error: insertError } = await supabase.from('onboarding_events').insert({
        user_id: user.id,
        event_type: 'onboarding_started',
        step_id: 'initial',
        metadata: {},
      });

      if (insertError) {
        throw insertError;
      }

      setMessage('Onboarding status reset successfully!');

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/app');
      }, 2000);
    } catch (error: any) {
      console.error('Error resetting onboarding:', error);
      setMessage(`Error: ${error.message || 'Failed to reset onboarding status'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetOnboardingViaRPC = async () => {
    setLoading(true);
    setMessage('Resetting onboarding status via RPC function...');

    try {
      const { data, error } = await supabase.rpc('reset_user_onboarding');

      if (error) {
        throw error;
      }

      console.log('RPC Reset result:', data);
      setMessage('Onboarding status reset successfully via RPC!');

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/app');
      }, 2000);
    } catch (error: any) {
      console.error('Error resetting onboarding via RPC:', error);
      setMessage(`Error: ${error.message || 'Failed to reset onboarding status via RPC'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Onboarding</CardTitle>
          <CardDescription>
            This will reset your onboarding status and allow you to see the onboarding flow again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button onClick={resetOnboarding} disabled={loading} className="w-full">
              {loading ? 'Resetting...' : 'Reset Onboarding Status'}
            </Button>

            <Button onClick={resetOnboardingViaRPC} disabled={loading} className="w-full" variant="outline">
              {loading ? 'Resetting...' : 'Reset Onboarding Status via RPC'}
            </Button>
          </div>

          {message && (
            <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
