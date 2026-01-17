const { searchBlinkit } = require("../services/blinkit.service");

async function blinkitSearchController(req, res) {
  const { q, pincode } = req.query;

  if (!q) {
    return res.status(400).json({
      error: "Query parameter `q` is required",
    });
  }

  const results = await searchBlinkit(q, pincode);

  res.json({
    platform: "blinkit",
    pincode: pincode || null,
    count: results.length,
    results,
  });
}

module.exports = { blinkitSearchController };
