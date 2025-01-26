import express from "express";
import { sendNotification } from "./service";
import { NotificationData, NotificationOptions } from "./types";
import { handleError } from "../../utils/errorHandler";
import { Router } from "express";

const router: Router = express.Router();

// Send a notification
router.post("/", async (req, res) => {
  try {
    const data = req.body as NotificationData;
    const options = req.body.options as NotificationOptions;
    const result = await sendNotification(data, options);
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
