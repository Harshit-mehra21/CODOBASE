import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const room = await db.room.findUnique({ where: { id } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, room });
  } catch (error: any) {
    console.error("Get room error:", error);
    return NextResponse.json({ error: error.message || "Failed to load room" }, { status: 500 });
  }
}

// POST /api/rooms/[id] - Join Room with strict 20 user max cap
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to enter the room" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const { subRoomId } = await req.json().catch(() => ({ subRoomId: undefined }));

    const member = await db.room.join(roomId, user, subRoomId);
    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    console.error("Join room error:", error);
    return NextResponse.json({ error: error.message || "Failed to join room" }, { status: 403 });
  }
}
