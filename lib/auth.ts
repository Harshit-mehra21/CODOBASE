import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db, UserRole, UserRecord } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "codobase-super-secret-key-production-grade-2026"
);

const SESSION_COOKIE_NAME = "codobase_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: { userId: string; email: string; name: string; role: UserRole }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; name: string; role: UserRole };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserRecord | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) return null;

    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in to access this resource.");
  }
  if (user.status === "BANNED") {
    throw new Error("Account permanently banned due to community policy violations.");
  }
  return user;
}

export async function requireDeveloper() {
  const user = await requireUser();
  if (user.role !== "DEVELOPER") {
    throw new Error("Forbidden: Developer access required. Only the platform owner can modify codebase logic.");
  }
  return user;
}

export async function requireAdminOrDeveloper() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.role !== "DEVELOPER") {
    throw new Error("Forbidden: Administrator or Developer privileges required.");
  }
  return user;
}

export { SESSION_COOKIE_NAME };
