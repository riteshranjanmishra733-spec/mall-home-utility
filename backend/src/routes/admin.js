import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  getOverview,
  listBookings,
  listCategories,
  listProviders,
  listServices,
  listUsers,
  setBookingStatus,
  setProviderAvailability,
  setProviderServiceAvailability,
  setProviderVerificationStatus,
  setServiceStatus,
  setProviderServicePrice
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authenticate, requireRole("ADMIN"));
router.get("/overview", getOverview);
router.get("/users", listUsers);
router.get("/providers", listProviders);
router.get("/services", listServices);
router.get("/categories", listCategories);
router.get("/bookings", listBookings);
router.patch("/providers/:id/verification", setProviderVerificationStatus);
router.patch("/providers/:id/availability", setProviderAvailability);
router.patch("/providers/:providerId/services/:serviceId/status", setProviderServiceAvailability);
router.patch("/services/:id/status", setServiceStatus);
router.patch("/bookings/:id/status", setBookingStatus);
router.patch("/providers/:providerId/services/:serviceId/price", setProviderServicePrice);
export default router;