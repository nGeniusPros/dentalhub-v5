import { Router, Request, Response } from "express";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";
import { asyncHandler } from "../utils/asyncHandler";
import { Router as ExpressRouter } from "express";
import { z } from "zod";

interface AuthenticatedRequest extends Request {
  supabase: SupabaseClient<Database>;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router: ExpressRouter = Router();

const practiceSettingSchema = z.object({
  setting_key: z.string().min(1),
  setting_value: z.any(),
  setting_type: z.string().min(1),
  description: z.string().optional(),
});

const updatePracticeSettingSchema = z.object({
  setting_value: z.any(),
  description: z.string().optional(),
});

const practiceSettingKeySchema = z.object({
  key: z.string().min(1),
});

const userPermissionSchema = z.object({
  user_id: z.string().min(1),
  permission_key: z.string().min(1),
  permission_type: z.string().min(1),
});

const userPermissionIdSchema = z.object({
  id: z.string().min(1),
});

const updateUserPermissionSchema = z.object({
  permission_type: z.string().min(1),
});

const systemConfigSchema = z.object({
  config_key: z.string().min(1),
  config_value: z.any(),
  config_type: z.string().min(1),
  description: z.string().optional(),
});

const systemConfigKeySchema = z.object({
  key: z.string().min(1),
});

const updateSystemConfigSchema = z.object({
  config_value: z.any(),
  description: z.string().optional(),
});

const integrationSettingSchema = z.object({
  integration_key: z.string().min(1),
  settings_value: z.any(),
  settings_type: z.string().min(1),
  description: z.string().optional(),
});

const integrationSettingKeySchema = z.object({
  key: z.string().min(1),
});

const updateIntegrationSettingSchema = z.object({
  settings_value: z.any(),
  description: z.string().optional(),
});

// Get all practice settings
router.get(
  "/practice",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { data: settings, error } = await req.supabase
      .from("practice_settings")
      .select("*")
      .order("setting_key", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(settings);
  }),
);

// Get practice setting by key
router.get(
  "/practice/:key",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = practiceSettingKeySchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid setting key" });
    }

    const { key } = validationResult.data;

    const { data: setting, error } = await req.supabase
      .from("practice_settings")
      .select("*")
      .eq("setting_key", key)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(setting);
  }),
);

// Create practice setting
router.post(
  "/practice",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = practiceSettingSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid practice setting data" });
    }

    const { setting_key, setting_value, setting_type, description } =
      validationResult.data;

    const { data: setting, error } = await req.supabase
      .from("practice_settings")
      .insert({
        setting_key,
        setting_value,
        setting_type,
        description,
        created_by: req.user?.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(setting);
  }),
);

// Update practice setting
router.put(
  "/practice/:key",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = practiceSettingKeySchema.safeParse(req.params);
    const updateValidationResult = updatePracticeSettingSchema.safeParse(
      req.body,
    );
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid setting key" });
    }
    if (!updateValidationResult.success) {
      return res.status(400).json({ error: "Invalid setting data" });
    }

    const { key } = validationResult.data;
    const { setting_value, description } = updateValidationResult.data;

    const { data: setting, error } = await req.supabase
      .from("practice_settings")
      .update({
        setting_value,
        description,
      })
      .eq("setting_key", key)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(setting);
  }),
);

