import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
	listProviderBookings,
	updateProviderBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.use(authenticate, requireRole("PROVIDER"));
router.get("/", listProviderBookings);
router.patch("/:id/status", updateProviderBookingStatus);

export default router;
