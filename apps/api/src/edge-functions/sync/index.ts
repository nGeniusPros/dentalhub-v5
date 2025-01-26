import express from "express";
import { synchronize } from "./service";
import { SyncData, SyncOptions } from "./types";
import { handleError } from "../../utils/errorHandler";
import { Router } from "express";

const router: Router = express.Router();

// Synchronize calendar or contacts
router.post("/", async (req, res) => {
  try {
    const data = req.body as SyncData;
    const options = req.body.options as SyncOptions;
    const result = await synchronize(data, options);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
