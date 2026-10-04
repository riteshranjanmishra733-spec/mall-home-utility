import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  getOwnServices,
  updateProviderServicePrice,
} from "../controllers/providerController.js";

const router = express.Router();

router.use(authenticate, requireRole("PROVIDER"));

router.get("/", getOwnServices);
router.patch("/:serviceId/price", updateProviderServicePrice);

export default router;