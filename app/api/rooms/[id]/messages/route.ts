import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { evaluateContent } from "@/lib/moderation";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const messages = await db.chatMessage.findMany({ where: { roomId: id } });
    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const { text, codeSnippet, subRoomId } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    // Check if user is already banned
    if (user?.status === "BANNED") {
      return NextResponse.json(
        { error: "Your account is permanently banned due to policy violations.", isBanned: true },
        { status: 403 }
      );
    }

    // Run automated content moderation & strike engine
    const moderation = await evaluateContent(text, user?.id);
    if (!moderation.clean) {
      return NextResponse.json(
        {
          success: false,
          warning: true,
          strikes: moderation.strikes,
          isBanned: moderation.isBanned,
          matchedWord: moderation.matchedWord,
          message: moderation.message,
        },
        { status: 422 }
      );
    }

    const message = await db.chatMessage.create({
      data: {
        roomId: id,
        subRoomId: subRoomId || undefined,
        userId: user?.id || "guest-user",
        senderName: user?.name || "Guest Builder",
        avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        country: user?.country || "🌐 Global",
        role: user?.role || "USER",
        text: text.trim(),
        codeSnippet: codeSnippet || undefined,
        isAI: false,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error("Post message error:", error);
    return NextResponse.json({ error: error.message || "Failed to post message" }, { status: 500 });
  }
}
