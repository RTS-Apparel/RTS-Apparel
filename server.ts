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
  شال: ["shawl", "pashmina", "wool", "accessory"],
  سیاہ: ["black", "obsidian", "dark"],
  کالا: ["black", "obsidian", "dark"],
  kala: ["black", "obsidian", "dark", "kurta"],
  safed: ["white", "ivory", "cream", "shirt", "kurta"],
  hara: ["emerald", "green", "olive", "kurta"],
  سفید: ["white", "ivory", "cream"],
  سبز: ["emerald", "green", "olive"],
  نیلا: ["navy", "blue", "cobalt"],
  شادی: ["wedding", "festive", "zari", "embroidered", "kurta", "shawl"],
  shadi: ["wedding", "festive", "zari", "embroidered", "kurta", "shawl"],
  دفتر: ["office", "formal", "shirt", "trouser", "gurkha"],
  daftar: ["office", "formal", "shirt", "trouser", "gurkha"],
  سردی: ["winter", "jacket", "shawl", "karandi", "suede"],
  sardi: ["winter", "jacket", "shawl", "karandi", "suede"],
  kurta: ["kurta", "shalwar", "karandi", "zari", "embroidered"],
  kameez: ["kurta", "shalwar", "shirt"],
  formal: ["shirt", "oxford", "gurkha", "trouser"],
  wedding: ["kurta", "zari", "emerald", "obsidian", "shawl"],
  winter: ["jacket", "suede", "shawl", "karandi"],
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

