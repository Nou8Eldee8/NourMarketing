import { Env, Lead } from "./types";

/* ============================================================================
   LOGIN HANDLER
   ============================================================================ */
export async function handleLogin(req: Request, env: Env): Promise<Response> {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      username?: string;
      password?: string;
    };

    if (!body.username || !body.password) {
      return jsonResponse({ success: false, error: "Missing credentials" }, 400);
    }

    // --- 1️⃣ Try primary DB (nour-leads)
    let userRecord = await env.DB.prepare(
      "SELECT id, username, role, password FROM users WHERE username = ?"
    )
      .bind(body.username)
      .first<{ id: number; username: string; role: string; password: string }>();

    // --- 2️⃣ If not found, try ops DB (nour-ops)
    if (!userRecord && env.OPS_DB) {
      userRecord = await env.OPS_DB.prepare(
        "SELECT id, username, ops_role AS role, password FROM users WHERE username = ?"
      )
        .bind(body.username)
        .first<{ id: number; username: string; role: string; password: string }>();
    }

    if (!userRecord) {
      return jsonResponse({ success: false, error: "User not found" }, 404);
    }

    // --- 3️⃣ Verify password
    if (userRecord.password.trim() !== body.password.trim()) {
      return jsonResponse({ success: false, error: "Invalid credentials" }, 401);
    }

    // --- 4️⃣ Return clean user
    const { password: _pw, ...user } = userRecord;
    return jsonResponse({ success: true, data: { user } });
  } catch (err) {
    return handleError(err, "Login error");
  }
}

/* ============================================================================
   LEADS HANDLER
   ============================================================================ */
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
          const result = await env.DB.prepare(
            "SELECT * FROM leads ORDER BY created_at DESC"
          ).all<Lead>();
          leads = result.results ?? [];
        } else if (role === "sales") {
          if (!userId)
            return jsonResponse({ success: false, error: "Missing user_id" }, 400);
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

      /* --------------------------- POST: Add lead --------------------------- */
      case "POST": {
        const data = (await req.json().catch(() => ({}))) as Partial<Lead>;
        if (!data.business_name) {
          return jsonResponse({ success: false, error: "Invalid lead data" }, 400);
        }

        // 1️⃣ Fetch all sales users
        const salesUsers = await env.DB.prepare(
          "SELECT id FROM users WHERE role = 'sales' ORDER BY id ASC"
        ).all<{ id: number }>();

        const sales = salesUsers.results ?? [];
        if (sales.length === 0)
          return jsonResponse({ success: false, error: "No salespeople found" }, 500);

        // 2️⃣ Get last assigned salesperson
        const lastAssigned = await env.DB.prepare(
          "SELECT assigned_to FROM leads ORDER BY created_at DESC LIMIT 1"
        ).first<{ assigned_to: number }>();

        const lastId = lastAssigned ? Number(lastAssigned.assigned_to) : null;
        const lastIndex =
          lastId !== null ? sales.findIndex((s) => Number(s.id) === lastId) : -1;

        // 3️⃣ Round robin assignment
        const nextIndex = (lastIndex + 1) % sales.length;
        const assignedTo = sales[nextIndex].id;

        // 4️⃣ Insert new lead
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
            data.status ?? "Not Contacted"
          )
          .run();

        return jsonResponse({ success: true, data: { assignedTo } });
      }

      /* --------------------------- PUT: Update lead --------------------------- */
      case "PUT": {
        const data = (await req.json().catch(() => ({}))) as {
          id?: string;
          status?: Lead["status"];
        };

        if (!data.id || !data.status) {
          return jsonResponse({ success: false, error: "Missing id or status" }, 400);
        }

        await env.DB.prepare("UPDATE leads SET status = ? WHERE id = ?")
          .bind(data.status, data.id)
          .run();

        return jsonResponse({ success: true, message: "Lead status updated" });
      }

      default:
        return methodNotAllowed();
    }
  } catch (err) {
    return handleError(err, "Lead handler error");
  }
}

/* ============================================================================
   NOTES HANDLER
   ============================================================================ */
export async function handleNotes(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);

    switch (req.method) {
      /* --------------------------- GET: Fetch notes --------------------------- */
      case "GET": {
        const lead_id = url.searchParams.get("lead_id");
        if (!lead_id)
          return jsonResponse({ success: false, error: "Missing lead_id" }, 400);

        const result = await env.DB.prepare(
          "SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC"
        )
          .bind(lead_id)
          .all();

        return jsonResponse({ success: true, data: result.results ?? [] });
      }

      /* --------------------------- POST: Add note --------------------------- */
      case "POST": {
        const body = (await req.json().catch(() => ({}))) as {
          lead_id?: string;
          user_id?: number;
          note?: string;
        };
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
        const body = (await req.json().catch(() => ({}))) as {
          id?: number;
          note?: string;
        };
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
        if (!noteId)
          return jsonResponse({ success: false, error: "Missing note id" }, 400);

        await env.DB.prepare("DELETE FROM notes WHERE id = ?")
          .bind(Number(noteId))
          .run();

        return jsonResponse({ success: true, message: "Note deleted successfully" });
      }

      default:
        return methodNotAllowed();
    }
  } catch (err) {
    return handleError(err, "Notes handler error");
  }
}

