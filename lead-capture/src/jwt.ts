// jwt.ts
import { SignJWT, jwtVerify } from "jose";

const ADMIN_SECRET = new TextEncoder().encode("super-secure-admin-secret");
const GENERAL_SECRET = new TextEncoder().encode("general-secret");
const EXPIRES_IN = "24h";

export async function signJWT(payload: Record<string, unknown>): Promise<string> {
  const secret = payload.role === "admin" ? ADMIN_SECRET : GENERAL_SECRET;

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(secret);
}

export async function verifyJWT(token: string) {
  try {
    try {
      const { payload } = await jwtVerify(token, ADMIN_SECRET);
      return { valid: true, payload };
    } catch {
      const { payload } = await jwtVerify(token, GENERAL_SECRET);
      return { valid: true, payload };
    }
  } catch (err) {
    return { valid: false, error: (err as Error).message };
  }
}

export async function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  const { valid, payload } = await verifyJWT(token);
  return valid ? payload : null;
}
