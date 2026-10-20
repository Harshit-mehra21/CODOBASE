import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      country,
      bio,
      avatar,
      skills,
      portfolioUrl,
      githubUsername,
      linkedinUrl,
      leetcodeUsername,
    } = await req.json();

    const cleanGithub = githubUsername
      ? githubUsername.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "").trim()
      : undefined;

    const cleanLeetcode = leetcodeUsername
      ? leetcodeUsername.replace(/^https?:\/\/leetcode\.com\/(?:u\/)?/, "").replace(/\/$/, "").trim()
      : undefined;

    const now = new Date().toISOString();

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: name?.trim() || user.name,
        country: country?.trim() || user.country,
        bio: bio !== undefined ? bio : user.bio,
        avatar: avatar || user.avatar,
        skills: skills || user.skills,
        portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : user.portfolioUrl,
        githubUsername: cleanGithub || user.githubUsername,
        githubConnected: !!cleanGithub || user.githubConnected,
        githubVerifiedAt: cleanGithub ? now : user.githubVerifiedAt,
        linkedinUrl: linkedinUrl?.trim() || user.linkedinUrl,
        linkedinConnected: !!linkedinUrl || user.linkedinConnected,
        leetcodeUsername: cleanLeetcode || user.leetcodeUsername,
        leetcodeConnected: !!cleanLeetcode || user.leetcodeConnected,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
