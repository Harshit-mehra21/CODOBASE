import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roomId } = await params;
    const subRooms = await db.subRoom.findMany(roomId);
    return NextResponse.json({ success: true, subRooms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load sub-rooms" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const { action, subRoomId, name, topic } = await req.json();

    // Spawn 2.0 version of an existing sub-room
    if (action === "spawn_v2" && subRoomId) {
      const newSubRoom = await db.subRoom.spawnNextVersion(subRoomId);
      if (!newSubRoom) {
        return NextResponse.json({ error: "Sub-room not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, subRoom: newSubRoom, message: `Successfully spawned ${newSubRoom.name}!` });
    }

    // Create a new sub-room with 20-member cap
    const subRoom = await db.subRoom.create({
      roomId,
      name: name || "New Track",
      topic: topic || "fullstack",
      maxMembers: 20,
      currentMembers: 1,
      version: "1.0",
    });

    return NextResponse.json({ success: true, subRoom });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to manage sub-room" }, { status: 500 });
  }
}
