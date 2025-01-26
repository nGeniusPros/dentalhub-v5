export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CampaignType = "voice" | "sms" | "email";
export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "completed"
  | "failed";

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          name: string;
          type: CampaignType;
          status: CampaignStatus;
          schedule: Json | null;
          audience: Json;
          content: Json;
          metrics: Json;
          settings: Json | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: CampaignType;
          status?: CampaignStatus;
          schedule?: Json | null;
          audience: Json;
          content: Json;
          metrics?: Json;
          settings?: Json | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: CampaignType;
          status?: CampaignStatus;
          schedule?: Json | null;
          audience?: Json;
          content?: Json;
          metrics?: Json;
          settings?: Json | null;
          metadata?: Json | null;
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
    Enums: {
      campaign_type: CampaignType;
      campaign_status: CampaignStatus;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
