import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/rooms/[id]/objects
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roomId } = await params;
    const objects = await db.roomObject.findMany(roomId);
    return NextResponse.json({ success: true, objects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load objects" }, { status: 500 });
  }
}

// POST /api/rooms/[id]/objects - Create or Move object
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const { action, objectId, type, name, position, state } = await req.json();

    if (action === "move" && objectId && position) {
      const updated = await db.roomObject.move({
        objectId,
        user,
        position,
      });
      return NextResponse.json({ success: true, object: updated });
    }

    if (action === "delete" && objectId) {
      await db.roomObject.delete({
        objectId,
        user,
      });
      return NextResponse.json({ success: true });
    }

    if (!type || !name || !position) {
      return NextResponse.json({ error: "Type, name, and position are required" }, { status: 400 });
    }

    const newObj = await db.roomObject.create({
      roomId,
      user,
      type,
      name,
      position,
      state,
    });

    return NextResponse.json({ success: true, object: newObj });
  } catch (error: any) {
    console.error("Room object action error:", error);
    return NextResponse.json({ error: error.message || "Failed to process object" }, { status: 500 });
  }
}
