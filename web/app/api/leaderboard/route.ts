import { NextResponse } from "next/server";
import { getGlobalLeaderboard } from "@/lib/data/ranking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitRaw = searchParams.get("limit");
  const limit = Math.max(1, Math.min(100, Number(limitRaw ?? 20) || 20));
  const leaderboard = await getGlobalLeaderboard(limit);
  return NextResponse.json(leaderboard);
}

