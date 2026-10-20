import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const files = await db.projectFile.findMany({ where: { roomId: id } });
    return NextResponse.json({ success: true, files });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch files" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roomId } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in to save files" }, { status: 401 });
    }

    const { path, name, content, language } = await req.json();

    if (!path || content === undefined) {
      return NextResponse.json({ error: "Path and content are required" }, { status: 400 });
    }

    const room = await db.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Role-Based Access Control: Room owner or Developer can commit changes
    const isOwner = room.createdById === user.id;
    const isDeveloper = user.role === "DEVELOPER";

    if (!isOwner && !isDeveloper && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Read-Only Mode: Only the room creator or platform developer can commit code changes." },
        { status: 403 }
      );
    }

    const file = await db.projectFile.upsert({
      user,
      roomId,
      path,
      name,
      content,
      language,
    });

    return NextResponse.json({ success: true, file });
  } catch (error: any) {
    console.error("Save file error:", error);
    return NextResponse.json({ error: error.message || "Failed to save file" }, { status: 500 });
  }
}
