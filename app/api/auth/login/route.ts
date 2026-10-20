import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email is on the permanent ban blacklist
    const isEmailBanned = await db.moderation.isEmailBanned(cleanEmail);
    if (isEmailBanned) {
      return NextResponse.json(
        { error: "Your account and email address have been permanently banned from CodeBase due to repeated policy violations." },
        { status: 403 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.status === "BANNED") {
      return NextResponse.json(
        { error: "Your account has been permanently banned from CodeBase due to repeated policy violations." },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Update lastActiveAt
    const now = new Date().toISOString();
    await db.user.update({
      where: { id: user.id },
      data: { lastActiveAt: now },
    });

    // Record login audit event
    await db.auditLog.create({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      actionType: "USER_LOGGED_IN",
      entityType: "USER",
      entityId: user.id,
      description: `${user.name} logged into CodeBase platform.`,
      timestamp: now,
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Failed to log in" }, { status: 500 });
  }
}
