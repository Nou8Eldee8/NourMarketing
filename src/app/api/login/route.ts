import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = "https://lead-capture.hazelsbrand211.workers.dev/api/login";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object" || !("username" in body) || !("password" in body)) {
      return NextResponse.json({ success: false, error: "Missing credentials" }, { status: 400 });
    }

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json().catch(() => ({}));

    // Always forward the worker’s status
    return NextResponse.json(result, { status: response.status });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, error: err.message ?? "Unexpected error" }, { status: 500 });
  }
}
