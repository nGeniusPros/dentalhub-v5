import { useState, useEffect } from "react";
import { supabaseService } from "../services/supabase";
import type { Campaign } from "../types";
import type { PostgrestError } from "@supabase/supabase-js";

export interface Campaign {
  id: string;
  name: string;
  type:
    | "recall"
    | "reactivation"
    | "treatment"
    | "appointment"
    | "event"
    | "custom";
  status: "active" | "scheduled" | "completed" | "paused";
  targetCount: number;
  completedCalls: number;
  successRate: number;
  scheduledDate?: string;
  lastRun?: string;
  schedule?: {
    startDate: string;
    startTime: string;
    maxAttempts: number;
    timeBetweenAttempts: number;
  };
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const { data, error } = await supabaseService
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      const formattedCampaigns: Campaign[] = data.map((campaign) => ({
        id: campaign.id,
        name: campaign.name || "",
        type: campaign.type as Campaign["type"],
        status: campaign.status as Campaign["status"],
        targetCount: campaign.metrics?.total || 0,
        completedCalls: campaign.metrics?.completed || 0,
        successRate: campaign.metrics?.successRate || 0,
        scheduledDate: campaign.schedule?.scheduled_time,
        lastRun: campaign.last_run || undefined,
      }));
      setCampaigns(formattedCampaigns);
    } catch (err) {
      setError(err as PostgrestError);
    } finally {
      setLoading(false);
    }
  }

  async function updateCampaignStatus(id: string, status: Campaign["status"]) {
    try {
      setLoading(true);
      const { data, error } = await supabaseService
        .from("campaigns")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      await fetchCampaigns();
      return data;
    } catch (err) {
      setError(err as PostgrestError);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteCampaign(id: string) {
    try {
      setLoading(true);
      const { error } = await supabaseService
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchCampaigns();
    } catch (err) {
      setError(err as PostgrestError);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    updateCampaignStatus,
    deleteCampaign,
  };
}
