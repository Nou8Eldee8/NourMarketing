import { Env } from "./types";
import {
  handleLogin,
  handleLeads,
  handleNotes,
  handleUsers,
  handleClients,
  handlePosts,
  handleAdmin,
} from "./handlers";

/**
 * ✅ Cloudflare Worker Entry
 * Handles: /api/login, /api/lead, /api/notes, /api/users, /api/admin
 * Includes: full CORS + robust error handling
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const { pathname } = url;

      // 🧱 Handle CORS preflight
      if (request.method === "OPTIONS") return corsResponse();

      // ----------------------------------------------------------------------
      // 🧩 LOGIN
      // ----------------------------------------------------------------------
      if (pathname === "/api/login" && request.method === "POST") {
        return withCORS(await handleLogin(request, env));
      }

      // ----------------------------------------------------------------------
      // 🧩 LEADS
      // ----------------------------------------------------------------------
      if (pathname === "/api/lead" && ["GET", "POST", "PUT"].includes(request.method)) {
        return withCORS(await handleLeads(request, env));
      }

      // ----------------------------------------------------------------------
      // 🧩 NOTES
      // ----------------------------------------------------------------------
      if (pathname === "/api/notes" && ["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
        return withCORS(await handleNotes(request, env));
      }

      // ----------------------------------------------------------------------
      // 🧩 USERS
      // ----------------------------------------------------------------------
      if (pathname === "/api/users" && ["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
        return withCORS(await handleUsers(request, env));
      }

      // ----------------------------------------------------------------------
      // 🧩 CLIENTS
      // ----------------------------------------------------------------------
      if (pathname === "/api/clients" && ["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
        return withCORS(await handleClients(request, env));
      }

      // ----------------------------------------------------------------------
      // 🧩 POSTS
      // ----------------------------------------------------------------------
      if (pathname === "/api/posts" && ["GET", "POST", "PUT", "DELETE"].includes(request.method)) {
        return withCORS(await handlePosts(request, env));
      }

      // ----------------------------------------------------------------------
      // 🧩 ADMIN DASHBOARD
      // ----------------------------------------------------------------------
      if (pathname === "/api/admin" && request.method === "GET") {
        return withCORS(await handleAdmin(request, env));
      }

      // ----------------------------------------------------------------------
      // ❌ NOT FOUND
      // ----------------------------------------------------------------------
      return withCORS(jsonResponse({ success: false, error: "Not found" }, 404));
    } catch (err: unknown) {
      console.error("Worker error:", err);

      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Internal server error";

      return withCORS(jsonResponse({ success: false, error: message }, 500));
    }
  },
};

/* -------------------------------------------------------------------------- */
/*                              🔧 Helper Functions                           */
/* -------------------------------------------------------------------------- */

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data ?? {}), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function withCORS(res: Response): Response {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(res.body, { status: res.status, headers });
}

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
