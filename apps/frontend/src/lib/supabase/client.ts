import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (supabase) return supabase;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL environment variable is required');
  }

  if (!supabaseKey) {
    throw new Error('VITE_SUPABASE_ANON_KEY environment variable is required');
  }

  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });

  // Error handling
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    } else if (event === 'SIGNED_IN') {
      console.log('User signed in:', session?.user?.email);
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed');
    }
  });

  // Log initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    console.log('Initial session', session);
  });

  return supabase;
};

// Real-time Subscriptions Setup
export const setupSubscriptions = () => {
  const client = getSupabaseClient();

  // Appointments Channel
  client.channel('appointments')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'appointments' },
      (payload) => {
        console.log('Appointments change:', payload);
        switch (payload.eventType) {
          case 'INSERT':
            console.log('New appointment:', payload.new);
            break;
          case 'UPDATE':
            console.log('Modified appointment:', payload.new);
            break;
          case 'DELETE':
            console.log('Cancelled appointment:', payload.old);
            break;
        }
      }
    )
    .subscribe();

  // Messages/Notifications Channel
  client.channel('messages')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'messages_notifications' },
      (payload) => {
        console.log('Messages/Notifications change:', payload);
        switch (payload.eventType) {
          case 'INSERT':
            if (payload.new.type === 'message') {
              console.log('New message:', payload.new);
            } else if (payload.new.type === 'reminder') {
              console.log('New reminder:', payload.new);
            }
            break;
          case 'UPDATE':
            console.log('Message/Notification status updated:', payload.new);
            break;
        }
      }
    )
    .subscribe();

  // Comments Channel
  client.channel('comments')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'comments' },
      (payload) => {
        console.log('Comments change:', payload);
        switch (payload.eventType) {
          case 'INSERT':
            console.log('New comment:', payload.new);
            break;
          case 'UPDATE':
            console.log('Modified comment:', payload.new);
            break;
          case 'DELETE':
            console.log('Deleted comment:', payload.old);
            break;
        }
      }
    )
    .subscribe();
};

// Initialize subscriptions
setupSubscriptions();

// Export the getter function as default
export default getSupabaseClient;