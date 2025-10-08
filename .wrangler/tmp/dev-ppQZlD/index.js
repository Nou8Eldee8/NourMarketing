var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// lead-capture/src/handlers.ts
async function handleLogin(req, env) {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || !("username" in body) || !("password" in body)) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { username, password } = body;
    const result = await env.DB.prepare(
      "SELECT * FROM users WHERE username = ? AND password = ?"
    ).bind(username, password).first();
    if (!result) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ user: result }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleLogin, "handleLogin");
async function handleLeads(req, env) {
  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const userId = url.searchParams.get("user_id");
      const role = url.searchParams.get("role");
      let leads;
      if (role === "admin") {
        leads = await env.DB.prepare("SELECT * FROM leads").all().then((r) => r.results);
      } else if (role === "sales" && userId) {
        leads = await env.DB.prepare("SELECT * FROM leads WHERE assigned_to = ?").bind(userId).all().then((r) => r.results);
      } else {
        leads = [];
      }
      return new Response(JSON.stringify({ leads }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (req.method === "POST") {
      const data = await req.json();
      if (!data || typeof data !== "object" || !("business_name" in data)) {
        return new Response(JSON.stringify({ error: "Invalid lead data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      const lead = data;
      const sales = await env.DB.prepare("SELECT id FROM users WHERE role = 'sales'").all().then((r) => r.results);
      if (!sales.length) {
        return new Response(JSON.stringify({ error: "No salespeople found" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      const lastAssigned = await env.DB.prepare(
        "SELECT assigned_to FROM leads ORDER BY id DESC LIMIT 1"
      ).first();
      const nextIndex = lastAssigned ? (sales.findIndex((s) => s.id === lastAssigned.assigned_to) + 1) % sales.length : 0;
      const assignedTo = sales[nextIndex].id;
      await env.DB.prepare(
        `INSERT INTO leads (lead_id, business_name, name, email, phone, government, budget, has_website, message, assigned_to, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
      ).bind(
        crypto.randomUUID(),
        lead.business_name,
        lead.name || "",
        lead.email || "",
        lead.phone || "",
        lead.government || "",
        lead.budget || 0,
        lead.has_website ? 1 : 0,
        lead.message || "",
        assignedTo
      ).run();
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ error: "Invalid method" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Lead handler error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleLeads, "handleLeads");

// lead-capture/src/index.ts
var src_default = {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const { pathname } = url;
      if (pathname === "/api/login" && request.method === "POST") {
        return await handleLogin(request, env);
      }
      if (pathname === "/api/admin" && request.method === "GET") {
        return await handleLeads(request, env);
      }
      if (pathname === "/api/lead" && request.method === "POST") {
        return await handleLeads(request, env);
      }
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

// C:/Users/Nour/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/Nour/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-fLJPQn/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// C:/Users/Nour/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-fLJPQn/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
