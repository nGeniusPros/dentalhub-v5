import express from "express";
import { processMedia } from "./service";
import { MediaData, MediaOptions } from "./types";
import { handleError } from "../../utils/errorHandler";
import { Router } from "express";

const router: Router = express.Router();

// Process media
router.post("/", async (req, res) => {
  try {
    const data = req.body as MediaData;
    const options = req.body.options as MediaOptions;
    const result = await processMedia(data, options);
    if (result.success) {
      res.json(result.media);
    } else {
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
