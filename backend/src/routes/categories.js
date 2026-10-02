import express from "express";
import { listCategories, getCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", listCategories);
router.get("/:id", getCategory);

export default router;
