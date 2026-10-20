import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const users = await db.user.findMany();
    // Exclude password hashes
    const sanitized = users.map((u) => {
      const { passwordHash, ...rest } = u;
      return rest;
    });
    return NextResponse.json({ success: true, users: sanitized });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load users" }, { status: 500 });
  }
}
