import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

// Synonym map for multilingual English / Urdu / Roman Urdu menswear semantic search
const BILINGUAL_SYNONYMS: Record<string, string[]> = {
  کرتہ: ["kurta", "shalwar", "karandi", "zari", "festive", "traditional"],
  شلوار: ["shalwar", "kurta", "trouser", "kameez"],
  شرٹ: ["shirt", "oxford", "cotton", "collar", "formal"],
  پینٹ: ["pant", "trouser", "gurkha", "chino", "pleated"],
  ٹراؤزر: ["trouser", "pant", "gurkha", "chino"],
  جیکٹ: ["jacket", "suede", "bomber", "leather", "winter", "outerwear"],
  ہوڈی: ["hoodie", "hoodies", "monolith", "cotton", "winter"],
  سیاہ: ["black", "obsidian", "dark"],
  کالا: ["black", "obsidian", "dark"],
  kala: ["black", "obsidian", "dark", "kurta"],
  safed: ["white", "ivory", "cream", "shirt", "kurta"],
  hara: ["emerald", "green", "olive", "kurta"],
  سفید: ["white", "ivory", "cream"],
  سبز: ["emerald", "green", "olive"],
  نیلا: ["navy", "blue", "cobalt"],
  شادی: ["wedding", "festive", "zari", "embroidered", "kurta"],
  shadi: ["wedding", "festive", "zari", "embroidered", "kurta"],
  دفتر: ["office", "formal", "shirt", "trouser", "gurkha"],
  daftar: ["office", "formal", "shirt", "trouser", "gurkha"],
  سردی: ["winter", "jacket", "karandi", "suede", "hoodie"],
  sardi: ["winter", "jacket", "karandi", "suede", "hoodie"],
  kurta: ["kurta", "shalwar", "karandi", "zari", "embroidered"],
  kameez: ["kurta", "shalwar", "shirt"],
  formal: ["shirt", "oxford", "gurkha", "trouser"],
  wedding: ["kurta", "zari", "emerald", "obsidian"],
  winter: ["jacket", "suede", "karandi", "hoodie"],
};

function expandSearchQuery(query: string): string[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];
  const words = clean.split(/\s+/);
  const expanded = new Set<string>(words);

  for (const [key, values] of Object.entries(BILINGUAL_SYNONYMS)) {
    if (clean.includes(key)) {
      values.forEach((v) => expanded.add(v));
    }
  }

  for (const w of words) {
    if (BILINGUAL_SYNONYMS[w]) {
      BILINGUAL_SYNONYMS[w].forEach((v) => expanded.add(v));
    }
  }

  return Array.from(expanded).slice(0, 6);
}

