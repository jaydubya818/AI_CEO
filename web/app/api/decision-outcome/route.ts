import { NextRequest, NextResponse } from "next/server";
import { updateDecisionOutcome } from "@/lib/persistence";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as {
    decisionId: string;
    status: "executed" | "deferred" | "reversed" | "validated" | "invalidated";
    outcomeNotes: string;
    changedSinceDecision: string;
  };

  const record = await updateDecisionOutcome(body);
  if (!record) {
    return NextResponse.json({ error: "Decision not found" }, { status: 404 });
  }

  return NextResponse.json({ record });
}
