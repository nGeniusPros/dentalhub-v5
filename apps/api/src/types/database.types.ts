// Generated types placeholder - Update after Supabase config is resolved
export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          provider_id: string;
          start_time: string;
          end_time: string;
          status: 'scheduled' | 'completed' | 'canceled';
          // ... other fields
        };
        Insert: {
          // ... insert fields
        };
        Update: {
          // ... update fields
        };
      };
    };
  };
}