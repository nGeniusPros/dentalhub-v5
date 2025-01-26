import { Router } from "express";
import availabilityRoutes from "./availability";
import resourceRoutes from "./resources";

const router: Router = Router();

router.use("/availability", availabilityRoutes);
router.use("/resources", resourceRoutes);

export default router;
