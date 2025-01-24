import { supabaseService } from './supabase';

interface SocialMediaData {
  stats: {
    followers: number;
    engagement: number;
    reach: number;
    impressions: number;
  };
  posts: Array<{
    id: string;
    platform: string;
    content: string;
    engagement: number;
    reach: number;
    publishedAt: string;
  }>;
  audience: {
    demographics: {
      age: Record<string, number>;
      gender: Record<string, number>;
      location: Record<string, number>;
    };
    interests: Record<string, number>;
  };
  hashtags: Array<{
    tag: string;
    usage: number;
    engagement: number;
  }>;
  competitors: Array<{
    name: string;
    followers: number;
    engagement: number;
    topPosts: Array<{
      content: string;
      engagement: number;
    }>;
  }>;
  campaigns: Array<{
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
    budget: number;
    results: {
      reach: number;
      engagement: number;
      conversions: number;
    };
  }>;
}

class SocialMediaService {
  async getData(): Promise<SocialMediaData> {
    try {
      const { data, error } = await supabaseService
        .from('social_media_analytics')
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to fetch social media data: ${error.message}`);
      }

      return data as SocialMediaData;
    } catch (error) {
      console.error('Error fetching social media data:', error);
      throw error;
    }
  }

  async updateData(newData: Partial<SocialMediaData>): Promise<void> {
    try {
      const { error } = await supabaseService
        .from('social_media_analytics')
        .update(newData)
        .eq('id', 1); // Assuming we're using a single row for the current data

      if (error) {
        throw new Error(`Failed to update social media data: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating social media data:', error);
      throw error;
    }
  }
}

export const socialMediaService = new SocialMediaService();
