import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_ANON_KEY || '');
export class CampaignService {
    constructor() {
        this.tableName = 'campaigns';
    }
    async createCampaign(data) {
        const campaign = {
            id: crypto.randomUUID(),
            ...data,
            status: 'draft',
            metrics: {
                total: 0,
                sent: 0,
                delivered: 0,
                engaged: 0,
                failed: 0
            },
            createdAt: new Date(),
            updatedAt: new Date()
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
    async updateCampaign(id, data) {
        const updates = {
            ...data,
            updatedAt: new Date()
        };
        const { data: result, error } = await supabase
            .from(this.tableName)
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to update campaign: ${error.message}`);
        }
        return result;
    }
    async getCampaign(id) {
        const { data, error } = await supabase
            .from(this.tableName)
            .select()
            .eq('id', id)
            .single();
        if (error) {
            throw new Error(`Failed to get campaign: ${error.message}`);
        }
        return data;
    }
    async listCampaigns(filters) {
        let query = supabase.from(this.tableName).select();
        if (filters) {
            if (filters.type) {
                query = query.eq('type', filters.type);
            }
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.startDate) {
                query = query.gte('createdAt', filters.startDate.toISOString());
            }
            if (filters.endDate) {
                query = query.lte('createdAt', filters.endDate.toISOString());
            }
            if (filters.search) {
                query = query.ilike('name', `%${filters.search}%`);
            }
        }
        const { data, error } = await query;
        if (error) {
            throw new Error(`Failed to list campaigns: ${error.message}`);
        }
        return data;
    }
    async deleteCampaign(id) {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(`Failed to delete campaign: ${error.message}`);
        }
    }
    async updateCampaignStatus(id, status) {
        return this.updateCampaign(id, { status });
    }
    async updateCampaignMetrics(id, metrics) {
        const campaign = await this.getCampaign(id);
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        const updatedMetrics = {
            ...campaign.metrics,
            ...metrics
        };
        return this.updateCampaign(id, {
            metrics: updatedMetrics,
            status: this.calculateCampaignStatus(updatedMetrics)
        });
    }
    calculateCampaignStatus(metrics) {
        const total = metrics.total;
        const completed = metrics.delivered + metrics.failed;
        if (completed === 0)
            return 'draft';
        if (completed < total)
            return 'active';
        return 'completed';
    }
}
export const createCampaignService = () => {
    return new CampaignService();
};
