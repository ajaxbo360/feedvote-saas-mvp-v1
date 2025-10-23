// Simple script to check onboarding status in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.log('No active session found');
    process.exit(0);
  }

  console.log('User ID:', session.user.id);

  const { data, error } = await supabase
    .from('profiles')
    .select('*, onboarding_status, onboarding_completed_at, onboarding_started_at')
    .eq('id', session.user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    process.exit(1);
  }

  console.log('Profile data:');
  console.log(JSON.stringify(data, null, 2));

  // Check if onboarding functions exist
  const { data: functions, error: funcError } = await supabase.rpc('get_function_list');

  if (funcError) {
    console.error('Error fetching functions:', funcError);
  } else {
    console.log('Available functions:');
    console.log(functions);
  }
}

main();