// Get all user permissions
router.get(
  "/permissions",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { data: permissions, error } = await req.supabase
      .from("user_permissions")
      .select(
        `
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(permissions);
  }),
);

// Get user permissions by user ID
router.get(
  "/permissions/:id",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = userPermissionIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const { id } = validationResult.data;

    const { data: permissions, error } = await req.supabase
      .from("user_permissions")
      .select(
        `
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `,
      )
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(permissions);
  }),
);

// Set user permission
router.post(
  "/permissions",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = userPermissionSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid user permission data" });
    }

    const { user_id, permission_key, permission_type } = validationResult.data;

    const { data: permission, error } = await req.supabase
      .from("user_permissions")
      .insert({
        user_id,
        permission_key,
        permission_type,
        created_by: req.user?.id,
      })
      .select(
        `
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `,
      )
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(permission);
  }),
);

// Update user permission
router.put(
  "/permissions/:id",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = userPermissionIdSchema.safeParse(req.params);
    const updateValidationResult = updateUserPermissionSchema.safeParse(
      req.body,
    );
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid user permission ID" });
    }
    if (!updateValidationResult.success) {
      return res.status(400).json({ error: "Invalid user permission data" });
    }

    const { id } = validationResult.data;
    const { permission_type } = updateValidationResult.data;

    const { data: permission, error } = await req.supabase
      .from("user_permissions")
      .update({
        permission_type,
      })
      .eq("id", id)
      .select(
        `
      *,
      user:auth.users!user_id(
        id,
        email,
        raw_user_meta_data
      )
    `,
      )
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(permission);
  }),
);

// Get all system configurations
router.get(
  "/config",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { data: config, error } = await req.supabase
      .from("system_configuration")
      .select("*")
      .order("config_key", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(config);
  }),
);

// Get system configuration by key
router.get(
  "/config/:key",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = systemConfigKeySchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid config key" });
    }

    const { key } = validationResult.data;

    const { data: config, error } = await req.supabase
      .from("system_configuration")
      .select("*")
      .eq("config_key", key)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(config);
  }),
);

// Create system configuration
router.post(
  "/config",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = systemConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid system configuration data" });
    }

    const { config_key, config_value, config_type, description } =
      validationResult.data;

    const { data: config, error } = await req.supabase
      .from("system_configuration")
      .insert({
        config_key,
        config_value,
        config_type,
        description,
        created_by: req.user?.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(config);
  }),
);

// Update system configuration
router.put(
  "/config/:key",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = systemConfigKeySchema.safeParse(req.params);
    const updateValidationResult = updateSystemConfigSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid config key" });
    }
    if (!updateValidationResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid system configuration data" });
    }

    const { key } = validationResult.data;
    const { config_value, description } = updateValidationResult.data;

    const { data: config, error } = await req.supabase
      .from("system_configuration")
      .update({
        config_value,
        description,
      })
      .eq("config_key", key)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(config);
  }),
);

// Get all integration settings
router.get(
  "/integrations",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { data: settings, error } = await req.supabase
      .from("integration_settings")
      .select("*")
      .order("integration_key", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(settings);
  }),
);

// Get integration setting by key
router.get(
  "/integrations/:key",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = integrationSettingKeySchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid integration key" });
    }

    const { key } = validationResult.data;

    const { data: setting, error } = await req.supabase
      .from("integration_settings")
      .select("*")
      .eq("integration_key", key)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(setting);
  }),
);

// Create integration setting
router.post(
  "/integrations",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = integrationSettingSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid integration setting data" });
    }

    const { integration_key, settings_value, settings_type, description } =
      validationResult.data;

    const { data: setting, error } = await req.supabase
      .from("integration_settings")
      .insert({
        integration_key,
        settings_value,
        settings_type,
        description,
        created_by: req.user?.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(setting);
  }),
);

// Update integration setting
router.put(
  "/integrations/:key",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = integrationSettingKeySchema.safeParse(req.params);
    const updateValidationResult = updateIntegrationSettingSchema.safeParse(
      req.body,
    );
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid integration key" });
    }
    if (!updateValidationResult.success) {
      return res
        .status(400)
        .json({ error: "Invalid integration setting data" });
    }

    const { key } = validationResult.data;
    const { settings_value, description } = updateValidationResult.data;

    const { data: setting, error } = await req.supabase
      .from("integration_settings")
      .update({
        settings_value,
        description,
      })
      .eq("integration_key", key)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(setting);
  }),
);

export default router;
