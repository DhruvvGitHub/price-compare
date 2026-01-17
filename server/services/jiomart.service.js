const axios = require("axios");
const crypto = require("crypto");

async function searchJioMart(query) {
  const url = "https://www.jiomart.com/trex/search";

  const payload = {
    query: query,
    pageSize: 20,

    // REQUIRED fields
    queryExpansionSpec: {
      condition: "AUTO",
    },
    spellCorrectionSpec: {
      mode: "AUTO",
    },
    userInfo: {
      userId: null,
    },

    // REQUIRED visitorId
    visitorId: `anonymous-${crypto.randomUUID()}`,
  };

  const headers = {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    "Accept": "application/json",
    "Origin": "https://www.jiomart.com",
    "Referer": "https://www.jiomart.com/",
  };

  try {
    const response = await axios.post(url, payload, { headers });

    const results = response.data?.results || [];

    return results.map((item) => {
      const product = item.product || {};
      const variant = product.variants?.[0] || {};

      return {
        name: product.title,
        brand: product.brands?.[0] || null,
        available: Boolean(
          variant.attributes?.inv_stores_lp?.text?.length
        ),
        platform: "jiomart",
      };
    });
  } catch (error) {
    console.error(
      "JioMart API Error:",
      error.response?.status,
      error.response?.data
    );
    return [];
  }
}

module.exports = { searchJioMart };