function buildStylistReply(message: string, language?: string): string {
  const lower = message.toLowerCase();
  const hasUrdu = /[\u0600-\u06FF]/.test(message) || language === "ur";
  const isRoman =
    language === "roman_ur" ||
    /\b(dikhao|batao|qeemat|kitna|kahan|kaise|chahiye|hai|hain)\b/i.test(
      message
    );

  if (hasUrdu) {
    if (lower.includes("ڈیلیوری") || lower.includes("چارجز") || lower.includes("delivery")) {
      return "آر ٹی ایس اپیرل پورے پاکستان میں ڈیلیوری فراہم کرتا ہے۔ لاہور کے لیے ڈیلیوری چارجز 200 روپے، کراچی اور اسلام آباد کے لیے 250 روپے، اور دیگر شہروں کے لیے 300 روپے ہیں۔ کیش آن ڈیلیوری، جاز کیش اور ایزی پیسہ دستیاب ہیں۔";
    }
    if (lower.includes("کرتہ") || lower.includes("شادی")) {
      return "ہماری شاہی کرنڈی اور زری کڑھائی والی کُرتہ شلوار کلیکشن شادی اور تقریبات کے لیے بہترین ہے۔ رائل اوبسیڈین زری کرتہ (Rs. 11,500) اور سلطان ایمرالڈ کرتہ (Rs. 12,800) ہمارے سب سے مقبول ڈیزائن ہیں۔";
    }
    if (lower.includes("ایجنٹ") || lower.includes("کمیشن") || lower.includes("کوڈ")) {
      return "آپ ہمارے 'ایجنٹ بنیں' پیج سے رجسٹریشن کر کے اپنا منفرد ریفرل کوڈ حاصل کر سکتے ہیں اور ہر آرڈر پر کمیشن کما سکتے ہیں۔ مثال کے طور پر کوڈ RTS-ALI123 استعمال کریں۔";
    }
    return "آر ٹی ایس اپیرل میں خوش آمدید! ہمارے پاس پریمیئم کُرتہ شلوار، فارمل شرٹس، گُرکھا پینٹس اور سوئیڈ جیکٹس موجود ہیں۔ آپ کس قسم کا لباس تلاش کر رہے ہیں؟";
  }

  if (isRoman) {
    if (lower.includes("delivery") || lower.includes("charge") || lower.includes("shipping")) {
      return "RTS Apparel poore Pakistan mein 3–5 din mein delivery deta hai: Lahore Rs. 200, Karachi / Islamabad / Rawalpindi Rs. 250, Faisalabad / Multan Rs. 280, aur baqi shehron mein Rs. 300–350. COD, JazzCash, EasyPaisa aur Bank Transfer dastiyab hain.";
    }
    if (lower.includes("agent") || lower.includes("referral") || lower.includes("commission")) {
      return "Aap RTS Partner Agent ban kar apne personal referral code (maslan RTS-ALI123) ke zariye har order par commission kama sakte hain aur JazzCash, EasyPaisa ya Bank se payout le sakte hain.";
    }
    if (lower.includes("kurta") || lower.includes("wedding") || lower.includes("shadi")) {
      return "Shadi aur khaas taqreebat ke liye hamara 'Royal Obsidian Zari Karandi Kurta' (Rs. 11,500) aur 'Sultanate Emerald Hand-Loomed Kurta' (Rs. 12,800) behtareen intikhab hain.";
    }
    return "RTS Apparel mein khush aamdeed! Hamare paas Karandi Kurta Shalwar, Egyptian Cotton Shirts, Gurkha Trousers aur Lambskin Suede Jackets dastiyab hain. Main aap ki kya madad kar sakta hoon?";
  }

  if (lower.includes("delivery") || lower.includes("shipping") || lower.includes("charge")) {
    return "RTS Apparel delivers across Pakistan within 3–5 business days: Lahore Rs. 200, Karachi / Islamabad / Rawalpindi Rs. 250, Faisalabad / Multan Rs. 280, Peshawar / Quetta Rs. 320–350, and Other Cities Rs. 300. We accept Cash on Delivery (COD), JazzCash, EasyPaisa, and Bank Transfer.";
  }

  if (lower.includes("agent") || lower.includes("referral") || lower.includes("commission")) {
    return "You can join the RTS Partner Agent Program via Sign Up ('Become an Agent'). Once approved by Admin, you receive a personal referral code (such as RTS-ALI123). Whenever a customer enters your code at checkout, your commission is tracked in your Agent Portal and can be withdrawn via JazzCash, EasyPaisa, or Bank Transfer.";
  }

  if (lower.includes("kurta") || lower.includes("wedding") || lower.includes("festive")) {
    return "For weddings and evening receptions, we recommend our flagship 'Royal Obsidian Zari Karandi Kurta' (Rs. 11,500) or the 'Sultanate Emerald Hand-Loomed Kurta' (Rs. 12,800), paired with our 'Kashmir Pashmina Zari Shawl'.";
  }

  if (lower.includes("size") || lower.includes("fit")) {
    return "Our garments are tailored in XS, S, M, L, XL, and XXL. OurKurtas feature a structured Pakistani regular-tailored silhouette, while our Oxford Shirts and Gurkha Trousers offer a sharp contemporary fit.";
  }

  return "Welcome to RTS Apparel — Where Pakistani Men Dress Sharp. Explore our hand-loomed Karandi Kurtas, Egyptian Cotton Formal Shirts, Gurkha Pleated Trousers, and Lambskin Suede Jackets. How may I style you today?";
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  // Endpoint 1: POST /api/ai/search (Multilingual English, Urdu & Roman Urdu Smart Search)
  app.post("/api/ai/search", (req, res) => {
    const { query = "" } = req.body || {};
    const keywords = expandSearchQuery(String(query));
    res.json({
      keywords: keywords.length > 0 ? keywords : [String(query).trim()],
      original: query,
    });
  });

  // Endpoint 2: POST /api/ai/recommendations
  app.post("/api/ai/recommendations", (req, res) => {
    const { category = "", language = "en" } = req.body || {};
    const catLower = String(category).toLowerCase();

    let recommendations: string[];
    if (language === "ur") {
      recommendations = [
        "کشمیر پشمینہ زری شال",
        "لاہور سوئیڈ بومبر جیکٹ",
        "سیول گُرکھا پلیٹڈ ٹراؤزرز",
      ];
    } else if (language === "roman_ur") {
      recommendations = [
        "Kashmir Pashmina Zari Shawl",
        "Lahore Lambskin Suede Bomber Jacket",
        "Savile Gurkha Pleated Trousers",
      ];
    } else if (catLower.includes("kurta")) {
      recommendations = [
        "Kashmir Pashmina Zari Shawl",
        "Lahore Lambskin Suede Bomber Jacket",
        "Sultanate Emerald Hand-Loomed Kurta",
      ];
    } else if (catLower.includes("shirt")) {
      recommendations = [
        "Savile Gurkha Pleated Trousers",
        "Lahore Lambskin Suede Bomber Jacket",
        "Clifton Tailored Stretch Chinos",
      ];
    } else {
      recommendations = [
        "Royal Obsidian Zari Karandi Kurta",
        "Imperial Two-Ply Egyptian Cotton Shirt",
        "Savile Gurkha Pleated Trousers",
      ];
    }

    res.json({ recommendations });
  });

  // Endpoint 3: POST /api/ai/chat
  app.post("/api/ai/chat", (req, res) => {
    const { message = "", language = "en" } = req.body || {};
    const reply = buildStylistReply(String(message), String(language));
    res.json({ reply });
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
    console.log(`RTS Apparel server running on http://localhost:${PORT}`);
  });
}

startServer();
