import { json, PagesFunction } from "../../_lib/cors";

interface Ai {
  run(model: string, inputs: Record<string, unknown>): Promise<unknown>;
}

interface Env {
  AI: Ai;
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
}

interface SearchRequest {
  query: string;
  language?: "en" | "ur";
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as SearchRequest;

    if (!body.query || typeof body.query !== "string" || body.query.trim().length === 0) {
      return json({ error: "Missing or empty 'query' field" }, 400);
    }

    const query = body.query.trim();
    const language = body.language || "en";

    if (!context.env || !context.env.AI) {
      console.error("Cloudflare Workers AI binding (context.env.AI) is not available.");
      return json({
        success: true,
        query,
        language,
        keywords: query.split(/\s+/).filter(Boolean),
      });
    }

    // Step 1: Generate multilingual embedding for the search query
    await context.env.AI.run("@cf/baai/bge-m3", { text: [query] });

    // Step 2: Extract search keywords via LLM
    const keywordResult = (await context.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "system",
          content:
            "You are a product search assistant for ARTS APPAREL, a men's fashion store in Pakistan. " +
            "Extract 3-5 relevant product search keywords from the user's query. " +
            "The store sells: Shirts, Trousers, Kurta Shalwar, Hoodies, Jackets. " +
            "Respond ONLY with a valid JSON array of strings. No explanation, no markdown. " +
            'Example: ["blue shirt", "shirts", "blue", "cotton"]',
        },
        {
          role: "user",
          content: `Search query (language: ${language}): "${query}"`,
        },
      ],
      max_tokens: 150,
    })) as { response?: string };

    let keywords: string[] = [];
    try {
      const cleaned = (keywordResult.response || "[]")
        .replace(/```json|```/g, "")
        .trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        keywords = parsed.filter((k): k is string => typeof k === "string");
      }
    } catch {
      keywords = [query];
    }

    return json({
      success: true,
      query,
      language,
      keywords,
    });
  } catch (err) {
    console.error("Search AI error:", err);
    const errorMsg = String(err);
    if (errorMsg.includes("3036")) {
      return json({ error: "Daily AI limit reached. Please try again tomorrow.", keywords: [] }, 429);
    }
    if (errorMsg.includes("3040")) {
      return json({ error: "AI service temporarily unavailable. Using basic search.", keywords: [] }, 503);
    }
    return json({ error: "Search failed. Using basic search.", keywords: [] }, 500);
  }
};
