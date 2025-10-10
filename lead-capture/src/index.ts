import { Env } from "./types";
import { handleLogin, handleLeads, handleNotes } from "./handlers";

/**
 * ✅ Cloudflare Worker Entry (with full CORS support)
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const { pathname } = url;

      // 🧱 Preflight requests (CORS OPTIONS)
      if (request.method === "OPTIONS") {
        return corsResponse();
      }

      /* --------------------------- LOGIN --------------------------- */
      if (pathname === "/api/login" && request.method === "POST") {
        const response = await handleLogin(request, env);
        return withCORS(response);
      }

      /* --------------------------- LEADS --------------------------- */
      if (pathname === "/api/lead" && ["GET", "POST", "PUT"].includes(request.method)) {
        const response = await handleLeads(request, env);
        return withCORS(response);
      }

      /* --------------------------- NOTES --------------------------- */
      if (pathname === "/api/notes" && ["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
        const response = await handleNotes(request, env);
        return withCORS(response);
      }

      /* --------------------------- ADMIN --------------------------- */
      if (pathname === "/api/admin" && request.method === "GET") {
        const response = await handleLeads(request, env);
        return withCORS(response);
      }

      /* --------------------------- NOT FOUND --------------------------- */
      return withCORS(jsonResponse({ success: false, error: "Not found" }, 404));
    } catch (err) {
      console.error("Worker error:", err);
      return withCORS(
        jsonResponse(
          { success: false, error: err instanceof Error ? err.message : "Internal server error" },
          500
        )
      );
    }
  },
};

/* -------------------------------------------------------------------------- */
/*                              🔧 Helper Functions                           */
/* -------------------------------------------------------------------------- */

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * ✅ Adds CORS headers to any response
 */
function withCORS(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(res.body, { status: res.status, headers });
}

/**
 * 🧩 Response for CORS preflight (OPTIONS)
 */
function corsResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
