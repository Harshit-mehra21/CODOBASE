import { NextResponse } from "next/server";
import { getCurrentUser, SESSION_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const friends = await db.friendship.findMany(user.id);
    const recentAuditLogs = await db.auditLog.findMany({
      where: { limit: 15 },
    });

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        friends,
        recentAuditLogs,
      },
    });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
