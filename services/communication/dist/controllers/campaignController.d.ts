import { Request, Response } from 'express';
export declare class CampaignController {
    getAllCampaigns(req: Request, res: Response): Promise<void>;
    createCampaign(req: Request, res: Response): Promise<void>;
}
