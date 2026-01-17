const axios = require("axios");

async function searchBigBasket(query) {
  const url = "https://www.bigbasket.com/listing-svc/v2/products";

  const params = {
    type: "ps",
    slug: query,
    page: 1,
    bucket_id: 80,
  };

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    Accept: "application/json",
  };

  try {
    const response = await axios.get(url, { params, headers });

    const products =
      response.data?.tabs?.[0]?.product_info?.products || [];

    return products.map((p) => ({
      name: p.desc || p.name,
      brand: p.brand,
      price: p.price,
      mrp: p.mrp,
      available: p.availability?.available ?? true,
      image: p.images?.[0]?.s || null,
      sku: p.sku,
    }));
  } catch (error) {
    console.error("BigBasket API Error:", error.message);
    return [];
  }
}

module.exports = { searchBigBasket };