function buildStylistReply(message: string, _language?: string): string {
  const q = message.toLowerCase();

  if (
    q.includes("politics") ||
    q.includes("religion") ||
    q.includes("cricket") ||
    q.includes("weather") ||
    q.includes("movie")
  ) {
    return "Yaar yeh meri expertise se bahar hai 😅 ARTS APPAREL fashion ke baare mein poochho, ya WhatsApp karo: 03058165623 💬✨";
  }

  if (q.includes("track") || q.includes("order status") || q.includes("kahan") || q.includes("order")) {
    return "Bhai, 'Track Order' page pe jao aur apna order number daalo — sab kuch dikh jayega! 📦🔍 Koi masla ho to WhatsApp karo: 03058165623 😊";
  }

  if (
    q.includes("delivery") ||
    q.includes("shipping") ||
    q.includes("charge") ||
    q.includes("din") ||
    q.includes("kab")
  ) {
    return "Dost, 3 se 5 working days mein ghar pohonch jayega inshallah! 🚚✨ Baqi areas mein 5 se 7 days lagte hain 📦";
  }

  if (
    q.includes("return") ||
    q.includes("exchange") ||
    q.includes("wapsi") ||
    q.includes("wapas") ||
    q.includes("refund")
  ) {
    return "Koi masla nahi Bhai! 7 din ke andar unworn kapra wapas kar sakte ho, aur size change bilkul free hai. WhatsApp karo: 03058165623 😊👍";
  }

  if (q.includes("discount") || q.includes("sale") || q.includes("offer") || q.includes("promo")) {
    return "Yaar abhi site pe zabardast discounts chal rahe hain! Homepage dekho ya apna referral code use karo 🔥🎉";
  }

  if (q.includes("size") || q.includes("chart") || q.includes("fit")) {
    return "Bhai har product page pe size chart mojood hai — S, M, L, XL, XXL sab milte hain. Confusion ho to poochho! 👕📏";
  }

  if (q.includes("agent") || q.includes("referral") || q.includes("commission") || q.includes("partner")) {
    return "Dost agar agent banna chahte ho aur commission kamana chahte ho to WhatsApp karo: 03058165623 💰🤝";
  }

  if (q.includes("payment") || q.includes("cod") || q.includes("jazzcash") || q.includes("easypaisa") || q.includes("bank")) {
    return "Bhai Cash on Delivery (COD), JazzCash, EasyPaisa aur Bank Transfer — charon options mojood hain! 💳✨ Jo aapko easy lage wo select karo 😄";
  }

  if (
    q.includes("address") ||
    q.includes("location") ||
    q.includes("where") ||
    q.includes("whatsapp") ||
    q.includes("contact") ||
    q.includes("phone") ||
    q.includes("sadiqabad") ||
    q.includes("dukkan")
  ) {
    return "Bhai hamara store Club Road Near New Cafe Sajawal Sadiqabad, Sadiqabad, Pakistan mein hai! 📍✨ Seedha WhatsApp karo: 03058165623 😄📞";
  }

  if (
    q.includes("kurta") ||
    q.includes("shalwar") ||
    q.includes("shirt") ||
    q.includes("trouser") ||
    q.includes("jacket") ||
    q.includes("waistcoat") ||
    q.includes("hoodie") ||
    q.includes("jeans") ||
    q.includes("wedding") ||
    q.includes("shadi")
  ) {
    return "Dost ARTS APPAREL pe Shirts, Trousers, Kurta Shalwar, Waistcoats, Hoodies aur Jackets sab premium quality mein milte hain! 👔🔥 Category page kholo aur apna style chuno 😄";
  }

  if (
    q.includes("salam") ||
    q.includes("assalam") ||
    q.includes("aoa") ||
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("hey")
  ) {
    return "Walaikum Assalam Bhai! 👋 Main ARTS APPAREL ka assistant hun. Orders, delivery, ya sizes ke baare mein kuch bhi poochho! 😄✨";
  }

  return "Yaar is baare mein pakka nahi pata 😅 Seedha WhatsApp karo: 03058165623 — wahan poori madad milegi! 💬✨";
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  // Endpoint 1: POST /api/ai/search
  app.post("/api/ai/search", (req, res) => {
    const { query = "", language = "en" } = req.body || {};
    const keywords = expandSearchQuery(String(query));
    res.json({
      success: true,
      query,
      language,
      keywords: keywords.length > 0 ? keywords : [String(query).trim()],
      original: query,
    });
  });

  // Endpoint 2: POST /api/ai/recommendations
  app.post("/api/ai/recommendations", (req, res) => {
    const { product_id = "", category = "", language = "en" } = req.body || {};
    const catLower = String(category).toLowerCase();

    let recommendations: Array<{ attribute: string; reason: string }>;
    if (language === "ur") {
      recommendations = [
        { attribute: "ایمپیریل زمرد بوسکی سلک کرتہ سیٹ", reason: "شاہی تقریبات کے لیے بہترین انتخاب" },
        { attribute: "مے فیئر لیمب اسکن سويڈ بمبر جیکٹ", reason: "سردیوں کی شام کے لیے پریمیم لیدر" },
        { attribute: "اطالوی وول ڈبل پلیٹ گورکھا ٹراؤزر", reason: "شاندار ٹیلرڈ فٹنگ" },
      ];
    } else if (catLower.includes("kurta")) {
      recommendations = [
        { attribute: "Mayfair Lambskin Suede Bomber Jacket", reason: "Layers Effortlessly Over Festive Kurtas" },
        { attribute: "Imperial Emerald Boski Silk Kurta Set", reason: "Complementary Hand-Loomed Evening Silhouette" },
        { attribute: "Sovereign Ivory Tilla Kurta Shalwar", reason: "Crisp Giza Cotton Daytime Essential" },
      ];
    } else if (catLower.includes("shirt")) {
      recommendations = [
        { attribute: "Sartorial Double-Pleat Gurkha Trousers", reason: "Sharp Executive Sartorial Pairing" },
        { attribute: "Mayfair Lambskin Suede Bomber Jacket", reason: "Refined Outerwear Over Dress Shirts" },
        { attribute: "Obsidian Pima Stretch Tailored Chinos", reason: "Smart-Casual Tailored Comfort" },
      ];
    } else {
      recommendations = [
        { attribute: "Obsidian Zari Karandi Kurta Shalwar", reason: "ARTS APPAREL Signature Bestseller" },
        { attribute: "Noir Giza 120s Executive Dress Shirt", reason: "Two-Ply Egyptian Cotton Craftsmanship" },
        { attribute: "Sartorial Double-Pleat Gurkha Trousers", reason: "Tailored Italian Wool-Blend Silhouette" },
      ];
    }

    res.json({
      success: true,
      product_id,
      category,
      recommendations,
    });
  });

  // Endpoint 3: POST /api/ai/chat
  app.post("/api/ai/chat", (req, res) => {
    const { message = "", language = "en" } = req.body || {};
    const reply = buildStylistReply(String(message), String(language));
    res.json({ success: true, reply });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ARTS APPAREL server running on http://localhost:${PORT}`);
  });
}

startServer();
