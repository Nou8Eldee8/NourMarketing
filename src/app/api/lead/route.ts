import { NextRequest, NextResponse } from "next/server";

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
  req: NextRequest,
  method: string,
  body?: any
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") ?? "";
    const user_id = searchParams.get("user_id") ?? "";

    // 🔑 Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.error("❌ No token found in cookies");
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 });
    }

    const url = `${WORKER_URL}?role=${role}&user_id=${user_id}`;
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Send token to Worker
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Worker ${method} error:`, text);
      return NextResponse.json({ success: false, error: text }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error(`API /lead ${method} error:`, err);
    return NextResponse.json({ success: false, error: err.message ?? "Unexpected error" }, { status: 500 });
  }
}

// ----------------- GET -----------------
export async function GET(req: NextRequest) {
  return forwardToWorker(req, "GET");
}

// ----------------- POST -----------------
export async function POST(req: NextRequest) {
  const body = await req.json();
  return forwardToWorker(req, "POST", body);
}

// ----------------- PUT -----------------
export async function PUT(req: NextRequest) {
  const body = await req.json();
  return forwardToWorker(req, "PUT", body);
}
