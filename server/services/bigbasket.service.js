const axios = require("axios");
const { getBigBasketCookies } = require("../utils/bigbasketSession");

let cachedCookieHeader = null;

async function ensureCookies() {
  if (!cachedCookieHeader) {
    const cookies = await getBigBasketCookies();
    cachedCookieHeader = cookies.map(c => `${c.name}=${c.value}`).join("; ");
  }
}

async function searchBigBasket(query) {
  await ensureCookies();

  const url = "https://www.bigbasket.com/listing-svc/v2/products";
  const params = { type: "ps", slug: query, page: 1, bucket_id: 80 };

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    "Accept": "application/json",
    "Referer": "https://www.bigbasket.com/",
    "Origin": "https://www.bigbasket.com",
    "Cookie": cachedCookieHeader,
  };

  try {
    const response = await axios.get(url, { params, headers, timeout: 10000 });
    const products = response.data?.tabs?.[0]?.product_info?.products || [];

    return products.map(p => ({
      name: p.desc || p.name,
      brand: p.brand,
      price: p.price,
      mrp: p.mrp,
      available: p.availability?.available ?? true,
      image: p.images?.[0]?.s || null,
      sku: p.sku,
      platform: "bigbasket",
    }));
  } catch (err) {
    console.error(
      "BigBasket API Error:",
      err.response?.status,
      err.response?.statusText
    );
    return [];
  }
}

module.exports = { searchBigBasket };