import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a singleton instance
let supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'dentalhub-auth',
    storage: window.localStorage,
  },
});

// Export both named and default exports
export const supabase = supabaseInstance;
export default supabaseInstance;

// Error handling
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any sensitive data from localStorage
    localStorage.removeItem('dentalhub-auth');
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

// Real-time Subscriptions Setup
export const setupSubscriptions = () => {
  // Appointments Channel
  supabase.channel('appointments')
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
  supabase.channel('messages')
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
  supabase.channel('comments')
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