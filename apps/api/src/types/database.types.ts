// Generated types from Supabase database
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          role: "admin" | "dentist" | "hygienist" | "staff";
          practice_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: "admin" | "dentist" | "hygienist" | "staff";
          practice_id: string;
        };
        Update: {
          role?: "admin" | "dentist" | "hygienist" | "staff";
          practice_id?: string;
          updated_at?: string;
        };
      };
    };
  };
};
