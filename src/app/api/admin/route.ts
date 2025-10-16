import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = "https://lead-capture.hazelsbrand211.workers.dev/api/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let role = searchParams.get("role");
    const userId = searchParams.get("user_id");

    if (!role) {
      console.warn("No role provided in query — defaulting to admin");
      role = "admin";
    }

    // ✅ Extract JWT token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.error("❌ No token found in cookies");
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 });
    }

    // ✅ Add role & user_id query params
    const workerUrl = new URL(WORKER_URL);
    workerUrl.searchParams.set("role", role);
    if (userId) workerUrl.searchParams.set("user_id", userId);

    // ✅ Forward request to Worker
    const response = await fetch(workerUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ← Forward token
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Worker error: ${text}`);
    }

    const data = await response.json();

    if (!data || typeof data !== "object" || !("leads" in data)) {
      throw new Error("Invalid response: missing leads data");
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error fetching leads:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
