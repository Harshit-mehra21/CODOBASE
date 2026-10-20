import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/friends
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const friends = await db.friendship.findMany(user.id);
    return NextResponse.json({ success: true, friends });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch friends" }, { status: 500 });
  }
}

// POST /api/friends - Add / Remove friend
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId, action } = await req.json();
    if (!targetUserId) {
      return NextResponse.json({ error: "Target user ID required" }, { status: 400 });
    }

    if (action === "remove") {
      await db.friendship.remove(user, targetUserId);
      return NextResponse.json({ success: true, action: "removed" });
    }

    const friendship = await db.friendship.add(user, targetUserId);
    return NextResponse.json({ success: true, friendship, action: "added" });
  } catch (error: any) {
    console.error("Friend action error:", error);
    return NextResponse.json({ error: error.message || "Failed to manage friendship" }, { status: 500 });
  }
}
