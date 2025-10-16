// auth.ts
import { getUserFromToken } from "./jwt";

export async function requireAuth(req: Request, allowedRoles?: string[]) {
  const user = await getUserFromToken(req);
  if (!user) {
    return {
      authorized: false,
      response: new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  if (allowedRoles && !allowedRoles.includes(user.role as string)) {
    return {
      authorized: false,
      response: new Response(JSON.stringify({ success: false, error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  return { authorized: true, user };
}
