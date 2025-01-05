import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export interface Campaign {
  id: string;
  name: string;
  type: 'recall' | 'reactivation' | 'treatment' | 'appointment' | 'event' | 'custom';
  status: 'active' | 'scheduled' | 'completed' | 'paused';
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

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Database['public']['Tables']['campaigns']['Row'][], error: any };

      if (supabaseError) {
        throw supabaseError;
      }

      const formattedCampaigns: Campaign[] = data.map((campaign) => ({
        id: campaign.id,
        name: campaign.name || '',
        type: campaign.type as Campaign['type'],
        status: campaign.status as Campaign['status'],
        targetCount: campaign.metrics?.total || 0,
        completedCalls: campaign.metrics?.completed || 0,
        successRate: campaign.metrics?.successRate || 0,
        scheduledDate: campaign.schedule?.scheduled_time,
        lastRun: campaign.last_run || undefined
      }));

      setCampaigns(formattedCampaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

    const updateCampaignStatus = async (id: string, status: Campaign['status']) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('campaigns')
        .update({ status })
        .eq('id', id)
        .select()
        .single() as { data: Database['public']['Tables']['campaigns']['Row'], error: any };

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchCampaigns();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update campaign status');
      console.error('Error updating campaign status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete campaign');
      console.error('Error deleting campaign:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    updateCampaignStatus,
    deleteCampaign
  };
};