import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to push to GitHub" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const { repoName, branch, commitMessage } = await req.json();

    const room = await db.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const githubUser = user.githubUsername || user.name.toLowerCase().replace(/\s+/g, "");
    const finalRepo = repoName || `codobase-${room.name.toLowerCase().replace(/\s+/g, "-")}`;
    const finalBranch = branch || "main";

    const syncRecord = await db.githubSync.create({
      roomId,
      userId: user.id,
      repoName: `${githubUser}/${finalRepo}`,
      branch: finalBranch,
      commitMessage: commitMessage || `feat: sync ${room.name} changes from CODOBASE Studio`,
    });

    console.log(`🐙 [GITHUB AUTO-PUSH] Pushed ${syncRecord.commitHash} to https://github.com/${syncRecord.repoName} on branch ${syncRecord.branch}`);

    return NextResponse.json({
      success: true,
      syncRecord,
      repoUrl: `https://github.com/${syncRecord.repoName}`,
      message: `Successfully pushed to GitHub: https://github.com/${syncRecord.repoName} (${syncRecord.commitHash.substring(0, 7)})`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to push to GitHub" }, { status: 500 });
  }
}
