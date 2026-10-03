import express from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  getOverview,
  listBookings,
  listCategories,
  listProviders,
  listServices,
  listUsers,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authenticate, requireRole("ADMIN"));
router.get("/overview", getOverview);
router.get("/users", listUsers);
router.get("/providers", listProviders);
router.get("/services", listServices);
router.get("/categories", listCategories);
router.get("/bookings", listBookings);

export default router;