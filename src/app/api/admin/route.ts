import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = "https://lead-capture.hazelsbrand211.workers.dev/api/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let role = searchParams.get("role");
    const userId = searchParams.get("user_id");

    // ✅ Default to "admin" if not provided
    if (!role) {
      console.warn("No role provided in query — defaulting to admin");
      role = "admin";
    }

    // ✅ Always include role and user_id in the request to the Worker
    const workerUrl = new URL(WORKER_URL);
    workerUrl.searchParams.set("role", role);
    if (userId) workerUrl.searchParams.set("user_id", userId);

    const response = await fetch(workerUrl.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Worker error: ${text}`);
    }

    const data = await response.json();

    if (
      !data ||
      typeof data !== "object" ||
      !("leads" in data) ||
      !Array.isArray((data as any).leads)
    ) {
      throw new Error("Invalid response: leads not an array");
    }

    return NextResponse.json((data as any).leads);
  } catch (err: any) {
    console.error("Error fetching leads:", err);
    return NextResponse.json(
      { error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
