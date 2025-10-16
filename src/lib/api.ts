export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  "https://lead-capture.hazelsbrand211.workers.dev"; // ✅ default to your Worker URL

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // ✅ Get JWT token from localStorage if available
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Build headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // ✅ Send request
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // ✅ If unauthorized → clear session + redirect
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized — please log in again");
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Invalid JSON response from ${endpoint}`);
  }

  // ✅ Error handling
  if (!res.ok) {
    const message =
      typeof json === "object" && json?.error
        ? json.error
        : `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return json as T;
}
