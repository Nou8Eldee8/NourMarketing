import { Env, User, Lead } from "./types";

/* --------------------------- LOGIN HANDLER --------------------------- */
export async function handleLogin(req: Request, env: Env): Promise<Response> {
  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object") {
      return jsonResponse({ success: false, error: "Missing credentials" }, 400);
    }

    const { username, password } = body as { username: string; password: string };
    if (!username || !password) {
      return jsonResponse({ success: false, error: "Missing username or password" }, 400);
    }

    const userRecord = await env.DB.prepare(
      "SELECT id, username, role, password FROM users WHERE username = ?"
    )
      .bind(username)
      .first<{ id: number; username: string; role: string; password: string }>();

    if (!userRecord || userRecord.password?.trim() !== password.trim()) {
      return jsonResponse({ success: false, error: "Invalid credentials" }, 401);
    }

    const { password: _pw, ...user } = userRecord;
    return jsonResponse({ success: true, data: { user } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return jsonResponse({ success: false, error: message }, 500);
  }
}

/* --------------------------- LEADS HANDLER --------------------------- */
export async function handleLeads(req: Request, env: Env): Promise<Response> {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const role = url.searchParams.get("role");
      const userId = url.searchParams.get("user_id");

      if (!role) return jsonResponse({ success: false, error: "Missing role" }, 400);

      let leads: Lead[] = [];

      if (role === "admin") {
        const result = await env.DB.prepare("SELECT * FROM leads").all<Lead>();
        leads = result.results ?? [];
      } else if (role === "sales") {
        if (!userId) return jsonResponse({ success: false, error: "Missing user_id" }, 400);

        const result = await env.DB.prepare("SELECT * FROM leads WHERE assigned_to = ?")
          .bind(Number(userId)) // ensure integer match
          .all<Lead>();
        leads = result.results ?? [];
      } else {
        return jsonResponse({ success: false, error: "Invalid role" }, 400);
      }

      return jsonResponse({ success: true, data: leads });
    }

    if (req.method === "POST") {
      const data: unknown = await req.json();
      if (!data || typeof data !== "object" || !("business_name" in data)) {
        return jsonResponse({ success: false, error: "Invalid lead data" }, 400);
      }

      const lead = data as Omit<Lead, "id">;

      // Get all salespeople
      const sales = await env.DB.prepare("SELECT id FROM users WHERE role = 'sales'")
        .all<{ id: number }>()
        .then((r) => r.results ?? []);

      if (sales.length === 0) return jsonResponse({ success: false, error: "No salespeople found" }, 500);

      // Round-robin assignment
      const lastAssigned = await env.DB.prepare("SELECT assigned_to FROM leads ORDER BY id DESC LIMIT 1")
        .first<{ assigned_to: number }>();
      const nextIndex = lastAssigned
        ? (sales.findIndex((s) => s.id === Math.floor(lastAssigned.assigned_to)) + 1) % sales.length
        : 0;
      const assignedTo = sales[nextIndex].id;

      // Insert new lead
      await env.DB.prepare(
        `INSERT INTO leads 
          (id, business_name, name, email, phone, government, budget, has_website, message, assigned_to, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      )
        .bind(
          crypto.randomUUID(),
          lead.business_name,
          lead.name ?? "",
          lead.email ?? "",
          lead.phone ?? "",
          lead.government ?? "",
          lead.budget ?? 0,
          lead.has_website ? 1 : 0,
          lead.message ?? "",
          assignedTo, // already integer
        )
        .run();

      return jsonResponse({ success: true, data: { assignedTo } });
    }

    return jsonResponse({ success: false, error: "Invalid method" }, 405);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("Lead handler error:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
}

/* --------------------------- HELPER --------------------------- */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
