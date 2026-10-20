import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, PROBLEM_TOPICS } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "all";
    const difficulty = url.searchParams.get("difficulty") || "all";
    const query = url.searchParams.get("query") || "";
    const limit = parseInt(url.searchParams.get("limit") || "100", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const { problems, total } = await db.problem.findMany({
      where: {
        category,
        difficulty,
        query,
      },
      limit,
      offset,
    });

    const enriched = problems.map((p) => {
      const isSolved = user ? user.solvedProblemIds?.includes(p.id) : false;
      return {
        ...p,
        isSolved,
      };
    });

    return NextResponse.json({
      success: true,
      problems: enriched,
      topics: PROBLEM_TOPICS,
      pagination: {
        total,
        offset,
        limit,
        hasMore: offset + limit < total,
      },
      userStats: {
        coins: user?.codobaseCoins || 10,
        streakDays: user?.streakDays || 1,
        solvedCount: user?.solvedProblemIds?.length || 0,
        totalCatalog: total,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load problems" }, { status: 500 });
  }
}
