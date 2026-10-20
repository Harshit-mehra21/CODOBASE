import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: true, goals: [] });
    }
    const goals = await db.goal.findMany({ where: { userId: user.id } });
    return NextResponse.json({ success: true, goals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, progress, category, deadline } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const goal = await db.goal.create({
      data: {
        userId: user.id,
        title: title.trim(),
        progress: parseInt(progress) || 0,
        category: category || "Project",
        deadline: deadline || "Upcoming",
      },
    });

    return NextResponse.json({ success: true, goal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create goal" }, { status: 500 });
  }
}
