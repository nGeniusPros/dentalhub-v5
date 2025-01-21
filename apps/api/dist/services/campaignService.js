export class CampaignService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getAllCampaigns(type, status) {
        let query = this.supabase.from('campaigns').select('*');
        if (type) {
            query = query.eq('type', type);
        }
        if (status) {
            query = query.eq('status', status);
        }
        return await query.order('created_at', { ascending: false });
    }
    async getCampaignById(id) {
        return await this.supabase
            .from('campaigns')
            .select(`
        *,
        metrics,
        audience,
        content
      `)
            .eq('id', id)
            .single();
    }
    async createCampaign(data) {
        return await this.supabase
            .from('campaigns')
            .insert({
            ...data,
            status: 'draft',
            metrics: {
                total: 0,
                sent: 0,
                delivered: 0,
                engaged: 0,
                failed: 0
            }
        })
            .select()
            .single();
    }
    async updateCampaign(id, data) {
        return await this.supabase
            .from('campaigns')
            .update(data)
            .eq('id', id)
            .select()
            .single();
    }
    async deleteCampaign(id) {
        return await this.supabase
            .from('campaigns')
            .delete()
            .eq('id', id);
    }
    async getCampaignAnalytics(id, start_date, end_date) {
        let query = this.supabase
            .from('campaign_analytics')
            .select('*')
            .eq('campaign_id', id);
        if (start_date) {
            query = query.gte('timestamp', start_date);
        }
        if (end_date) {
            query = query.lte('timestamp', end_date);
        }
        return await query.order('timestamp', { ascending: true });
    }
    async scheduleCampaign(id, schedule_time) {
        return await this.supabase
            .from('campaigns')
            .update({
            status: 'scheduled',
            schedule: { scheduled_time: schedule_time }
        })
            .eq('id', id)
            .select()
            .single();
    }
    async sendTestCampaign(id, test_recipients) {
        const { data: campaign, error: campaignError } = await this.supabase
            .from('campaigns')
            .select('*')
            .eq('id', id)
            .single();
        if (campaignError) {
            throw campaignError;
        }
        // Send test based on campaign type
        if (campaign.type === 'email') {
            // TODO: Implement email sending logic
        }
        else if (campaign.type === 'sms') {
            // TODO: Implement SMS sending logic
        }
        return { message: 'Test sent successfully' };
    }
    async pauseCampaign(id) {
        return await this.supabase
            .from('campaigns')
            .update({ status: 'paused' })
            .eq('id', id)
            .select()
            .single();
    }
    async resumeCampaign(id) {
        return await this.supabase
            .from('campaigns')
            .update({ status: 'active' })
            .eq('id', id)
            .select()
            .single();
    }
}
