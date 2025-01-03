import { Router } from 'express';
import { createCampaignService } from '../services/campaign/CampaignService';
import { CreateCampaignDTO, UpdateCampaignDTO, CampaignFilters } from '../services/campaign/types';

const router = Router();
const campaignService = createCampaignService();

// List campaigns with optional filters
router.get('/', async (req, res) => {
  try {
    const filters: CampaignFilters = {
      type: req.query.type as any,
      status: req.query.status as any,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      search: req.query.search as string
    };

    const campaigns = await campaignService.listCampaigns(filters);
    res.json(campaigns);
  } catch (error) {
    console.error('Error listing campaigns:', error);
    res.status(500).json({ error: 'Failed to list campaigns' });
  }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await campaignService.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error getting campaign:', error);
    res.status(500).json({ error: 'Failed to get campaign' });
  }
});

// Create new campaign
router.post('/', async (req, res) => {
  try {
    const campaignData: CreateCampaignDTO = req.body;
    const campaign = await campaignService.createCampaign(campaignData);
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign
router.put('/:id', async (req, res) => {
  try {
    const updateData: UpdateCampaignDTO = req.body;
    const campaign = await campaignService.updateCampaign(req.params.id, updateData);
    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
  try {
    await campaignService.deleteCampaign(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

// Update campaign status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await campaignService.updateCampaignStatus(req.params.id, status);
    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign status:', error);
    res.status(500).json({ error: 'Failed to update campaign status' });
  }
});

// Update campaign metrics
router.put('/:id/metrics', async (req, res) => {
  try {
    const { metrics } = req.body;
    const campaign = await campaignService.updateCampaignMetrics(req.params.id, metrics);
    res.json(campaign);
  } catch (error) {
    console.error('Error updating campaign metrics:', error);
    res.status(500).json({ error: 'Failed to update campaign metrics' });
  }
});

export default router;