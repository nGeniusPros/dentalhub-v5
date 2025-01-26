export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          address: string | null;
          medical_history: string | null;
          status: string | null;
          balance: number | null;
        };
        Insert: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          medical_history?: string | null;
          status?: string | null;
          balance?: number | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          medical_history?: string | null;
          status?: string | null;
          balance?: number | null;
        };
      };
      appointments: {
        Row: {
          id: string;
          start_time: string;
          status: string;
        };
        Insert: {
          id?: string;
          start_time: string;
          status: string;
        };
        Update: {
          id?: string;
          start_time: string;
          status: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          name: string | null;
          type:
            | "recall"
            | "reactivation"
            | "treatment"
            | "appointment"
            | "event"
            | "custom"
            | null;
          status: "active" | "scheduled" | "completed" | "paused" | null;
          metrics: {
            total: number;
            completed: number;
            successRate: number;
          } | null;
          schedule: {
            scheduled_time: string;
            start_time?: string;
            max_attempts?: number;
            time_between_attempts?: number;
          } | null;
          last_run: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          type?:
            | "recall"
            | "reactivation"
            | "treatment"
            | "appointment"
            | "event"
            | "custom"
            | null;
          status?: "active" | "scheduled" | "completed" | "paused" | null;
          metrics?: {
            total: number;
            completed: number;
            successRate: number;
          } | null;
          schedule?: {
            scheduled_time: string;
            start_time?: string;
            max_attempts?: number;
            time_between_attempts?: number;
          } | null;
          last_run?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          type?:
            | "recall"
            | "reactivation"
            | "treatment"
            | "appointment"
            | "event"
            | "custom"
            | null;
          status?: "active" | "scheduled" | "completed" | "paused" | null;
          metrics?: {
            total: number;
            completed: number;
            successRate: number;
          } | null;
          schedule?: {
            scheduled_time: string;
            start_time?: string;
            max_attempts?: number;
            time_between_attempts?: number;
          } | null;
          last_run?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
