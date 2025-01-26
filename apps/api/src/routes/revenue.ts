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

const getRevenueEntriesSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  category: z.string().optional(),
});

const createRevenueEntrySchema = z.object({
  entry_date: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().min(0),
  source: z.string().min(1),
  reference_id: z.string().optional(),
  reference_type: z.string().optional(),
  notes: z.string().optional(),
});

const revenueAnalyticsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  group_by: z.enum(["month", "year"]).optional(),
});

const getARSchema = z.object({
  status: z.string().optional(),
});

const createPaymentPlanSchema = z.object({
  patient_id: z.string().min(1),
  total_amount: z.number().min(0),
  installment_amount: z.number().min(0),
  frequency: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  notes: z.string().optional(),
});

const paymentPlanIdSchema = z.object({
  id: z.string().min(1),
});

const updatePaymentPlanSchema = z.object({
  remaining_amount: z.number().min(0).optional(),
  next_payment_date: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

// Get revenue entries
router.get(
  "/",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = getRevenueEntriesSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const { start_date, end_date, category } = validationResult.data;

    let query = req.supabase.from("revenue_entries").select("*");

    if (start_date) {
      query = query.gte("entry_date", start_date);
    }
    if (end_date) {
      query = query.lte("entry_date", end_date);
    }
    if (category) {
      query = query.eq("category", category);
    }

    const { data: entries, error } = await query.order("entry_date", {
      ascending: false,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(entries);
  }),
);

// Add revenue entry
router.post(
  "/",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = createRevenueEntrySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid revenue entry data" });
    }

    const {
      entry_date,
      category,
      amount,
      source,
      reference_id,
      reference_type,
      notes,
    } = validationResult.data;

    const { data: entry, error } = await req.supabase
      .from("revenue_entries")
      .insert({
        entry_date,
        category,
        amount,
        source,
        reference_id,
        reference_type,
        notes,
        created_by: req.user?.id,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(entry);
  }),
);

// Get revenue analytics
router.get(
  "/analytics",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = revenueAnalyticsSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid analytics parameters" });
    }

    const { start_date, end_date, group_by = "month" } = validationResult.data;

    // Get revenue entries
    const { data: entries, error } = await req.supabase
      .from("revenue_entries")
      .select("entry_date, category, amount")
      .gte("entry_date", start_date)
      .lte("entry_date", end_date);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Calculate analytics
    const analytics = {
      total_revenue: 0,
      by_category: {} as Record<string, number>,
      by_period: {} as Record<string, number>,
    };

    entries?.forEach((entry) => {
      // Total revenue
      analytics.total_revenue += entry.amount;

      // Revenue by category
      if (!analytics.by_category[entry.category]) {
        analytics.by_category[entry.category] = 0;
      }
      analytics.by_category[entry.category] += entry.amount;

      // Revenue by period
      const period =
        group_by === "month"
          ? entry.entry_date.substring(0, 7) // YYYY-MM
          : entry.entry_date.substring(0, 4); // YYYY

      if (!analytics.by_period[period]) {
        analytics.by_period[period] = 0;
      }
      analytics.by_period[period] += entry.amount;
    });

    return res.json(analytics);
  }),
);

// Get accounts receivable
router.get(
  "/ar",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = getARSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const { status } = validationResult.data;

    let query = req.supabase.from("accounts_receivable").select(`
      *,
      patient:auth.users!patient_id(
        id,
        email,
        raw_user_meta_data
      )
    `);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: ar, error } = await query.order("due_date", {
      ascending: true,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(ar);
  }),
);

// Get AR aging report
router.get(
  "/ar/aging",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { data: ar, error } = await req.supabase
      .from("accounts_receivable")
      .select("remaining_amount, aging_days")
      .gt("remaining_amount", 0);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Calculate aging buckets
    const aging = {
      current: 0,
      "30_days": 0,
      "60_days": 0,
      "90_days": 0,
      "120_plus_days": 0,
    };

    ar?.forEach((item) => {
      const amount = item.remaining_amount;
      if (item.aging_days <= 30) {
        aging.current += amount;
      } else if (item.aging_days <= 60) {
        aging["30_days"] += amount;
      } else if (item.aging_days <= 90) {
        aging["60_days"] += amount;
      } else if (item.aging_days <= 120) {
        aging["90_days"] += amount;
      } else {
        aging["120_plus_days"] += amount;
      }
    });

    return res.json(aging);
  }),
);

// Create payment plan
router.post(
  "/payment-plans",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = createPaymentPlanSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid payment plan data" });
    }

    const {
      patient_id,
      total_amount,
      installment_amount,
      frequency,
      start_date,
      end_date,
      notes,
    } = validationResult.data;

    const { data: plan, error } = await req.supabase
      .from("payment_plans")
      .insert({
        patient_id,
        total_amount,
        remaining_amount: total_amount,
        installment_amount,
        frequency,
        start_date,
        end_date,
        next_payment_date: start_date,
        status: "active",
        notes,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(plan);
  }),
);

// Update payment plan
router.put(
  "/payment-plans/:id",
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validationResult = paymentPlanIdSchema.safeParse(req.params);
    const updateValidationResult = updatePaymentPlanSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid payment plan ID" });
    }
    if (!updateValidationResult.success) {
      return res.status(400).json({ error: "Invalid payment plan data" });
    }

    const { id } = validationResult.data;
    const { remaining_amount, next_payment_date, status, notes } =
      updateValidationResult.data;

    const { data: plan, error } = await req.supabase
      .from("payment_plans")
      .update({
        remaining_amount,
        next_payment_date,
        status,
        notes,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(plan);
  }),
);

export default router;
