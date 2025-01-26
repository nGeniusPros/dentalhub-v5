import { createClient } from "@supabase/supabase-js";
import { Database } from "@dentalhub/database";
import dotenv from "dotenv";

dotenv.config();

// Define the Campaign type based on the database schema
type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

const supabase = createClient<Database>(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || "",
);
import {
  CreateCampaignDTO,
  UpdateCampaignDTO,
  CampaignFilters,
  CampaignType,
  CampaignStatus,
} from "./types.js";

export class CampaignService {
  private readonly tableName = "campaigns";

  async createCampaign(data: CreateCampaignDTO): Promise<Campaign> {
    const campaign: Campaign = {
      id: crypto.randomUUID(),
      ...data,
      status: "draft",
      metrics: {
        total: 0,
        sent: 0,
        delivered: 0,
        engaged: 0,
        failed: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(campaign)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }

    return result;
  }

  async updateCampaign(id: string, data: UpdateCampaignDTO): Promise<Campaign> {
    const updates = {
      ...data,
      updatedAt: new Date(),
    };

    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update campaign: ${error.message}`);
    }

    return result;
  }

  async getCampaign(id: string): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to get campaign: ${error.message}`);
    }

    return data;
  }

  async listCampaigns(filters?: CampaignFilters) {
    let query = supabase.from(this.tableName).select();

    if (filters) {
      if (filters.type) {
        query = query.eq("type", filters.type);
      }
      if (filters.status) {
        query = query.eq("status", filters.status);
      }
      if (filters.startDate) {
        query = query.gte("createdAt", filters.startDate.toISOString());
      }
      if (filters.endDate) {
        query = query.lte("createdAt", filters.endDate.toISOString());
      }
      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list campaigns: ${error.message}`);
    }

    return data;
  }

  async deleteCampaign(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }
  }

  async updateCampaignStatus(
    id: string,
    status: CampaignStatus,
  ): Promise<Campaign> {
    return this.updateCampaign(id, { status });
  }

  async updateCampaignMetrics(
    id: string,
    metrics: Partial<Campaign["metrics"]>,
  ): Promise<Campaign> {
    const campaign = await this.getCampaign(id);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const updatedMetrics = {
      ...campaign.metrics,
      ...metrics,
    };

    return this.updateCampaign(id, {
      metrics: updatedMetrics,
      status: this.calculateCampaignStatus(updatedMetrics),
    });
  }

  private calculateCampaignStatus(
    metrics: Campaign["metrics"],
  ): CampaignStatus {
    const total = metrics.total;
    const completed = metrics.delivered + metrics.failed;

    if (completed === 0) return "draft";
    if (completed < total) return "active";
    return "completed";
  }
}

export const createCampaignService = () => {
  return new CampaignService();
};
