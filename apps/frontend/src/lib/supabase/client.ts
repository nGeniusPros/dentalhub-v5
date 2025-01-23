import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY environment variable is required');
}


const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});


// Error handling
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
  if (event === 'SIGNED_IN') {
    console.log('User signed in');
  }
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed');
  }
  if (event === 'PASSWORD_RECOVERY') {
    console.log('Password recovery');
  }
  if (event === 'USER_UPDATED') {
    console.log('User updated');
  }
  if (event === 'INITIAL_SESSION') {
    console.log('Initial session');
  }
});

// Request timeouts
supabase.realtime.setAuth(supabaseKey);

// Response interceptors
supabase.realtime.on('error', (error) => {
  console.error('Supabase Realtime error:', error);
});

// Real-time Subscriptions Setup
const setupSubscriptions = () => {
		// Appointments Channel
		const appointmentsChannel = supabase.channel('appointments');
		appointmentsChannel.on('postgres_changes',
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
		).subscribe();

		// Messages/Notifications Channel
		const messagesChannel = supabase.channel('messages');
		messagesChannel.on('postgres_changes',
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
		).subscribe();

		// Comments Channel
		const commentsChannel = supabase.channel('comments');
		commentsChannel.on('postgres_changes',
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
		).subscribe();
};

// Initialize subscriptions
setupSubscriptions();

export default supabase;