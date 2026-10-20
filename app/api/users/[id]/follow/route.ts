import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "You must be signed in to connect with users" }, { status: 401 });
    }

    const { id: targetUserId } = await params;
    if (user.id === targetUserId) {
      return NextResponse.json({ error: "You cannot connect with yourself" }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const existingFriends = await db.friendship.findMany(user.id);
    const isFriend = existingFriends.some((f) => f.friendId === targetUserId || f.userId === targetUserId);

    if (isFriend) {
      await db.friendship.remove(user, targetUserId);
      return NextResponse.json({ success: true, isFollowing: false });
    } else {
      await db.friendship.add(user, targetUserId);
      return NextResponse.json({ success: true, isFollowing: true });
    }
  } catch (error: any) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: error.message || "Failed to follow user" }, { status: 500 });
  }
}
