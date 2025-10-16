import { NextRequest, NextResponse } from "next/server";

const WORKER_URL = "https://lead-capture.hazelsbrand211.workers.dev/api/login";

interface LoginBody {
  username: string;
  password: string;
}

interface WorkerResponse {
  success: boolean;
  data?: {
    user: any;
    token: string;
  };
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

    let result: WorkerResponse;
    try {
      result = (await response.json()) as WorkerResponse;
    } catch {
      result = { success: false, error: "Invalid response from worker" };
    }

    // If login fails, return early
    if (!result.success || !result.data?.token) {
      return NextResponse.json(result, { status: 401 });
    }

    // ✅ Create response and attach token cookie
    const res = NextResponse.json(result, { status: 200 });

    res.cookies.set({
      name: "token",
      value: result.data.token,
      httpOnly: true, // prevent access from JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error("Login handler error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
