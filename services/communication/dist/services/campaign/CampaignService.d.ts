import { Database } from '@dentalhub/database';
type Campaign = Database['public']['Tables']['campaigns']['Row'];
import { CreateCampaignDTO, UpdateCampaignDTO, CampaignFilters, CampaignStatus } from './types.js';
export declare class CampaignService {
    private readonly tableName;
    createCampaign(data: CreateCampaignDTO): Promise<Campaign>;
    updateCampaign(id: string, data: UpdateCampaignDTO): Promise<Campaign>;
    getCampaign(id: string): Promise<Campaign | null>;
    listCampaigns(filters?: CampaignFilters): Promise<any[]>;
    deleteCampaign(id: string): Promise<void>;
    updateCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign>;
    updateCampaignMetrics(id: string, metrics: Partial<Campaign['metrics']>): Promise<Campaign>;
    private calculateCampaignStatus;
}
export declare const createCampaignService: () => CampaignService;
export {};
