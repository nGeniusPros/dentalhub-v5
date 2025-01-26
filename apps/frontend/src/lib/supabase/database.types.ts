export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          patient_id: string;
          staff_id: string;
          date: string;
          time: string;
          status: "scheduled" | "confirmed" | "cancelled" | "completed";
          type: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["appointments"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
      };
      patient_records: {
        Row: {
          id: string;
          patient_id: string;
          medical_history: Record<string, any>;
          dental_history: Record<string, any>;
          insurance_info: Record<string, any>;
          documents: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["patient_records"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["patient_records"]["Insert"]
        >;
      };
      staff_schedules: {
        Row: {
          id: string;
          staff_id: string;
          date: string;
          shifts: Array<{
            start: string;
            end: string;
            break_start?: string;
            break_end?: string;
          }>;
          time_off: boolean;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["staff_schedules"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["staff_schedules"]["Insert"]
        >;
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["messages"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "appointment" | "message" | "system" | "reminder";
          title: string;
          content: string;
          read: boolean;
          action_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["notifications"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["notifications"]["Insert"]
        >;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for the specialized hooks
export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type PatientRecord =
  Database["public"]["Tables"]["patient_records"]["Row"];
export type StaffSchedule =
  Database["public"]["Tables"]["staff_schedules"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
