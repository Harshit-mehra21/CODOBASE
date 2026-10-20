import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to view room history" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const room = await db.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const auditLogs = await db.auditLog.findMany({
      where: { roomId, limit: 100 },
    });

    return NextResponse.json({
      success: true,
      roomId,
      roomName: room.name,
      version: room.version,
      history: auditLogs,
    });
  } catch (error: any) {
    console.error("Room history error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch room history" }, { status: 500 });
  }
}
