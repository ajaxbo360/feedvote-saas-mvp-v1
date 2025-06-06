'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OnboardingDebugger() {
  const [profileData, setProfileData] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      setSessionData(session);

      if (!session?.user) {
        setProfileData(null);
        setError('No authenticated user');
        setLoading(false);
        return;
      }

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*, onboarding_status, onboarding_completed_at, onboarding_started_at')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfileData(profile);
    } catch (err: any) {
      console.error('Error fetching debug data:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Force reset the onboarding status
  const resetOnboardingStatus = async () => {
    try {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setError('No authenticated user');
        return;
      }

      // Update profiles table directly
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          onboarding_status: { completed: false, steps: {} },
          onboarding_completed_at: null,
          onboarding_started_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      // Delete existing onboarding events
      await supabase.from('onboarding_events').delete().eq('user_id', session.user.id);

      // Create new onboarding start event
      await supabase.from('onboarding_events').insert({
        user_id: session.user.id,
        event_type: 'onboarding_started',
        step_id: 'initial',
        metadata: {},
      });

      // Reload data
      fetchData();

      // Force reload the page after a second to reinitialize everything
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error('Error resetting onboarding:', err);
      setError(err.message || 'Unknown error');
    }
  };

  // Force enable onboarding directly in the UI
  const forceEnableOnboardingUI = () => {
    try {
      // This creates a direct access to the onboarding state in localStorage
      // which will allow us to bypass the normal initialization

      const onboardingState = {
        isEnabled: true,
        isLoading: false,
        currentStepId: 'welcome',
        isCompleted: false,
        persistent: true,
        steps: {
          welcome: {
            id: 'welcome',
            title: 'Welcome to Feedvote',
            description: 'Get started with your first project',
            completed: false,
            position: 0,
          },
          create_project: {
            id: 'create_project',
            title: 'Create your first project',
            description: 'Set up a project to collect feedback',
            completed: false,
            position: 1,
          },
          dashboard_tour: {
            id: 'dashboard_tour',
            title: 'Explore your dashboard',
            description: 'Learn how to manage feedback',
            completed: false,
            position: 2,
          },
        },
      };

      // Store the state in localStorage
      localStorage.setItem('onboarding-state', JSON.stringify(onboardingState));

      // Force reload the page to reinitialize with the new state
      window.location.href = '/app';
    } catch (err: any) {
      console.error('Error forcing onboarding state:', err);
      setError(err.message || 'Unknown error');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Onboarding Debugger</span>
          <Button size="sm" onClick={fetchData} variant="outline" disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </CardTitle>
        <CardDescription className="text-base pt-2">
          Debug information to troubleshoot onboarding issues
          <div className="mt-2 text-sm bg-blue-50 p-2 rounded border border-blue-200">
            <strong>Note:</strong> Onboarding is now auto-detected for new users with no projects.
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Auth Status:</h3>
          <pre className="p-3 bg-slate-100 dark:bg-slate-800 rounded overflow-auto max-h-40">
            {sessionData ? JSON.stringify(sessionData, null, 2) : 'Not authenticated'}
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Profile Data:</h3>
          <pre className="p-3 bg-slate-100 dark:bg-slate-800 rounded overflow-auto max-h-60">
            {profileData ? JSON.stringify(profileData, null, 2) : 'No profile data'}
          </pre>
        </div>

        <Button
          onClick={resetOnboardingStatus}
          className="w-full"
          variant="destructive"
          disabled={loading || !sessionData}
        >
          Force Reset Onboarding Status & Reload
        </Button>

        <Button
          onClick={forceEnableOnboardingUI}
          className="w-full"
          variant="outline"
          disabled={loading || !sessionData}
        >
          Force Enable Onboarding
        </Button>

        <Button
          onClick={() => {
            try {
              const state = localStorage.getItem('onboarding-state');
              if (state) {
                const parsedState = JSON.parse(state);
                console.log('Current onboarding state in localStorage:', parsedState);
                alert('Onboarding state logged to console');
              } else {
                console.log('No onboarding state in localStorage');
                alert('No onboarding state found in localStorage');
              }
            } catch (e) {
              console.error('Error parsing onboarding state:', e);
              alert('Error parsing onboarding state. See console for details.');
            }
          }}
          className="w-full mt-2"
          variant="outline"
        >
          Check Onboarding State
        </Button>
      </CardContent>
    </Card>
  );
}
