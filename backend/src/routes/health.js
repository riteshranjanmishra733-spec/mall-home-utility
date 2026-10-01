import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Mall & Home Utility Services backend is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;
