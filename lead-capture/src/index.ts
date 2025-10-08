export interface Env {
  DB: D1Database;
}

interface Lead {
  business_name: string;
  government?: string;
  budget?: number;
  has_website?: boolean;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = (await request.json()) as Lead;

    const { business_name, government, budget, has_website } = body;

    if (!business_name) {
      return new Response("Missing business_name", { status: 400 });
    }

    try {
      await env.DB.prepare(
        `INSERT INTO leads (business_name, government, budget, has_website) VALUES (?, ?, ?, ?)`
      )
        .bind(business_name, government, budget, has_website)
        .run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Database Error:", err);
      return new Response("Database Error", { status: 500 });
    }
  },
};
