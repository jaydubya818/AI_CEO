import { NextRequest, NextResponse } from "next/server";
import { canApprove, getActiveReviewer, requiresSecondReview } from "@/lib/auth";
import { reviewPromotionProposal } from "@/lib/persistence";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as {
    decisionId: string;
    kind: "memory" | "expertise";
    action: "approve" | "reject" | "request-second-review";
    reviewNotes: string;
  };

  const reviewer = await getActiveReviewer();
  if (body.action === "approve" && !canApprove(body.kind, reviewer)) {
    return NextResponse.json({ error: "Reviewer lacks permission for this approval" }, { status: 403 });
  }

  const effectiveAction = body.action === "approve" && requiresSecondReview(body.kind) && reviewer.role !== "governance-admin"
    ? "request-second-review"
    : body.action;

  const record = await reviewPromotionProposal({
    ...body,
    action: effectiveAction,
    reviewer: reviewer.displayName,
    reviewerId: reviewer.id,
    reviewerRole: reviewer.role,
  });
  if (!record) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  return NextResponse.json({ record });
}
