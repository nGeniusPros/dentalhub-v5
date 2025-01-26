import { Router, Request, Response } from "express";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { asyncHandler } from "../utils/asyncHandler";
import { Router as ExpressRouter } from "express";
import { z } from "zod";
import { CampaignService } from "../services/campaignService";

const router: ExpressRouter = Router();

const createCampaignSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  schedule: z.any().optional(),
  audience: z.any().optional(),
  content: z.any().optional(),
  settings: z.any().optional(),
});

const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  status: z.string().optional(),
  schedule: z.any().optional(),
  audience: z.any().optional(),
  content: z.any().optional(),
  settings: z.any().optional(),
  metrics: z.any().optional(),
});

const getCampaignsSchema = z.object({
  type: z.string().optional(),
  status: z.string().optional(),
});

const campaignIdSchema = z.object({
  id: z.string().min(1),
});

const campaignAnalyticsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

const scheduleCampaignSchema = z.object({
  schedule_time: z.string().min(1),
});

const testCampaignSchema = z.object({
  test_recipients: z.array(z.string()),
});

// Get all campaigns
router.get(
  "/",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = getCampaignsSchema.safeParse(req.query);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }

      const { type, status } = validationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { data: campaigns, error } = await campaignService.getAllCampaigns(
        type,
        status,
      );

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(campaigns);
    },
  ),
);

// Get campaign by ID
router.get(
  "/:id",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = campaignIdSchema.safeParse(req.params);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const { id } = validationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { data: campaign, error } =
        await campaignService.getCampaignById(id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(campaign);
    },
  ),
);

// Create campaign
router.post(
  "/",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = createCampaignSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign data" });
      }

      const { name, type, schedule, audience, content, settings } =
        validationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { data: campaign, error } = await campaignService.createCampaign({
        name,
        type,
        schedule,
        audience,
        content,
        settings,
      });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(campaign);
    },
  ),
);

// Update campaign
router.put(
  "/:id",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = updateCampaignSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign data" });
      }

      const { id } = req.params;
      const {
        name,
        type,
        status,
        schedule,
        audience,
        content,
        settings,
        metrics,
      } = validationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { data: campaign, error } = await campaignService.updateCampaign(
        id,
        {
          name,
          type,
          status,
          schedule,
          audience,
          content,
          settings,
          metrics,
        },
      );

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(campaign);
    },
  ),
);

// Delete campaign
router.delete(
  "/:id",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = campaignIdSchema.safeParse(req.params);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const { id } = validationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { error } = await campaignService.deleteCampaign(id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(204).send();
    },
  ),
);

// Get campaign analytics
router.get(
  "/:id/analytics",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = campaignIdSchema.safeParse(req.params);
      const analyticsValidationResult = campaignAnalyticsSchema.safeParse(
        req.query,
      );
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }
      if (!analyticsValidationResult.success) {
        return res.status(400).json({ error: "Invalid analytics parameters" });
      }

      const { id } = validationResult.data;
      const { start_date, end_date } = analyticsValidationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { data: analytics, error } =
        await campaignService.getCampaignAnalytics(id, start_date, end_date);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(analytics);
    },
  ),
);

// Schedule campaign
router.post(
  "/:id/schedule",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = campaignIdSchema.safeParse(req.params);
      const scheduleValidationResult = scheduleCampaignSchema.safeParse(
        req.body,
      );
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }
      if (!scheduleValidationResult.success) {
        return res.status(400).json({ error: "Invalid schedule data" });
      }

      const { id } = validationResult.data;
      const { schedule_time } = scheduleValidationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { data: campaign, error } = await campaignService.scheduleCampaign(
        id,
        schedule_time,
      );

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(campaign);
    },
  ),
);

// Send test campaign
router.post(
  "/:id/test",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = campaignIdSchema.safeParse(req.params);
      const testValidationResult = testCampaignSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }
      if (!testValidationResult.success) {
        return res.status(400).json({ error: "Invalid test data" });
      }

      const { id } = validationResult.data;
      const { test_recipients } = testValidationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const result = await campaignService.sendTestCampaign(
        id,
        test_recipients,
      );

      return res.json(result);
    },
  ),
);

// Pause campaign
router.post(
  "/:id/pause",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = campaignIdSchema.safeParse(req.params);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const { id } = validationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { data: campaign, error } = await campaignService.pauseCampaign(id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(campaign);
    },
  ),
);

// Resume campaign
router.post(
  "/:id/resume",
  asyncHandler(
    async (
      req: Request & { supabase: SupabaseClient<Database> },
      res: Response,
    ) => {
      const validationResult = campaignIdSchema.safeParse(req.params);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid campaign ID" });
      }

      const { id } = validationResult.data;
      const campaignService = new CampaignService(req.supabase);
      const { data: campaign, error } =
        await campaignService.resumeCampaign(id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(campaign);
    },
  ),
);

export default router;
