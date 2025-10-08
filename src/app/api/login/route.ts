import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = "https://lead-capture.hazelsbrand211.workers.dev/api/login";

interface LoginBody {
  username: string;
  password: string;
}

interface WorkerResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginBody = await req.json();

    if (!body.username || !body.password) {
      return NextResponse.json(
        { success: false, error: "Missing username or password" },
        { status: 400 }
      );
    }

    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Type assertion here
    let result: WorkerResponse;
    try {
      result = (await response.json()) as WorkerResponse;
    } catch {
      result = { success: false, error: "Invalid response from worker" };
    }

    return NextResponse.json(result, { status: response.status });
  } catch (err: any) {
    console.error("Login handler error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
