export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://lead-capture.hazelsbrand211.workers.dev"; // ✅ default to your Worker URL

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  timeout = 15000 // ⏱️ optional timeout in ms
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // ✅ Unauthorized handling
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      throw new Error("Unauthorized — please log in again");
    }

    // ✅ Handle 204 (no content)
    if (res.status === 204) return {} as T;

    // ✅ Parse JSON safely
    let json: any;
    try {
      json = await res.json();
    } catch {
      throw new Error(`Invalid JSON response from ${endpoint}`);
    }

    // ✅ Handle errors
    if (!res.ok) {
      const error: Error & { status?: number } = new Error(
        json?.error || `Request failed with status ${res.status}`
      );
      error.status = res.status;
      throw error;
    }

    return json as T;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out — please try again");
    }
    throw err;
  }
}
