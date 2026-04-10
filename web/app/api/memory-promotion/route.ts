import { NextRequest, NextResponse } from "next/server";
import { promoteDecisionMemory } from "@/lib/persistence";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as {
    decisionId: string;
    title: string;
    summary: string;
  };

  const record = await promoteDecisionMemory(body);
  if (!record) {
    return NextResponse.json({ error: "Decision not found" }, { status: 404 });
  }

  return NextResponse.json({ record });
}
