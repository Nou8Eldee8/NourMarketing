import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = "https://lead-capture.hazelsbrand211.workers.dev/api/lead";

interface LeadPayload {
  id?: string; // required for updates
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

// ----------------- GET -----------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") ?? "";
    const user_id = searchParams.get("user_id") ?? "";

    const response = await fetch(`${WORKER_URL}?role=${role}&user_id=${user_id}`);
    if (!response.ok) {
      const text = await response.text();
      console.error("Worker GET error:", text);
      return NextResponse.json({ success: false, error: text }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("API /lead GET error:", err);
    return NextResponse.json({ success: false, error: err.message ?? "Unexpected error" }, { status: 500 });
  }
}

// ----------------- POST -----------------
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadPayload;

    if (!body?.business_name) {
      return NextResponse.json({ success: false, error: "Missing business_name" }, { status: 400 });
    }

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Worker POST error:", text);
      return NextResponse.json({ success: false, error: text }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err: any) {
    console.error("API /lead POST error:", err);
    return NextResponse.json({ success: false, error: err.message ?? "Unexpected error" }, { status: 500 });
  }
}

// ----------------- PUT -----------------
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as LeadPayload;

    if (!body?.id || !body?.status) {
      return NextResponse.json({ success: false, error: "Missing lead id or status" }, { status: 400 });
    }

    const response = await fetch(WORKER_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: body.id, status: body.status }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Worker PUT error:", text);
      return NextResponse.json({ success: false, error: text }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err: any) {
    console.error("API /lead PUT error:", err);
    return NextResponse.json({ success: false, error: err.message ?? "Unexpected error" }, { status: 500 });
  }
}
