import express from "express";
import cors from "cors";
import { searchBigBasket } from "./services/bigbasket.service";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    msg: "Working",
  });
});

app.get("/api/bigbasket/search", async (req, res) => {
  const { q, pincode } = req.query;

  if (!q) {
    return res.status(400).json({
      error: "Query is required",
    });
  }

  if (!isBigBasketServiceable(pincode)) {
    return res.json({
      platform: "bigbasket",
      pincode,
      available: false,
      results: [],
    });
  }

  const results = await searchBigBasket(q);

  res.json({
    platform: "bigBasket",
    pincode,
    available: true,
    count: results.length,
    results,
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));