import { Env } from "./types";
import { handleLogin, handleLeads } from "./handlers";

/**
 * ✅ TypeScript-safe Worker entry
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const { pathname } = url;

      // Route: Login
      if (pathname === "/api/login" && request.method === "POST") {
        const response = await handleLogin(request, env);
        return ensureJsonResponse(response);
      }

      // Route: Leads (GET for fetching, POST for creating)
      if (pathname === "/api/lead") {
        if (request.method === "GET" || request.method === "POST") {
          const response = await handleLeads(request, env);
          return ensureJsonResponse(response);
        }
        return jsonResponse({ error: "Method not allowed" }, 405);
      }

      // Route: Admin (GET all leads)
      if (pathname === "/api/admin" && request.method === "GET") {
        const response = await handleLeads(request, env);
        return ensureJsonResponse(response);
      }

      // Default: Not Found
      return jsonResponse({ error: "Not found" }, 404);

    } catch (err) {
      console.error("Worker error:", err);
      return jsonResponse(
        { error: err instanceof Error ? err.message : "Internal server error" },
        500
      );
    }
  },
};

/* -------------------------------------------------------------------------- */
/*                              🔧 Helper Functions                           */
/* -------------------------------------------------------------------------- */

/** Wraps any response to ensure JSON */
function ensureJsonResponse(res: Response): Response {
  const contentType = res.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    console.warn("⚠️ Handler did not return JSON, wrapping it manually.");
    return jsonResponse({ message: res.statusText || "OK" }, res.status);
  }
  return res;
}

/** Creates a JSON response with correct headers */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
