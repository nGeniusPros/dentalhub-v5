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
      patients: {
        Row: {
          id: string;
          sikka_patient_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          gender: string | null;
          last_synced_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sikka_patient_id: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          gender?: string | null;
          last_synced_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sikka_patient_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          gender?: string | null;
          last_synced_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
