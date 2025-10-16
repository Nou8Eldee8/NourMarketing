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

        if (!data.id || !data.business_name || !data.name || !data.phone) {
          return jsonResponse({ success: false, error: "Missing required fields" }, 400);
        }

        // Assign lead: if auth exists, assign to user; else leave null or default
        const assignedTo = user?.id ?? null;

        await env.DB.prepare(
          `INSERT INTO leads 
           (id, business_name, name, email, phone, government, budget, has_website, message, assigned_to, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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

        return jsonResponse({ success: true });
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
   🧾 CLIENTS HANDLER
   ======================================================================== */
export async function handleClients(req: Request, env: Env): Promise<Response> {
  try {
    const auth = await requireAuth(req);
    if (!auth.authorized) return auth.response!;

    const url = new URL(req.url);

    switch (req.method) {
      case "GET": {
        const result = await env.DB.prepare(
          "SELECT * FROM clients ORDER BY start_date DESC"
        ).all<Client>();
        return jsonResponse({ success: true, data: result.results });
      }

      case "POST": {
        const data = (await req.json()) as Client;

        await env.DB.prepare(
          `INSERT INTO clients (name, industry, start_date, notes, status, videos_in_contract, posts_in_contract)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            data.name ?? "",
            data.industry ?? "",
            data.start_date ?? "",
            data.notes ?? "",
            data.status ?? "",
            data.videos_in_contract ?? 0,
            data.posts_in_contract ?? 0
          )
          .run();
        return jsonResponse({ success: true });
      }

      case "PUT": {
        const data = (await req.json()) as Partial<Client>;
        if (!data.id) return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.DB.prepare(
          `UPDATE clients 
             SET name=?, industry=?, start_date=?, notes=?, status=?, videos_in_contract=?, posts_in_contract=? 
             WHERE id=?`
        )
          .bind(
            data.name ?? "",
            data.industry ?? "",
            data.start_date ?? "",
            data.notes ?? "",
            data.status ?? "",
            data.videos_in_contract ?? 0,
            data.posts_in_contract ?? 0,
            data.id
          )
          .run();
        return jsonResponse({ success: true });
      }

      case "DELETE": {
        const id = url.searchParams.get("id");
        if (!id) return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.DB.prepare("DELETE FROM clients WHERE id = ?").bind(id).run();
        return jsonResponse({ success: true });
      }

      default:
        return jsonResponse({ success: false, error: "Method not allowed" }, 405);
    }
  } catch (err) {
    return handleError(err, "Clients handler error");
  }
}

/* ========================================================================
   📢 POSTS HANDLER
   ======================================================================== */
export async function handlePosts(req: Request, env: Env): Promise<Response> {
  try {
    const auth = await requireAuth(req);
    if (!auth.authorized) return auth.response!;

    const url = new URL(req.url);

    switch (req.method) {
      case "GET": {
        const result = await env.DB.prepare(
          "SELECT * FROM posts ORDER BY created_at DESC"
        ).all();
        return jsonResponse({ success: true, data: result.results });
      }

      case "POST": {
        const data = (await req.json()) as {
          client_id?: number;
          caption?: string;
          platform?: string;
          status?: string;
        };

        if (!data.client_id || !data.caption || !data.platform || !data.status)
          return jsonResponse({ success: false, error: "Missing fields" }, 400);

        await env.DB.prepare(
          "INSERT INTO posts (client_id, caption, platform, status, created_at) VALUES (?, ?, ?, ?, datetime('now'))"
        )
          .bind(data.client_id, data.caption, data.platform, data.status)
          .run();
        return jsonResponse({ success: true });
      }

      case "PUT": {
        const data = (await req.json()) as {
          id?: number;
          caption?: string;
          platform?: string;
          status?: string;
        };

        if (!data.id) return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.DB.prepare(
          "UPDATE posts SET caption=?, platform=?, status=? WHERE id=?"
        )
          .bind(data.caption ?? "", data.platform ?? "", data.status ?? "", data.id)
          .run();

        return jsonResponse({ success: true });
      }

      case "DELETE": {
        const id = url.searchParams.get("id");
        if (!id) return jsonResponse({ success: false, error: "Missing id" }, 400);

        await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
        return jsonResponse({ success: true });
      }

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
