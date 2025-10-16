export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8787"; // fallback for local dev

export async function apiFetch<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });

  // Explicitly tell TS that this is `unknown`
  const json: unknown = await res.json();

  if (!res.ok) {
    // Try to extract error info if shape matches
    const message =
      typeof json === "object" &&
      json !== null &&
      "error" in json &&
      typeof (json as any).error === "string"
        ? (json as any).error
        : `Request failed: ${res.status}`;
    throw new Error(message);
  }

  // Runtime check for correct type is up to caller
  return json as T;
}
