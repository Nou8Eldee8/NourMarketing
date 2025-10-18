import { Env, Lead, Client, User} from "./types";
import { signJWT } from "./jwt";
import { requireAuth } from "./auth";
import { SignJWT } from "jose";

/* ========================================================================
   ✅ Utility functions
   ======================================================================== */
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function handleError(err: unknown, message = "Server Error"): Response {
  console.error(message, err);
  return jsonResponse({ success: false, error: message }, 500);
}
interface UserPayload extends SignJWT {
  id: number;
  role: string;
}
/* ========================================================================
   🧠 LOGIN HANDLER
   ======================================================================== */
export async function handleLogin(req: Request, env: Env): Promise<Response> {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      username?: string;
      password?: string;
    };

    if (!body.username || !body.password) {
      return jsonResponse({ success: false, error: "Missing credentials" }, 400);
    }

    type DBUser = { id: number; username: string; role: string; password: string };

    let userRecord: DBUser | null =
      (await env.DB.prepare(
        "SELECT id, username, role, password FROM users WHERE username = ?"
      )
        .bind(body.username)
        .first<DBUser>()) || null;

    if (!userRecord && env.OPS_DB) {
      userRecord =
        (await env.OPS_DB.prepare(
          "SELECT id, username, ops_role AS role, password FROM users WHERE username = ?"
        )
          .bind(body.username)
          .first<DBUser>()) || null;
    }

    if (!userRecord)
      return jsonResponse({ success: false, error: "User not found" }, 404);

    if (userRecord.password.trim() !== body.password.trim())
      return jsonResponse({ success: false, error: "Invalid credentials" }, 401);

    const { password: _pw, ...user } = userRecord;

    const token = await signJWT(user);

    return jsonResponse({
      success: true,
      data: { user, token },
    });
  } catch (err) {
    return handleError(err, "Login error");
  }
}
/* ========================================================================
   📋 LEADS HANDLER
   ======================================================================== */
