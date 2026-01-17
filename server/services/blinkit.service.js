import puppeteer from "puppeteer";

export async function searchBlinkit(query, pincode = "462001") {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 40,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 1366, height: 768 });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
  );

  let products = [];
  let captured = false;

  // 👂 Listen for Blinkit search API
  page.on("response", async (response) => {
    try {
      const url = response.url();

      if (
        !captured &&
        url.includes("/v1/layout/search") &&
        response.request().method() === "POST"
      ) {
        const json = await response.json();
        captured = true;

        const snippets = json?.response?.snippets || [];

        for (const block of snippets) {
          if (block.widget_type === "product_card_snippet_type_2") {
            const d = block.data;

            products.push({
              platform: "blinkit",
              id: d.product_id,
              name: d.display_name?.text,
              brand: d.brand_name?.text,
              price: d.normal_price?.text,
              mrp: d.mrp?.text || null,
              unit: d.variant?.text,
              image: d.image?.url,
              available: !d.is_sold_out,
            });
          }
        }
      }
    } catch (e) {
      // ignore
    }
  });

  // 1️⃣ Open Blinkit with search
  const url = `https://blinkit.com/s/?q=${encodeURIComponent(query)}`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // 2️⃣ WAIT for location input
  await page.waitForSelector("input[placeholder*='location']", {
    timeout: 20000,
  });

  // 3️⃣ Type pincode
  await page.type("input[placeholder*='location']", pincode, {
    delay: 120,
  });

  // 4️⃣ Wait for dropdown + select first suggestion
  await new Promise((r) => setTimeout(r, 2000));
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  // 5️⃣ Wait for Blinkit to load products
  await new Promise((r) => setTimeout(r, 6000));

  // 6️⃣ Scroll to ensure API fires
  await page.mouse.wheel({ deltaY: 1200 });
  await new Promise((r) => setTimeout(r, 3000));

  await browser.close();
  return products;
}
