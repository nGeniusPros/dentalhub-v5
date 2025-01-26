import { Router, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { z } from "zod";

const router = Router();

const getResourcesSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
});

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const validationResult = getResourcesSchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ error: "Invalid query parameters" });
    }

    const { type, category } = validationResult.data;

    // Placeholder for actual resource logic
    res.json({ message: "Resource routes", type, category });
  }),
);

export default router;
