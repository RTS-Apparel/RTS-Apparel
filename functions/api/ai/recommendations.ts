import { json, PagesFunction } from "../../_lib/cors";

interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

interface Env {
  AI: Ai;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

interface RecommendationRequest {
  product_id: string;
  category: string;
  tags?: string[];
  name?: string;
}

interface RecommendationItem {
  attribute: string;
  reason: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as RecommendationRequest;

    if (!body.category) {
      return json({ error: "Missing 'category' field" }, 400);
    }

    if (!context.env || !context.env.AI) {
      console.error("Cloudflare Workers AI binding (context.env.AI) is not available.");
      return json({
        success: false,
        product_id: body.product_id || "",
        category: body.category,
        recommendations: [],
      });
    }

    const result = (await context.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a product recommendation engine for ARTS APPAREL, a premium men's fashion store in Pakistan. " +
            "The store sells: Shirts, Trousers, Kurta Shalwar, Hoodies, Jackets. " +
            "Given a product's details, suggest 4 related product attributes that would " +
            "appeal to the same customer. Focus on Pakistani men's fashion trends. " +
            "Respond ONLY with valid JSON in this exact format — no markdown, no extra text: " +
            '{"recommendations": [{"attribute": "string", "reason": "string"}]}',
        },
        {
          role: "user",
          content: JSON.stringify({
            product_id: body.product_id,
            category: body.category,
            name: body.name || "",
            tags: body.tags || [],
          }),
        },
      ],
      max_tokens: 400,
    })) as { response?: string };

    let recommendations: RecommendationItem[] = [];
    try {
      const cleaned = (result.response || "{}")
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        recommendations = parsed.recommendations;
      }
    } catch {
      recommendations = [];
    }

    return json({
      success: true,
      product_id: body.product_id,
      category: body.category,
      recommendations,
    });
  } catch (err) {
    console.error("Recommendations AI error:", err);
    return json(
      {
        success: false,
        product_id: "",
        category: "",
        recommendations: [],
      },
      200
    );
  }
};
