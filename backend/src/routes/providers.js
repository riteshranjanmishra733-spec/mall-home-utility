import express from "express";
import { listProvidersForService, getProvider, searchAllProviders } from "../controllers/providerController.js";

const router = express.Router();

// Search all providers with optional city/area/pincode/available filters
router.get("/search", searchAllProviders);

// Get a single provider's public profile
router.get("/:id", getProvider);

// Get all providers offering a specific service (with optional filters)
router.get("/service/:serviceId", listProvidersForService);

export default router;
