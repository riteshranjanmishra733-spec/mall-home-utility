import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  createBooking,
  cancelCustomerBooking,
  getCustomerBookingById,
  listCustomerBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

router.use(authenticate, requireRole("CUSTOMER"));
router.post("/", createBooking);
router.get("/", listCustomerBookings);
router.patch("/:id/cancel", cancelCustomerBooking);
router.get("/:id", getCustomerBookingById);

export default router;
