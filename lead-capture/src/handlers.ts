import { Env, Lead, Client, User } from "./types";
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
          "SELECT id, username, role, password FROM users WHERE username = ?"
        )
          .bind(body.username)
          .first<DBUser>()) || null;
    }

    if (!userRecord) {
      return jsonResponse({ success: false, error: "Invalid credentials" }, 401);
    }

    if (userRecord.password !== body.password) {
      return jsonResponse({ success: false, error: "Invalid credentials" }, 401);
    }

    const token = await signJWT(
      { userId: userRecord.id, role: userRecord.role },
      env.JWT_SECRET
    );

    return jsonResponse({
      success: true,
      data: {
        token,
        user: {
          id: userRecord.id,
          username: userRecord.username,
          role: userRecord.role,
        },
      },
    });
  } catch (err: any) {
    return handleError(err, "Login failed");
  }
}

/* ========================================================================
   👥 OPS USERS HANDLER (for OPS_DB users table)
   ======================================================================== */
export async function handleOpsUsers(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);
    const db = env.OPS_DB;

    switch (req.method) {
      case "GET": {
        const id = url.searchParams.get("id");

        if (id) {
          const user = await db
            .prepare("SELECT * FROM users WHERE id = ?")
            .bind(id)
            .first();
          return jsonResponse({ success: true, data: user });
        }

        const users = await db.prepare("SELECT * FROM users ORDER BY name").all();
        return jsonResponse({ success: true, data: users.results });
      }

      case "POST": {
        const data: any = await req.json();
        const { name, role, email, username, password, rate_per_month } = data;

        if (!name || !role || !username || !password) {
          return jsonResponse(
            { success: false, error: "Name, role, username, and password are required" },
            400
          );
        }

        const result = await db
          .prepare(
            `INSERT INTO users (name, role, email, username, password, rate_per_month) 
             VALUES (?, ?, ?, ?, ?, ?)`
          )
          .bind(name, role, email || null, username, password, rate_per_month || null)
          .run();

        return jsonResponse({ success: true, data: result });
      }

      case "PUT": {
        const data: any = await req.json();
        const { id, name, role, email, active, rate_per_month } = data;

        if (!id) {
          return jsonResponse(
            { success: false, error: "User ID is required" },
            400
          );
        }

        const result = await db
          .prepare(
            `UPDATE users 
             SET name = ?, role = ?, email = ?, active = ?, rate_per_month = ?
             WHERE id = ?`
          )
          .bind(name, role, email, active ?? 1, rate_per_month, id)
          .run();

        return jsonResponse({ success: true, data: result });
      }

      case "DELETE": {
        const id = url.searchParams.get("id");

        if (!id) {
          return jsonResponse(
            { success: false, error: "User ID is required" },
            400
          );
        }

        const result = await db
          .prepare("UPDATE users SET active = 0 WHERE id = ?")
          .bind(id)
          .run();

        return jsonResponse({ success: true, data: result });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (error: any) {
    console.error("OPS Users handler error:", error);
    return jsonResponse(
      { success: false, error: error.message || "Failed to process request" },
      500
    );
  }
}

/* ========================================================================
   🧩 CLIENT TEAM ASSIGNMENT HANDLER
   ======================================================================== */
export async function handleClientTeam(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const clientId = pathParts[pathParts.length - 2];

    switch (req.method) {
      case "GET": {
        const creators = await env.OPS_DB.prepare(
          `SELECT u.id, u.name, u.role, u.email 
           FROM users u 
           INNER JOIN client_creators cc ON u.id = cc.creator_id 
           WHERE cc.client_id = ?`
        )
          .bind(clientId)
          .all();

        const specialists = await env.OPS_DB.prepare(
          `SELECT u.id, u.name, u.role, u.email 
           FROM users u 
           INNER JOIN client_specialists cs ON u.id = cs.specialist_id 
           WHERE cs.client_id = ?`
        )
          .bind(clientId)
          .all();

        const editors = await env.OPS_DB.prepare(
          `SELECT u.id, u.name, u.role, u.email 
           FROM users u 
           INNER JOIN client_editors ce ON u.id = ce.editor_id 
           WHERE ce.client_id = ?`
        )
          .bind(clientId)
          .all();

        return jsonResponse({
          success: true,
          data: {
            creators: creators.results || [],
            specialists: specialists.results || [],
            editors: editors.results || [],
          },
        });
      }

      case "PUT": {
        const body: any = await req.json();
        const { creator_ids = [], specialist_ids = [], editor_ids = [] } = body;

        await env.OPS_DB.prepare("DELETE FROM client_creators WHERE client_id = ?")
          .bind(clientId)
          .run();
        await env.OPS_DB.prepare("DELETE FROM client_specialists WHERE client_id = ?")
          .bind(clientId)
          .run();
        await env.OPS_DB.prepare("DELETE FROM client_editors WHERE client_id = ?")
          .bind(clientId)
          .run();

        for (const creatorId of creator_ids) {
          await env.OPS_DB.prepare(
            "INSERT INTO client_creators (client_id, creator_id) VALUES (?, ?)"
          )
            .bind(clientId, creatorId)
            .run();
        }

        for (const specialistId of specialist_ids) {
          await env.OPS_DB.prepare(
            "INSERT INTO client_specialists (client_id, specialist_id) VALUES (?, ?)"
          )
            .bind(clientId, specialistId)
            .run();
        }

        for (const editorId of editor_ids) {
          await env.OPS_DB.prepare(
            "INSERT INTO client_editors (client_id, editor_id) VALUES (?, ?)"
          )
            .bind(clientId, editorId)
            .run();
        }

        return jsonResponse({ success: true });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (error: any) {
    console.error("Client Team handler error:", error);
    return jsonResponse(
      { success: false, error: error.message || "Failed to process request" },
      500
    );
  }
}

// Export placeholder functions for other handlers that may be imported
export async function handleLeads(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);
    const db = env.DB;

    switch (req.method) {
      case "GET": {
        const role = url.searchParams.get("role");
        const userId = url.searchParams.get("user_id");

        let query = "SELECT * FROM leads ORDER BY created_at DESC";
        let params: any[] = [];

        // If not admin, maybe filter? For now, let's return all for admin/manager
        // or filter by assigned_to if needed.
        // The previous request had role=admin&user_id=1, so we should return all.

        const results = await db.prepare(query).bind(...params).all();
        return jsonResponse({ success: true, data: results.results });
      }

      case "POST": {
        const data = (await req.json()) as Lead;
        // Basic validation
        if (!data.name || !data.phone) {
          return jsonResponse({ success: false, error: "Name and phone are required" }, 400);
        }

        const result = await db
          .prepare(
            `INSERT INTO leads (name, phone, email, platform, status, notes, assigned_to)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            data.name,
            data.phone,
            data.email || null,
            data.platform || "Manual",
            data.status || "New",
            data.notes || "",
            data.assigned_to || null
          )
          .run();

        return jsonResponse({ success: true, data: result });
      }

      case "PUT": {
        const data = (await req.json()) as Partial<Lead>;
        if (!data.id) {
          return jsonResponse({ success: false, error: "Lead ID is required" }, 400);
        }

        // Build dynamic update query
        const updates: string[] = [];
        const values: any[] = [];

        if (data.status) { updates.push("status = ?"); values.push(data.status); }
        if (data.assigned_to !== undefined) { updates.push("assigned_to = ?"); values.push(data.assigned_to); }
        if (data.notes) { updates.push("notes = ?"); values.push(data.notes); }

        if (updates.length === 0) {
          return jsonResponse({ success: true, message: "No changes" });
        }

        values.push(data.id);

        await db
          .prepare(`UPDATE leads SET ${updates.join(", ")} WHERE id = ?`)
          .bind(...values)
          .run();

        return jsonResponse({ success: true });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err: any) {
    return handleError(err, "Error handling leads");
  }
}

export async function handleNotes(req: Request, env: Env): Promise<Response> {
  return jsonResponse({ success: false, error: "Not implemented" }, 501);
}

export async function handleUsers(req: Request, env: Env): Promise<Response> {
  return jsonResponse({ success: false, error: "Not implemented" }, 501);
}

export async function handleClients(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);

    // Decode JWT to get user info
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const token = authHeader.substring(7);
    const { decodeJwt } = await import("jose");
    const payload: any = decodeJwt(token);

    const userId = payload.userId || payload.id || payload.sub;
    const role = payload.role || "creator";

    console.log("🔍 Decoded JWT payload:", payload);
    console.log("Detected userId:", userId, "role:", role);

    if (!userId) {
      return jsonResponse({ success: false, error: "Invalid token: missing userId" }, 401);
    }

    // Normalize role to lowercase for comparison
    const normalizedRole = role?.toLowerCase();
    const leaderRoles = ["leader", "team_leader", "admin", "manager"];
    const isLeader = leaderRoles.includes(normalizedRole);

    console.log("🎯 Normalized role:", normalizedRole, "isLeader:", isLeader);

    let query: string;
    let result;

    if (isLeader) {
      // Leader sees all clients
      query = `
        SELECT 
          c.*,
          COALESCE(SUM(CASE WHEN s.status='Approved' AND s.content_type='Post' THEN 1 ELSE 0 END), 0) AS approved_posts,
          COALESCE(SUM(CASE WHEN s.status='Approved' AND s.content_type='Video' THEN 1 ELSE 0 END), 0) AS approved_videos
        FROM clients c
        LEFT JOIN scripts s ON s.client_id = c.id
        GROUP BY c.id
        ORDER BY COALESCE(NULLIF(c.start_date, ''), '1970-01-01') DESC
      `;
      result = await env.OPS_DB.prepare(query).all();
    } else {
      // Creator sees only their assigned clients
      query = `
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
      result = await env.OPS_DB.prepare(query).bind(userId).all();
    }

    console.log("📊 Query result:", result.results?.length, "clients found");

    return jsonResponse({ success: true, data: result.results });
  } catch (e: any) {
    console.error("❌ Error fetching clients:", e);
    return jsonResponse({ success: false, error: String(e) }, 500);
  }
}

export async function handlePosts(req: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get("client_id");

    if (!clientId) {
      return jsonResponse({ success: false, error: "client_id is required" }, 400);
    }

    const result = await env.OPS_DB.prepare(
      `SELECT * FROM publishes WHERE client_id = ? ORDER BY publish_date DESC`
    )
      .bind(clientId)
      .all();

    return jsonResponse({ success: true, data: result.results || [] });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

export async function handleAdmin(req: Request, env: Env): Promise<Response> {
  return jsonResponse({ success: false, error: "Not implemented" }, 501);
}

export async function handleScripts(req: Request, env: Env): Promise<Response> {
  return jsonResponse({ success: false, error: "Not implemented" }, 501);
}
