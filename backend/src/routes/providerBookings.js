import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { listProviderBookings } from "../controllers/bookingController.js";

const router = express.Router();

router.use(authenticate, requireRole("PROVIDER"));
router.get("/", listProviderBookings);

export default router;
