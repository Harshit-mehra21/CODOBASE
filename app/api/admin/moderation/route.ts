import { NextResponse } from "next/server";
import { getCurrentUser, requireAdminOrDeveloper } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/moderation - Admin Overview
export async function GET() {
  try {
    const admin = await requireAdminOrDeveloper();
    const overview = await db.moderation.getAdminOverview();
    const allUsers = await db.user.findMany();

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, role: admin.role },
      overview,
      users: allUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Admin access denied" }, { status: 403 });
  }
}

// POST /api/admin/moderation - Admin Ban/Unban/Strike Action
export async function POST(req: Request) {
  try {
    const admin = await requireAdminOrDeveloper();
    const { targetUserId, action, reason } = await req.json();

    if (!targetUserId || !action) {
      return NextResponse.json({ error: "Target user and action required" }, { status: 400 });
    }

    const target = await db.user.findUnique({ where: { id: targetUserId } });
    if (!target) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    // Protect developer account from ban
    if (target.role === "DEVELOPER") {
      return NextResponse.json({ error: "Cannot moderate or ban platform owner/developer" }, { status: 403 });
    }

    const now = new Date().toISOString();

    if (action === "BAN") {
      await db.user.update({
        where: { id: target.id },
        data: { status: "BANNED", bannedAt: now, banReason: reason || "Manual Admin Ban" },
      });

      // Add to persistent blocklist
      await db.moderation.banEmail(target.email, reason || "Manual Admin Ban", admin.name);

      await db.auditLog.create({
        userId: admin.id,
        userName: admin.name,
        userRole: admin.role,
        actionType: "ACCOUNT_BANNED",
        entityType: "USER",
        entityId: target.id,
        description: `Admin ${admin.name} permanently banned ${target.name} (${target.email}). Reason: ${reason || "Policy enforcement"}`,
        timestamp: now,
      });

      return NextResponse.json({ success: true, message: `User ${target.name} has been banned and email ${target.email} added to blocklist.` });
    }

    if (action === "UNBAN") {
      await db.user.update({
        where: { id: target.id },
        data: { status: "ACTIVE", banReason: undefined, bannedAt: undefined, abusiveWarningsCount: 0 },
      });

      // Remove from persistent blocklist
      await db.moderation.unbanEmail(target.email);

      await db.auditLog.create({
        userId: admin.id,
        userName: admin.name,
        userRole: admin.role,
        actionType: "ADMIN_ACTION",
        entityType: "USER",
        entityId: target.id,
        description: `Admin ${admin.name} restored access for ${target.name} (${target.email}) and removed from blocklist.`,
        timestamp: now,
      });

      return NextResponse.json({ success: true, message: `User ${target.name} restored to ACTIVE status and email unblocked.` });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin moderation error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute admin action" }, { status: 500 });
  }
}
