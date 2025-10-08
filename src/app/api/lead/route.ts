import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = "https://lead-capture.hazelsbrand211.workers.dev/api/lead";

interface LeadPayload {
  business_name: string;
  name?: string;
  email?: string;
  phone?: string;
  government?: string;
  budget?: number;
  has_website?: boolean;
  message?: string;
}

// ✅ POST — create a new lead
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown;

    if (
      !body ||
      typeof body !== "object" ||
      !("business_name" in body) ||
      typeof (body as any).business_name !== "string"
    ) {
      return NextResponse.json({ error: "Invalid lead data" }, { status: 400 });
    }

    const lead = body as LeadPayload;

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Worker error:", text);
      return NextResponse.json(
        { success: false, error: text },
        { status: response.status }
      );
    }

    const result = await response.json().catch(() => ({}));
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err: any) {
    console.error("API /lead POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}

// ✅ GET — fetch leads (used by admin or sales dashboards)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const user_id = searchParams.get("user_id");

    const response = await fetch(`${WORKER_URL}?role=${role}&user_id=${user_id}`);

    if (!response.ok) {
      const text = await response.text();
      console.error("Worker GET error:", text);
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("API /lead GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
