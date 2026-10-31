interface Env {
  AI: {
    run: (model: string, input: Record<string, unknown>) => Promise<unknown>;
  };
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message?: string;
  history?: ChatMessage[];
  language?: "en" | "ur" | "roman_ur";
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const SYSTEM_PROMPT = `Tu ARTS APPAREL ka friendly customer support assistant hai.
Tu SIRF Roman Urdu mein baat karta hai — matlab Urdu words ko English 
letters mein likhta hai. Kabhi pure English ya pure Urdu script mein 
jawab mat dena.

Teri personality:
- Bilkul dost jaisa, warm aur helpful
- Har reply mein 2-3 emojis use karo
- Customer ko "Bhai" ya "Dost" keh kar address karo
- Chote aur clear jawab do (3-4 lines max)
- Thoda friendly humor bhi chalega

Store info:
- Naam: ARTS APPAREL
- Kaam: Premium Mard's Fashion — Shirts, Trousers, Kurta Shalwar, 
  Waistcoats, Hoodies, Jackets, T-Shirts, Jeans
- Location: Club Road Near New Cafe Sajawal Sadiqabad, Sadiqabad, Pakistan
- WhatsApp: 03058165623
- Delivery: Poore Pakistan mein — 3 se 5 working days (major cities),
  5 se 7 days (baqi areas)
- Return policy: 7 din ke andar wapsi — kapra unworn aur original tag 
  ke saath hona chahiye
- Exchange: Size change bilkul free hai 7 din mein
- Payment: Cash on Delivery (COD), JazzCash, EasyPaisa, Bank Transfer

Common sawalon ke jawab aise do:
- Order track karna ho → "Bhai, 'Track Order' page pe jao aur apna 
  order number daalo — sab kuch dikh jayega! 📦🔍"
- Delivery kitne din mein → "Dost, 3 se 5 working days mein ghar 
  pohonch jayega inshallah! 🚚✨"
- Return karna ho → "Koi masla nahi Bhai! 7 din ke andar unworn kapra 
  wapas kar sakte ho. WhatsApp karo: 03058165623 😊👍"
- Discount/offer → "Yaar abhi site pe zabardast discounts chal rahe 
  hain! Homepage dekho ya apna referral code use karo 🔥🎉"
- Size guide → "Bhai har product page pe size chart mojood hai — 
  S, M, L, XL, XXL sab milte hain. Confusion ho to poochho! 👕📏"
- Agent/Referral → "Dost agar agent banna chahte ho aur commission 
  kamana chahte ho to WhatsApp karo: 03058165623 💰🤝"

Agar koi aisi cheez poochhe jo tujhe nahi pata:
"Yaar is baare mein pakka nahi pata 😅 Seedha WhatsApp karo: 
03058165623 — wahan poori madad milegi! 💬✨"

Kabhi bhi store ke bahar ke topics pe baat mat karo (politics, 
religion, etc.) — politely kaho: "Yaar yeh meri expertise se 
bahar hai 😅 ARTS APPAREL fashion ke baare mein poochho, ya 
WhatsApp karo: 03058165623"`;

export function buildRomanUrduReply(rawMessage: string): string {
  const q = rawMessage.toLowerCase();

  if (
    q.includes("politics") ||
    q.includes("religion") ||
    q.includes("cricket") ||
    q.includes("weather") ||
    q.includes("movie")
  ) {
    return "Yaar yeh meri expertise se bahar hai 😅 ARTS APPAREL fashion ke baare mein poochho, ya WhatsApp karo: 03058165623 💬✨";
  }

  if (q.includes("track") || q.includes("order status") || q.includes("kahan")) {
    return "Bhai, 'Track Order' page pe jao aur apna order number daalo — sab kuch foran dikh jayega! 📦🔍 Agar phir bhi masla ho to WhatsApp karo: 03058165623 😊";
  }

  if (
    q.includes("delivery") ||
    q.includes("shipping") ||
    q.includes("din") ||
    q.includes("charges") ||
    q.includes("kab")
  ) {
    return "Dost, 3 se 5 working days mein major cities aur 5 se 7 din mein baqi areas mein parcel pohonch jayega inshallah! 🚚✨ Delivery charges city ke hisaab se Rs. 200 se shuru hain 📦";
  }

  if (
    q.includes("return") ||
    q.includes("exchange") ||
    q.includes("wapsi") ||
    q.includes("wapas") ||
    q.includes("refund")
  ) {
    return "Koi masla nahi Bhai! 7 din ke andar unworn kapra original tag ke saath wapas ya free size exchange kar sakte ho 😊👍 WhatsApp karo: 03058165623 💬";
  }

  if (
    q.includes("size") ||
    q.includes("chart") ||
    q.includes("measurement") ||
    q.includes("fit")
  ) {
    return "Bhai har product page pe size chart mojood hai — S, M, L, XL, XXL sab milte hain! 👕📏 Confusion ho to apna chest size batao ya WhatsApp karo: 03058165623 😄";
  }

  if (
    q.includes("discount") ||
    q.includes("sale") ||
    q.includes("offer") ||
    q.includes("promo")
  ) {
    return "Yaar abhi site pe zabardast discounts chal rahe hain! 🔥🎉 Homepage dekho ya checkout pe apna agent referral code lagao aur bachat karo 😎";
  }

  if (
    q.includes("agent") ||
    q.includes("referral") ||
    q.includes("commission") ||
    q.includes("partner") ||
    q.includes("earn")
  ) {
    return "Dost agar agent banna chahte ho aur har order pe 10%-15% commission kamana chahte ho to WhatsApp karo: 03058165623 💰🤝";
  }

  if (
    q.includes("payment") ||
    q.includes("cod") ||
    q.includes("jazzcash") ||
    q.includes("easypaisa") ||
    q.includes("bank") ||
    q.includes("paisa")
  ) {
    return "Bhai Cash on Delivery (COD), JazzCash, EasyPaisa aur Bank Transfer — charon options mojood hain! 💳✨ Jo aapko easy lage wo select karo 😄";
  }

  if (
    q.includes("address") ||
    q.includes("location") ||
    q.includes("shop") ||
    q.includes("store") ||
    q.includes("sadiqabad") ||
    q.includes("whatsapp") ||
    q.includes("contact") ||
    q.includes("number")
  ) {
    return "Bhai hamara store Club Road Near New Cafe Sajawal Sadiqabad, Sadiqabad mein hai! 📍✨ Seedha WhatsApp pe bhi rabta kar sakte ho: 03058165623 📞😊";
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
    q.includes("price") ||
    q.includes("kapra")
  ) {
    return "Dost ARTS APPAREL pe premium Shirts, Trousers, Kurta Shalwar, Waistcoats, Hoodies aur Jackets sab top quality mein mojood hain! 👔🔥 Category page kholo aur apna pasandida style chuno 😄";
  }

  if (
    q.includes("salam") ||
    q.includes("assalam") ||
    q.includes("aoa") ||
    q.includes("hello") ||
    q.includes("hi") ||
    q.includes("hey") ||
    q.includes("kya haal")
  ) {
    return "Walaikum Assalam Bhai! 👋 अल्हम्दुलिल्लाह sab fit hai, aap sunao? ARTS APPAREL ke orders, sizes ya delivery ke baare mein kuch bhi poochho! 😄✨";
  }

  return "Bhai, main ARTS APPAREL ke products, available sizes, prices, delivery, payment aur return policy mein madad kar sakta hun. Apna sawal thora detail se batao, main guide karta hun. 😊👕";
}

export async function onRequest(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: corsHeaders }
    );
  }

  try {
    const body = (await request.json()) as ChatRequest;
    const rawMessage = typeof body.message === "string" ? body.message.trim() : "";

    if (!rawMessage) {
      return new Response(
        JSON.stringify({
          success: true,
          reply:
            "Assalam o Alaikum Bhai! 👋 Main ARTS APPAREL ka assistant hun. Orders, delivery ya sizes ke baare mein kuch bhi poochho! 😄✨",
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    const safeHistory = Array.isArray(body.history)
      ? body.history
          .slice(-6)
          .filter(
            (m) =>
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string"
          )
          .map((m) => ({
            role: m.role,
            content: m.content.slice(0, 350),
          }))
      : [];

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...safeHistory,
      { role: "user", content: rawMessage.slice(0, 500) },
    ];

    if (env?.AI) {
      try {
        const response = (await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          messages,
          max_tokens: 220,
          temperature: 0.6,
        })) as { response?: string };

        const replyText = (response?.response || "").trim();
        if (replyText) {
          return new Response(
            JSON.stringify({
              success: true,
              reply: replyText,
            }),
            { status: 200, headers: corsHeaders }
          );
        }
      } catch {
        // If Workers AI is temporarily unavailable, continue with the local FAQ
        // replies below instead of sending every customer straight to WhatsApp.
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        reply: buildRomanUrduReply(rawMessage),
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return new Response(
      JSON.stringify({
        success: false,
        reply:
          "Bhai, chat mein filhal technical masla aa gaya hai. Delivery, size, return, payment ya order tracking ke baare mein dobara poochho — main madad karne ki koshish karta hun. 😅🤝",
      }),
      { status: 200, headers: corsHeaders }
    );
  }
}
