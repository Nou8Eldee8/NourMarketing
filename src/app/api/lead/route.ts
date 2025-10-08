// src/app/api/lead/route.ts

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const res = await fetch("https://lead-capture.hazelsbrand211.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Worker returned error:", err);
      return new Response(JSON.stringify({ success: false }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error forwarding to worker:", err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
