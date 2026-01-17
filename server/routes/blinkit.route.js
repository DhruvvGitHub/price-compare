import express from "express";
import { searchBlinkit } from "../services/blinkit.service.js";

const router = express.Router();

router.get("/search", async (req, res) => {
  const { q, pincode } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const results = await searchBlinkit(q);

    res.json({
      platform: "blinkit",
      pincode: pincode || null,
      count: results.length,
      results,
    });
  } catch (err) {
    console.error("Blinkit Route Error:", err.message);
    res.status(500).json({ error: "Blinkit search failed" });
  }
});

export default router;