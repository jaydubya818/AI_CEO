import { NextRequest, NextResponse } from "next/server";
import { executeApprovedWriteback } from "@/lib/kbWriteback";
import { executePromotionWriteback } from "@/lib/persistence";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as {
    decisionId: string;
    kind: "memory" | "expertise";
    reviewer: string;
    rationale: string;
  };

  const record = await executePromotionWriteback(body, executeApprovedWriteback);
  if (!record) {
    return NextResponse.json({ error: "Approved proposal not found" }, { status: 404 });
  }

  return NextResponse.json({ record });
}