export async function handleLeads(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);

    // -----------------------------
    // Auth for regular dashboard use
    // -----------------------------
    const auth = await requireAuth(req);
    const user = auth.user as UserPayload | undefined; // TS-safe cast

    switch (req.method) {
      /* --------------------------------------------------------------------
         GET → list all leads (admin or assigned to user)
         Requires auth
      -------------------------------------------------------------------- */
      case "GET": {
        if (!auth.authorized || !user) return auth.response!;

        const result =
          user.role === "admin"
            ? await env.DB.prepare("SELECT * FROM leads ORDER BY created_at DESC").all<Lead>()
            : await env.DB
                .prepare("SELECT * FROM leads WHERE assigned_to = ? ORDER BY created_at DESC")
                .bind(user.id)
                .all<Lead>();

        return jsonResponse({ success: true, data: result.results });
      }
/* --------------------------------------------------------------------
   POST → create lead
   Can be used by contact form (no auth required)
-------------------------------------------------------------------- */
case "POST": {
  const data = (await req.json()) as Partial<Lead>;

  // ✅ Validate required fields
  if (!data.id || !data.business_name || !data.name || !data.phone) {
    return jsonResponse({ success: false, error: "Missing required fields" }, 400);
  }

  let assignedTo: number | null = null;

  if (user?.id) {
    // 🔒 If request has authenticated user, assign directly to them
    assignedTo = user.id;
  } else {
    // ⚙️ Otherwise, assign automatically via round robin
    const salesUsersResult = await env.DB.prepare(
      `SELECT id FROM users WHERE role = 'sales' ORDER BY id ASC`
    ).all();

    const salesUsers = (salesUsersResult.results ?? []) as { id: number }[];

    if (salesUsers.length > 0) {
      // 🕐 Get the last assigned sales user
      const lastLeadResult = (await env.DB.prepare(
        `SELECT assigned_to FROM leads 
         WHERE assigned_to IS NOT NULL 
         ORDER BY created_at DESC 
         LIMIT 1`
      ).first()) as { assigned_to?: number } | null;

      let nextIndex = 0;
      if (lastLeadResult?.assigned_to) {
        const lastIndex = salesUsers.findIndex(
          (u) => u.id === Number(lastLeadResult.assigned_to)
        );
        nextIndex = (lastIndex + 1) % salesUsers.length;
      }

      assignedTo = salesUsers[nextIndex]?.id ?? null;
    } else {
      // 🧩 Fallback to admin if no sales users exist
      const adminResult = (await env.DB.prepare(
        `SELECT id FROM users WHERE role = 'admin' LIMIT 1`
      ).first()) as { id?: number } | null;

      assignedTo = adminResult?.id ?? null;
    }
  }

  // 💾 Insert lead into database
  await env.DB.prepare(
    `INSERT INTO leads (
        id, business_name, name, email, phone, government, budget, has_website,
        message, assigned_to, status
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      data.id,
      data.business_name,
      data.name,
      data.email ?? "",
      data.phone,
      data.government ?? "",
      data.budget ?? "",
      data.has_website ?? 0,
      data.message ?? "",
      assignedTo,
      data.status ?? "Not Contacted"
    )
    .run();

  return jsonResponse({
    success: true,
    assigned_to: assignedTo,
  });
}

      /* --------------------------------------------------------------------
         PUT → update lead
         Requires auth
      -------------------------------------------------------------------- */
      case "PUT": {
        if (!auth.authorized || !user) return auth.response!;

        const data = (await req.json()) as Partial<Lead>;
        if (!data.id) return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.DB.prepare(
          `UPDATE leads SET 
             business_name=?, name=?, email=?, phone=?, government=?, budget=?, 
             has_website=?, message=?, assigned_to=?, status=? WHERE id=?`
        )
          .bind(
            data.business_name ?? "",
            data.name ?? "",
            data.email ?? "",
            data.phone ?? "",
            data.government ?? "",
            data.budget ?? "",
            data.has_website ?? 0,
            data.message ?? "",
            data.assigned_to ?? user.id,
            data.status ?? "First Call",
            data.id
          )
          .run();

        return jsonResponse({ success: true });
      }

      /* --------------------------------------------------------------------
         DELETE → remove lead
         Requires auth
      -------------------------------------------------------------------- */
      case "DELETE": {
        if (!auth.authorized || !user) return auth.response!;

        const id = url.searchParams.get("id");
        if (!id) return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(id).run();
        return jsonResponse({ success: true });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    return handleError(err, "Lead handler error");
  }
}

/* ========================================================================
   🗒 NOTES HANDLER
   ======================================================================== */
export async function handleNotes(req: Request, env: Env): Promise<Response> {
  try {
    const auth = await requireAuth(req);
    if (!auth.authorized) return auth.response!;

    const url = new URL(req.url);

    switch (req.method) {
      case "GET": {
        const leadId = url.searchParams.get("lead_id");
        if (!leadId) return jsonResponse({ success: false, error: "Missing lead_id" }, 400);

        const result = await env.DB.prepare(
          "SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC"
        )
          .bind(leadId)
          .all();

        return jsonResponse({ success: true, data: result.results });
      }

      case "POST": {
        const data = (await req.json()) as { lead_id?: string; content?: string };
        if (!data.lead_id || !data.content)
          return jsonResponse({ success: false, error: "Missing fields" }, 400);

        await env.DB.prepare(
          "INSERT INTO notes (lead_id, content, created_at) VALUES (?, ?, datetime('now'))"
        )
          .bind(data.lead_id, data.content)
          .run();

        return jsonResponse({ success: true });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    return handleError(err, "Notes handler error");
  }
}

/* ========================================================================
   👥 USERS HANDLER
   ======================================================================== */
export async function handleUsers(req: Request, env: Env): Promise<Response> {
  try {
    const auth = await requireAuth(req, ["admin"]);
    if (!auth.authorized) return auth.response!;

    switch (req.method) {
      case "GET": {
        const result = await env.DB.prepare(
          "SELECT id, username, role FROM users"
        ).all<User>();
        return jsonResponse({ success: true, data: result.results });
      }

      case "POST": {
        const data = (await req.json()) as { username?: string; password?: string; role?: string };
        if (!data.username || !data.password || !data.role)
          return jsonResponse({ success: false, error: "Missing fields" }, 400);

        await env.DB.prepare(
          "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"
        )
          .bind(data.username, data.password, data.role)
          .run();
        return jsonResponse({ success: true });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    return handleError(err, "Users handler error");
  }
}

/* ========================================================================
   🧾 CLIENTS HANDLER (Stable + Safe Sorting + Assigned Creator + Script Counts)
   ======================================================================== */
export async function handleClients(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);

    switch (req.method) {
      /* --------------------------------------------------------------------
         🟢 GET → fetch assigned clients with approved scripts count
      -------------------------------------------------------------------- */
      case "GET": {
        try {
          const creatorId = url.searchParams.get("creator_id");
          if (!creatorId) {
            return jsonResponse({ success: false, error: "Missing creator_id" }, 400);
          }

          const query = `
            SELECT 
              c.*,
              COALESCE(SUM(CASE WHEN s.status='Approved' AND s.content_type='Post' THEN 1 ELSE 0 END), 0) AS approved_posts,
              COALESCE(SUM(CASE WHEN s.status='Approved' AND s.content_type='Video' THEN 1 ELSE 0 END), 0) AS approved_videos
            FROM clients c
            INNER JOIN client_creators cc ON cc.client_id = c.id
            LEFT JOIN scripts s ON s.client_id = c.id AND s.creator_id = cc.creator_id
            WHERE cc.creator_id = ?
            GROUP BY c.id
            ORDER BY COALESCE(NULLIF(c.start_date, ''), '1970-01-01') DESC
          `;

          const result = await env.OPS_DB.prepare(query).bind(creatorId).all<Client & {
            approved_posts: number;
            approved_videos: number;
          }>();

          return jsonResponse({ success: true, data: result.results });
        } catch (e) {
          return jsonResponse({ success: false, error: String(e) }, 500);
        }
      }

/* --------------------------------------------------------------------
   🟡 POST → add new client + optionally assign to creators
-------------------------------------------------------------------- */
case "POST": {
  const data = (await req.json()) as Client & { assigned_creators?: number[] };

  const insert = await env.OPS_DB.prepare(
    `INSERT INTO clients (name, industry, start_date, notes, status, videos_in_contract, posts_in_contract)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      data.name ?? "",
      data.industry ?? "",
      data.start_date ?? "",
      data.notes ?? "",
      data.status ?? "Active",
      data.videos_in_contract ?? 0,
      data.posts_in_contract ?? 0
    )
    .run();

  // Get inserted client ID
  const clientId = Number((insert as any).lastInsertRowid || (insert.meta?.last_row_id ?? 0));

  // Assign creators if provided
  if (data.assigned_creators?.length) {
    const stmt = await env.OPS_DB.prepare(
      `INSERT INTO client_creators (client_id, creator_id) VALUES (?, ?)`
    );
    for (const creatorId of data.assigned_creators) {
      await stmt.bind(clientId, creatorId).run();
    }
  }

  return jsonResponse({ success: true, client_id: clientId });
}


      /* --------------------------------------------------------------------
         🟠 PUT → update existing client
      -------------------------------------------------------------------- */
      case "PUT": {
        const data = (await req.json()) as Partial<Client> & { assigned_creators?: number[] };
        if (!data.id)
          return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.OPS_DB.prepare(
          `UPDATE clients 
           SET name=?, industry=?, start_date=?, notes=?, status=?, 
               videos_in_contract=?, posts_in_contract=? 
           WHERE id=?`
        )
          .bind(
            data.name ?? "",
            data.industry ?? "",
            data.start_date ?? "",
            data.notes ?? "",
            data.status ?? "Active",
            data.videos_in_contract ?? 0,
            data.posts_in_contract ?? 0,
            data.id
          )
          .run();

        // Update assigned creators if provided
        if (data.assigned_creators) {
          // Remove old assignments
          await env.OPS_DB.prepare(`DELETE FROM client_creators WHERE client_id=?`).bind(data.id).run();
          // Insert new assignments
          const stmt = await env.OPS_DB.prepare(
            `INSERT INTO client_creators (client_id, creator_id) VALUES (?, ?)`
          );
          for (const creatorId of data.assigned_creators) {
            await stmt.bind(data.id, creatorId).run();
          }
        }

        return jsonResponse({ success: true });
      }

      /* --------------------------------------------------------------------
         🔴 DELETE → delete client by ID
      -------------------------------------------------------------------- */
      case "DELETE": {
        const id = url.searchParams.get("id");
        if (!id)
          return jsonResponse({ success: false, error: "Missing id" }, 400);

        // Remove assigned creators first to prevent FK issues
        await env.OPS_DB.prepare(`DELETE FROM client_creators WHERE client_id=?`).bind(id).run();
        await env.OPS_DB.prepare("DELETE FROM clients WHERE id = ?").bind(id).run();

        return jsonResponse({ success: true });
      }

      /* --------------------------------------------------------------------
         ⚪ Default → invalid method
      -------------------------------------------------------------------- */
      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    return handleError(err, "Clients handler error");
  }
}

