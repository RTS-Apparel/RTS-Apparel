import { json, PagesFunction } from "../../_lib/cors";

interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

interface Env {
  AI: Ai;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

const SYSTEM_PROMPT = `You are the RTS Apparel customer support assistant.
RTS Apparel is a premium men's fashion e-commerce store based in Pakistan.

Your role:
- Answer questions about orders, delivery, returns, exchanges, sizing, products, and payment.
- Be helpful, friendly, and concise. Keep responses under 120 words.
- If the customer writes in Urdu, respond ONLY in Urdu.
- If the customer writes in English, respond ONLY in English.
- If you don't know specific order details, direct them to check their email or contact support.
- Never make up order details, tracking numbers, or specific product availability.
- Never mention competitors.

Store policies:
- Delivery: 3-5 business days in major cities, 5-7 days for other areas
- Returns: 7 days, items must be unworn with original tags attached
- Exchange: Free size exchange within 7 days of delivery
- Payment: Cash on Delivery (COD), JazzCash, EasyPaisa, Bank Transfer
- Order tracking: Go to our website -> Track Order -> enter order number

Contact for complex issues: WhatsApp number shown on our website.`;

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as ChatRequest;

    if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0) {
      return json({ error: "Missing or empty 'message' field" }, 400);
    }

    const history = (body.history || []).slice(-8);

    const validHistory = history.filter(
      (msg) =>
        msg &&
        typeof msg === "object" &&
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string"
    );

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...validHistory,
      { role: "user", content: body.message.trim() },
    ];

    const result = (await context.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages,
      max_tokens: 300,
    })) as { response?: string };

    const reply = result.response?.trim();
    if (!reply) {
      return json({
        reply: "Sorry, I couldn't process your message. Please try again or contact us on WhatsApp.",
      });
    }

    return json({
      success: true,
      reply,
      model: "@cf/meta/llama-3.1-8b-instruct",
    });
  } catch (err) {
    console.error("Chat AI error:", err);
    const errorMsg = String(err);

    if (errorMsg.includes("3036")) {
      return json({
        reply: "Our AI chat is temporarily unavailable (daily limit reached). Please contact us on WhatsApp for immediate help.",
      });
    }
    if (errorMsg.includes("3040")) {
      return json({
        reply: "Chat is temporarily unavailable. Please try again in a moment or contact us on WhatsApp.",
      });
    }

    return json({
      reply: "Something went wrong. Please contact us on WhatsApp for help.",
    });
  }
};
