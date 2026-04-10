import { NextRequest, NextResponse } from "next/server";
import { invokeReviewedIngest } from "@/lib/agenticKbClient";
import { executeReviewedIngest } from "@/lib/persistence";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as {
    decisionId: string;
    kind: "memory" | "expertise";
    reviewer: string;
    rationale: string;
  };

  const record = await executeReviewedIngest(body, invokeReviewedIngest);
  if (!record) {
    return NextResponse.json({ error: "Executed proposal not found" }, { status: 404 });
  }

  return NextResponse.json({ record });
}
