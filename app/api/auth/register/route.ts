import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, country, bio } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email is permanently banned
    const isBanned = await db.moderation.isEmailBanned(cleanEmail);
    if (isBanned) {
      return NextResponse.json(
        { error: "This email address has been permanently blocked from CodeBase due to policy violations." },
        { status: 403 }
      );
    }

    const existing = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "An account with this email address already exists. Please sign in." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: "USER",
        status: "ACTIVE",
        country: country || "🌐 Global",
        bio: bio || "Building on CodeBase.",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
        contributionScore: 500,
      },
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
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 });
  }
}