/* ============================================================================
   USERS HANDLER (NEW)
   ============================================================================ */
export async function handleUsers(req: Request, env: Env): Promise<Response> {
  try {
    switch (req.method) {
      case "GET": {
        const result = await env.DB.prepare("SELECT id, username, role FROM users").all();
        return jsonResponse({ success: true, data: result.results ?? [] });
      }

      case "POST": {
        const body = (await req.json().catch(() => ({}))) as {
          username?: string;
          password?: string;
          role?: string;
        };
        if (!body.username || !body.password || !body.role) {
          return jsonResponse({ success: false, error: "Missing fields" }, 400);
        }

        await env.DB.prepare(
          "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"
        )
          .bind(body.username, body.password, body.role)
          .run();

        return jsonResponse({ success: true, message: "User added" });
      }

      case "PUT": {
        const body = (await req.json().catch(() => ({}))) as {
          id?: number;
          username?: string;
          password?: string;
          role?: string;
        };
        if (!body.id) return jsonResponse({ success: false, error: "Missing user id" }, 400);

        await env.DB.prepare(
          "UPDATE users SET username = COALESCE(?, username), password = COALESCE(?, password), role = COALESCE(?, role) WHERE id = ?"
        )
          .bind(body.username, body.password, body.role, body.id)
          .run();

        return jsonResponse({ success: true, message: "User updated" });
      }

      case "DELETE": {
        const body = (await req.json().catch(() => ({}))) as { id?: number };
        if (!body.id) return jsonResponse({ success: false, error: "Missing user id" }, 400);

        await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(body.id).run();
        return jsonResponse({ success: true, message: "User deleted" });
      }

      default:
        return methodNotAllowed();
    }
  } catch (err) {
    return handleError(err, "Users handler error");
  }
}
/* ========================================================================
   CLIENTS HANDLER
   ======================================================================== */