/* ========================================================================
   📢 POSTS HANDLER (uses `publishes` table — fixed to match schema)
   ======================================================================== */
export async function handlePosts(req: Request, env: Env): Promise<Response> {
  try {
    const auth = await requireAuth(req);
    if (!auth.authorized) return auth.response!;

    const url = new URL(req.url);

    switch (req.method) {
      /* --------------------------------------------------------------------
         🟢 GET → fetch publishes (optionally filter by client_id)
      -------------------------------------------------------------------- */
      case "GET": {
        try {
          const clientId = url.searchParams.get("client_id");
          const query = clientId
            ? `SELECT * FROM publishes WHERE client_id = ? ORDER BY publish_date DESC`
            : `SELECT * FROM publishes ORDER BY publish_date DESC`;

          const result = clientId
            ? await env.OPS_DB.prepare(query).bind(clientId).all()
            : await env.OPS_DB.prepare(query).all();

          return jsonResponse({ success: true, data: result.results });
        } catch (e) {
          return jsonResponse({ success: false, error: String(e) }, 500);
        }
      }

      /* --------------------------------------------------------------------
         🟡 POST → add a new publish record
      -------------------------------------------------------------------- */
      case "POST": {
        const data = (await req.json()) as {
          client_id?: number;
          edit_id?: number;
          content_type?: "Video" | "Post";
          platform?: string;
          publish_date?: string;
          link?: string;
          posted_by?: number;
        };

        if (
          !data.client_id ||
          !data.edit_id ||
          !data.content_type ||
          !data.platform
        ) {
          return jsonResponse({ success: false, error: "Missing required fields" }, 400);
        }

        await env.OPS_DB.prepare(
          `INSERT INTO publishes 
            (client_id, edit_id, content_type, platform, publish_date, link, posted_by)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            data.client_id,
            data.edit_id,
            data.content_type,
            data.platform,
            data.publish_date ?? null,
            data.link ?? null,
            data.posted_by ?? null
          )
          .run();

        return jsonResponse({ success: true });
      }

      /* --------------------------------------------------------------------
         🟠 PUT → update a publish record
      -------------------------------------------------------------------- */
      case "PUT": {
        const data = (await req.json()) as {
          id?: number;
          platform?: string;
          publish_date?: string;
          link?: string;
          posted_by?: number;
        };

        if (!data.id)
          return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.OPS_DB.prepare(
          `UPDATE publishes 
             SET platform = COALESCE(?, platform),
                 publish_date = COALESCE(?, publish_date),
                 link = COALESCE(?, link),
                 posted_by = COALESCE(?, posted_by)
           WHERE id = ?`
        )
          .bind(
            data.platform ?? null,
            data.publish_date ?? null,
            data.link ?? null,
            data.posted_by ?? null,
            data.id
          )
          .run();

        return jsonResponse({ success: true });
      }

      /* --------------------------------------------------------------------
         🔴 DELETE → delete a publish by ID
      -------------------------------------------------------------------- */
      case "DELETE": {
        const id = url.searchParams.get("id");
        if (!id)
          return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.OPS_DB.prepare(`DELETE FROM publishes WHERE id = ?`)
          .bind(id)
          .run();

        return jsonResponse({ success: true });
      }

      /* --------------------------------------------------------------------
         ⚪ Default → invalid method
      -------------------------------------------------------------------- */
      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    return handleError(err, "Posts handler error");
  }
}


/* ========================================================================
   🧑‍💼 ADMIN HANDLER
   ======================================================================== */
export async function handleAdmin(req: Request, env: Env): Promise<Response> {
  try {
    // ✅ Reuse authentication
    const auth = await requireAuth(req);
    if (!auth.authorized) return auth.response!;
    const user = auth.user!;

    // ✅ Allow only admin role
    if (user.role !== "admin") {
      return jsonResponse({ success: false, error: "Unauthorized" }, 403);
    }

    // ✅ Return leads + clients overview
    const leads = await env.DB.prepare(
      "SELECT * FROM leads ORDER BY created_at DESC"
    ).all();

    const clients = await env.DB.prepare(
      "SELECT * FROM clients ORDER BY start_date DESC"
    ).all();

    const users = await env.DB.prepare(
      "SELECT id, username, role FROM users"
    ).all();

    return jsonResponse({
      success: true,
      leads: leads.results ?? [],
      clients: clients.results ?? [],
      users: users.results ?? [],
    });
  } catch (err) {
    console.error("Admin handler error:", err);
    return jsonResponse(
      { success: false, error: "Admin handler failed" },
      500
    );
  }
}

/* ========================================================================
   📝 SCRIPTS HANDLER
   ======================================================================== */
export interface Script {
  id: number;
  client_id: number;
  creator_id: number;
  title: string;
  script_text?: string;
  status: "Draft" | "Approved" | "Rejected" | "Used";
  date_created: string;
  date_approved?: string;
}

export interface ScriptPayload {
  id?: number;
  client_id?: number;
  creator_id?: number;
  title?: string;
  script_text?: string;
  status?: "Draft" | "Approved" | "Rejected" | "Used";
}

/* ========================================================================
   📝 SCRIPTS HANDLER
   ======================================================================== */
export async function handleScripts(request: Request, env: Env): Promise<Response> {
  const db = env.OPS_DB; // ✅ Use OPS_DB instead of default DB
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const client_id = url.searchParams.get("client_id");

  try {
    switch (request.method) {
      /* --------------------------------------------------------------------
         🟢 GET → All scripts or by client_id / id
      -------------------------------------------------------------------- */
      case "GET": {
        if (id) {
          const script: Script | null = await db
            .prepare(`SELECT * FROM scripts WHERE id = ?`)
            .bind(id)
            .first();
          return jsonResponse({ success: true, script });
        }

        if (client_id) {
          const scripts: { results: Script[] } = await db
            .prepare(
              `SELECT * FROM scripts WHERE client_id = ? ORDER BY date_created DESC`
            )
            .bind(client_id)
            .all();
          return jsonResponse({ success: true, scripts: scripts.results });
        }

        const all: { results: Script[] } = await db
          .prepare(`SELECT * FROM scripts ORDER BY date_created DESC`)
          .all();
        return jsonResponse({ success: true, scripts: all.results });
      }

      /* --------------------------------------------------------------------
         🟡 POST → Create a new script
      -------------------------------------------------------------------- */
      case "POST": {
        const data = (await request.json()) as ScriptPayload;
        const { client_id, creator_id, title, script_text } = data;

        if (!client_id || !creator_id || !title) {
          return jsonResponse({ success: false, error: "Missing required fields." }, 400);
        }

        await db
          .prepare(
            `INSERT INTO scripts (client_id, creator_id, title, script_text) VALUES (?, ?, ?, ?)`
          )
          .bind(client_id, creator_id, title, script_text ?? "")
          .run();

        return jsonResponse({ success: true, message: "Script created successfully" });
      }

  /* --------------------------------------------------------------------
   🟠 PUT → Update title, script_text, or status
-------------------------------------------------------------------- */
case "PUT": {
  const data = (await request.json()) as ScriptPayload;
  const { id, title, script_text, status } = data;

  if (!id) {
    return jsonResponse({ success: false, error: "Missing script id" }, 400);
  }

  // Build dynamic updates
  const updates: string[] = [];
  const values: any[] = [];

  if (title !== undefined) {
    updates.push("title = ?");
    values.push(title);
  }
  if (script_text !== undefined) {
    updates.push("script_text = ?");
    values.push(script_text);
  }
  if (status !== undefined) {
    updates.push("status = ?");
    values.push(status);
  }

  if (updates.length === 0) {
    return jsonResponse({ success: false, error: "No fields to update" }, 400);
  }

  // Add id for WHERE clause
  values.push(id);

  await db
    .prepare(`UPDATE scripts SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return jsonResponse({ success: true, message: "Script updated successfully" });
}
/* --------------------------------------------------------------------
   🔴 DELETE → Remove script
-------------------------------------------------------------------- */
case "DELETE": {
  let id: number | null = null;

  // Try to read from JSON body
  try {
    const data = (await request.json()) as { id?: number };
    if (data?.id) id = data.id;
  } catch {
    // Ignore errors if body is empty or invalid
  }

  // Fallback to query parameter
  if (!id) {
    const urlId = url.searchParams.get("id");
    if (urlId) id = Number(urlId);
  }

  if (!id) {
    return jsonResponse({ success: false, error: "Missing script id" }, 400);
  }

  await db.prepare(`DELETE FROM scripts WHERE id = ?`).bind(id).run();
  return jsonResponse({ success: true, message: "Script deleted successfully" });
}


      /* --------------------------------------------------------------------
         ⚪ Default → invalid method
      -------------------------------------------------------------------- */
      default:
        return jsonResponse({ success: false, error: "Unsupported method" }, 405);
    }
  } catch (err: any) {
    return jsonResponse({ success: false, error: err.toString() }, 500);
  }
}
