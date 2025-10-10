import { Env, Lead, Note } from "./types";

/* ========================================================================
   LOGIN HANDLER
   ======================================================================== */
export async function handleLogin(req: Request, env: Env): Promise<Response> {
  try {
    const body = (await req.json()) as { username?: string; password?: string };
    if (!body?.username || !body?.password) {
      return jsonResponse({ success: false, error: "Missing credentials" }, 400);
    }

    const userRecord = await env.DB.prepare(
      "SELECT id, username, role, password FROM users WHERE username = ?"
    )
      .bind(body.username)
      .first<{ id: number; username: string; role: string; password: string }>();

    if (!userRecord || userRecord.password.trim() !== body.password.trim()) {
      return jsonResponse({ success: false, error: "Invalid credentials" }, 401);
    }

    const { password: _pw, ...user } = userRecord;
    return jsonResponse({ success: true, data: { user } });
  } catch (err) {
    return jsonResponse(
      { success: false, error: err instanceof Error ? err.message : "Unexpected error" },
      500
    );
  }
}

/* ========================================================================
   LEADS HANDLER
   ======================================================================== */
export async function handleLeads(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);

    switch (req.method) {
      /* --------------------------- GET: Fetch leads --------------------------- */
      case "GET": {
        const role = url.searchParams.get("role");
        const userId = url.searchParams.get("user_id");

        if (!role) return jsonResponse({ success: false, error: "Missing role" }, 400);

        let leads: Lead[] = [];

        if (role === "admin") {
          const result = await env.DB.prepare("SELECT * FROM leads ORDER BY created_at DESC").all<Lead>();
          leads = result.results ?? [];
        } else if (role === "sales") {
          if (!userId) return jsonResponse({ success: false, error: "Missing user_id" }, 400);
          const result = await env.DB.prepare(
            "SELECT * FROM leads WHERE assigned_to = ? ORDER BY created_at DESC"
          )
            .bind(Number(userId))
            .all<Lead>();
          leads = result.results ?? [];
        } else {
          return jsonResponse({ success: false, error: "Invalid role" }, 400);
        }

        return jsonResponse({ success: true, data: leads });
      }

      /* --------------------------- POST: Add new lead --------------------------- */
      case "POST": {
        const data = (await req.json()) as Partial<Lead>;
        if (!data.business_name) {
          return jsonResponse({ success: false, error: "Invalid lead data" }, 400);
        }

        // Fetch all sales users
        const salesUsers = await env.DB.prepare("SELECT id FROM users WHERE role = 'sales'").all<{ id: number }>();
        const sales = salesUsers.results ?? [];
        if (sales.length === 0) {
          return jsonResponse({ success: false, error: "No salespeople found" }, 500);
        }

        // Determine next salesperson to assign
        const lastAssigned = await env.DB.prepare(
          "SELECT assigned_to FROM leads ORDER BY id DESC LIMIT 1"
        ).first<{ assigned_to: number }>();

        const lastIndex = lastAssigned
          ? sales.findIndex((s) => s.id === Math.floor(lastAssigned.assigned_to))
          : -1;
        const nextIndex = (lastIndex + 1) % sales.length;
        const assignedTo = sales[nextIndex].id;

        await env.DB.prepare(
          `INSERT INTO leads (
            id, business_name, name, email, phone, government, budget,
            has_website, message, assigned_to, status, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        )
          .bind(
            crypto.randomUUID(),
            data.business_name,
            data.name ?? "",
            data.email ?? "",
            data.phone ?? "",
            data.government ?? "",
            data.budget ?? "",
            data.has_website ? 1 : 0,
            data.message ?? "",
            assignedTo,
            data.status ?? "First Call"
          )
          .run();

        return jsonResponse({ success: true, data: { assignedTo } });
      }

      /* --------------------------- PUT: Update lead status --------------------------- */
      case "PUT": {
        const data = (await req.json()) as { id?: string; status?: Lead["status"] };
        if (!data.id || !data.status) {
          return jsonResponse({ success: false, error: "Missing id or status" }, 400);
        }

        await env.DB.prepare("UPDATE leads SET status = ? WHERE id = ?")
          .bind(data.status, data.id)
          .run();

        return jsonResponse({ success: true, message: "Lead status updated" });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("Lead handler error:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
}

/* ========================================================================
   NOTES HANDLER
   ======================================================================== */
export async function handleNotes(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);

    switch (req.method) {
      /* --------------------------- GET: Fetch notes --------------------------- */
      case "GET": {
        const lead_id = url.searchParams.get("lead_id");
        if (!lead_id) return jsonResponse({ success: false, error: "Missing lead_id" }, 400);

        const result = await env.DB.prepare(
          "SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC"
        )
          .bind(lead_id)
          .all();

        return jsonResponse({ success: true, data: result.results ?? [] });
      }

      /* --------------------------- POST: Add note --------------------------- */
      case "POST": {
        const body = (await req.json()) as { lead_id?: string; user_id?: number; note?: string };
        if (!body.lead_id || !body.user_id || !body.note) {
          return jsonResponse({ success: false, error: "Missing fields" }, 400);
        }

        await env.DB.prepare(
          "INSERT INTO notes (lead_id, user_id, note, created_at) VALUES (?, ?, ?, datetime('now'))"
        )
          .bind(body.lead_id, body.user_id, body.note)
          .run();

        return jsonResponse({ success: true, message: "Note added successfully" });
      }

      /* --------------------------- PUT: Edit note --------------------------- */
      case "PUT": {
        const body = (await req.json()) as { id?: number; note?: string };
        if (!body.id || !body.note) {
          return jsonResponse({ success: false, error: "Missing id or note" }, 400);
        }

        await env.DB.prepare(
          "UPDATE notes SET note = ?, updated_at = datetime('now') WHERE id = ?"
        )
          .bind(body.note, body.id)
          .run();

        return jsonResponse({ success: true, message: "Note updated successfully" });
      }

      /* --------------------------- DELETE: Delete note --------------------------- */
      case "DELETE": {
        const noteId = url.searchParams.get("id");
        if (!noteId) return jsonResponse({ success: false, error: "Missing note id" }, 400);

        await env.DB.prepare("DELETE FROM notes WHERE id = ?")
          .bind(Number(noteId))
          .run();

        return jsonResponse({ success: true, message: "Note deleted successfully" });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("Notes handler error:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
}

/* ========================================================================
   HELPER FUNCTION
   ======================================================================== */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