export async function handleClients(req: Request, env: Env): Promise<Response> {
  const { OPS_DB } = env;
  const url = new URL(req.url);

  try {
    switch (req.method) {
      /* --------------------------------------------------------------------
         📖 GET → list all clients (with published counts)
      -------------------------------------------------------------------- */
      case "GET": {
        const id = url.searchParams.get("id");

        if (id) {
          const client = await OPS_DB.prepare(
            `SELECT * FROM clients WHERE id = ?`
          ).bind(id).first();

          if (!client) {
            return jsonResponse({ success: false, error: "Client not found" }, 404);
          }

          const publishes = await OPS_DB.prepare(`
            SELECT 
              content_type,
              platform,
              publish_date,
              link
            FROM publishes
            WHERE client_id = ?
          `).bind(id).all();

          return jsonResponse({ success: true, client, publishes: publishes.results });
        }

        // Get all clients with aggregated counts
        const all = await OPS_DB.prepare(`
          SELECT 
            c.id,
            c.name,
            c.industry,
            c.status,
            c.videos_in_contract,
            c.posts_in_contract,
            COUNT(CASE WHEN p.content_type = 'Video' THEN 1 END) AS videos_published,
            COUNT(CASE WHEN p.content_type = 'Post' THEN 1 END) AS posts_published
          FROM clients c
          LEFT JOIN publishes p ON p.client_id = c.id
          GROUP BY c.id
          ORDER BY c.id DESC
        `).all();

        return jsonResponse({ success: true, clients: all.results });
      }

      /* --------------------------------------------------------------------
         ➕ POST → add a new client
      -------------------------------------------------------------------- */
      case "POST": {
        const data: {
          name: string;
          industry?: string;
          start_date?: string;
          notes?: string;
          status?: string;
          videos_in_contract?: number;
          posts_in_contract?: number;
        } = await req.json();

        if (!data.name) {
          return jsonResponse({ success: false, error: "Name required" }, 400);
        }

        await OPS_DB.prepare(`
          INSERT INTO clients (name, industry, start_date, notes, status, videos_in_contract, posts_in_contract)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          data.name,
          data.industry ?? "",
          data.start_date ?? "",
          data.notes ?? "",
          data.status ?? "Active",
          data.videos_in_contract ?? 0,
          data.posts_in_contract ?? 0
        ).run();

        return jsonResponse({ success: true, message: "Client added" });
      }

/* --------------------------------------------------------------------
   ✏️ PUT → update client
-------------------------------------------------------------------- */
case "PUT": {
  const data: {
    id: number;
    name: string;
    industry?: string;
    start_date?: string;
    notes?: string;
    status?: string;
    videos_in_contract?: number;
    posts_in_contract?: number;
    leave_reason?: string;
  } = await req.json();

  if (!data.id) {
    return jsonResponse({ success: false, error: "Missing client id" }, 400);
  }

  await OPS_DB.prepare(`
    UPDATE clients
    SET name = ?, industry = ?, start_date = ?, notes = ?, status = ?, 
        videos_in_contract = ?, posts_in_contract = ?, leave_reason = ?
    WHERE id = ?
  `).bind(
    data.name,
    data.industry ?? "",
    data.start_date ?? "",
    data.notes ?? "",
    data.status ?? "",
    data.videos_in_contract ?? 0,
    data.posts_in_contract ?? 0,
    data.leave_reason ?? "",
    data.id
  ).run();

  return jsonResponse({ success: true, message: "Client updated" });
}

      /* --------------------------------------------------------------------
         🗑 DELETE → remove client
      -------------------------------------------------------------------- */
      case "DELETE": {
        const id = url.searchParams.get("id");
        if (!id) return jsonResponse({ success: false, error: "Missing id" }, 400);

        await OPS_DB.prepare(`DELETE FROM clients WHERE id = ?`).bind(id).run();
        return jsonResponse({ success: true, message: "Client deleted" });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    console.error("Error in handleClients:", err);
    return jsonResponse({ success: false, error: String(err) }, 500);
  }
}

export async function handlePosts(req: Request, env: Env): Promise<Response> {
  const { OPS_DB } = env;
  const url = new URL(req.url);

  try {
    switch (req.method) {
      /* --------------------------------------------------------------------
         📖 GET → all publishes or by client_id
      -------------------------------------------------------------------- */
      case "GET": {
        const clientId = url.searchParams.get("client_id");

        let query = `
          SELECT 
            p.id,
            p.client_id,
            p.edit_id,
            p.content_type,
            p.platform,
            p.publish_date,
            p.link,
            p.posted_by,
            c.name AS client_name,
            u.name AS posted_by_name
          FROM publishes p
          LEFT JOIN clients c ON p.client_id = c.id
          LEFT JOIN users u ON p.posted_by = u.id
        `;

        const binds: (string | number)[] = [];
        if (clientId) {
          query += " WHERE p.client_id = ?";
          binds.push(clientId);
        }

        query += " ORDER BY p.publish_date DESC";

        const all = await OPS_DB.prepare(query).bind(...binds).all();
        return jsonResponse({ success: true, publishes: all.results });
      }

      /* --------------------------------------------------------------------
         ➕ POST → add new publish
      -------------------------------------------------------------------- */
      case "POST": {
        const data: {
          client_id: number;
          edit_id: number;
          content_type: "Video" | "Post";
          platform?: "Instagram" | "Facebook" | "TikTok" | "YouTube" | "Other";
          publish_date?: string;
          link?: string;
          posted_by?: number;
        } = await req.json();

        if (!data.client_id || !data.edit_id || !data.content_type) {
          return jsonResponse({ success: false, error: "Missing required fields" }, 400);
        }

        await OPS_DB.prepare(
          `INSERT INTO publishes (client_id, edit_id, content_type, platform, publish_date, link, posted_by)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            data.client_id,
            data.edit_id,
            data.content_type,
            data.platform ?? "Instagram",
            data.publish_date ?? new Date().toISOString().split("T")[0],
            data.link ?? "",
            data.posted_by ?? null
          )
          .run();

        return jsonResponse({ success: true, message: "Publish added successfully" });
      }

      /* --------------------------------------------------------------------
         ✏️ PUT → update publish
      -------------------------------------------------------------------- */
      case "PUT": {
        const data: {
          id: number;
          content_type?: "Video" | "Post";
          platform?: string;
          publish_date?: string;
          link?: string;
          posted_by?: number;
        } = await req.json();

        if (!data.id) {
          return jsonResponse({ success: false, error: "Missing id" }, 400);
        }

        await OPS_DB.prepare(
          `UPDATE publishes
           SET content_type = ?, platform = ?, publish_date = ?, link = ?, posted_by = ?
           WHERE id = ?`
        )
          .bind(
            data.content_type ?? "Post",
            data.platform ?? "Instagram",
            data.publish_date ?? "",
            data.link ?? "",
            data.posted_by ?? null,
            data.id
          )
          .run();

        return jsonResponse({ success: true, message: "Publish updated" });
      }

      /* --------------------------------------------------------------------
         🗑 DELETE → remove publish
      -------------------------------------------------------------------- */
      case "DELETE": {
        const id = url.searchParams.get("id");
        if (!id) return jsonResponse({ success: false, error: "Missing id" }, 400);

        await OPS_DB.prepare(`DELETE FROM publishes WHERE id = ?`).bind(id).run();
        return jsonResponse({ success: true, message: "Publish deleted" });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    console.error("Error in handlePosts:", err);
    return jsonResponse({ success: false, error: String(err) }, 500);
  }
}


/* ============================================================================
   HELPERS
   ============================================================================ */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data ?? {}), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function handleError(err: unknown, context: string): Response {
  const message =
    err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
  console.error(`${context}:`, message);
  return jsonResponse({ success: false, error: message }, 500);
}

function methodNotAllowed(): Response {
  return jsonResponse({ success: false, error: "Method not allowed" }, 405);
}
