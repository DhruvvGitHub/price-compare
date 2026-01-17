import express from "express";
import cors from "cors";
import { searchJioMart } from "./services/jiomart.service.js";
import blinkitRoutes from "./routes/blinkit.route.js";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    msg: "Working",
  });
});


app.get("/api/jiomart/search", async (req, res) => {
  const { q, pincode } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query is required" });
  }

  const results = await searchJioMart(q);

  res.json({
    platform: "jiomart",
    pincode: pincode || null,
    count: results.length,
    results
  });
});

app.use("/api/blinkit", blinkitRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));