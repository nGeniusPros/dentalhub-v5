import { Router } from 'express';
import { CampaignController } from '../controllers/campaignController.js';

const router: Router = Router();
const controller = new CampaignController();

router.get('/', controller.getAllCampaigns);
router.post('/', controller.createCampaign);

export { router as campaignsRouter };