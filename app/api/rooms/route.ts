import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const query = searchParams.get("q") || undefined;

    const rooms = await db.room.findMany({
      where: {
        category,
        query,
      },
    });

    return NextResponse.json({ success: true, rooms });
  } catch (error: any) {
    console.error("Fetch rooms error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "You must be signed in to create a room" }, { status: 401 });
    }

    const { name, category, subdomain, description, password } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
    }

    const room = await db.room.create({
      data: {
        name: name.trim(),
        category: category || "coding",
        subdomain: subdomain || "General Engineering",
        description: description.trim(),
        maxMembers: 20, // strictly 20 max
        isPrivate: !!password,
        password,
        createdById: user.id,
        createdByName: user.name,
        healthScore: 88,
        flags: [user.country?.split(" ")[0] || "🇮🇳"],
        tags: ["TypeScript", "Realtime", "AI"],
      },
    });

    // Create default files in room
    const defaultCode = `// ${name} - Collaborative CodeBase Studio
// Created by ${user.name} (${user.country})

export interface RoomConfig {
  roomName: string;
  creator: string;
  maxCapacity: number;
}

export function initWorkspace(): RoomConfig {
  console.log("⚡ CodeBase Real-time persistent studio initialized!");
  return {
    roomName: "${name}",
    creator: "${user.name}",
    maxCapacity: 20
  };
}

const config = initWorkspace();
console.log("Studio Active:", config.roomName);
`;

    await db.projectFile.upsert({
      user,
      roomId: room.id,
      path: "src/index.ts",
      name: "index.ts",
      content: defaultCode,
      language: "typescript",
    });

    const fullRoom = await db.room.findUnique({ where: { id: room.id } });
    return NextResponse.json({ success: true, room: fullRoom });
  } catch (error: any) {
    console.error("Create room error:", error);
    return NextResponse.json({ error: error.message || "Failed to create room" }, { status: 500 });
  }
}
