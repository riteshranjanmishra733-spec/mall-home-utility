import express from "express";
import { registerHandler, loginHandler, meHandler } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/me", authenticate, meHandler);

export default router;
