// Shared CORS headers and JSON response helper
// Pages Functions run on same domain as frontend — CORS not strictly needed
// but included for safety if called from preview URLs or different origins

export interface CloudflareContext<Env = unknown> {
  request: Request;
  env: Env;
  params?: Record<string, string>;
}

export type PagesFunction<Env = unknown> = (
  context: CloudflareContext<Env>
) => Response | Promise<Response>;

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

// Handle CORS preflight for all AI endpoints
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};
