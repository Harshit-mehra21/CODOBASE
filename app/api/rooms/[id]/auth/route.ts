import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const { password } = await req.json();

    const room = await db.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // If user is the creator of the room, grant access automatically
    if (room.createdById === user.id) {
      return NextResponse.json({ success: true, authorized: true, role: "owner" });
    }

    // Verify room password
    const isMatch = await db.room.verifyPassword(roomId, password || "");
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Incorrect room password. Click 'Forgot Password' to receive it on your registered email." },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, authorized: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 });
  }
}
