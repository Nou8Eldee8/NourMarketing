import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const WORKER_URL = "https://lead-capture.hazelsbrand211.workers.dev/api/lead";

interface LeadPayload {
  id?: string;
  business_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  government?: string;
  budget?: number;
  has_website?: boolean;
  message?: string;
  status?: string;
}

async function forwardToWorker(
  method: string,
  body?: any,
  token?: string,
  role?: string,
  user_id?: string
) {
  const url = `${WORKER_URL}?role=${role ?? ""}&user_id=${user_id ?? ""}`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Worker ${method} error:`, text);
    return NextResponse.json({ success: false, error: text }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json({ success: true, data }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json();

    // ✅ Public form: generate an ID if missing
    if (!body.id) body.id = uuidv4();

    // 🔑 Check token (optional)
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") ?? "";
    const user_id = searchParams.get("user_id") ?? "";

    return forwardToWorker("POST", body, token, role, user_id);
  } catch (err: any) {
    console.error("POST /api/lead error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") ?? "";
  const user_id = searchParams.get("user_id") ?? "";
  return forwardToWorker("GET", undefined, token, role, user_id);
}

export async function PUT(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json();
    const token = req.cookies.get("token")?.value;
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") ?? "";
    const user_id = searchParams.get("user_id") ?? "";
    return forwardToWorker("PUT", body, token, role, user_id);
  } catch (err: any) {
    console.error("PUT /api/lead error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
