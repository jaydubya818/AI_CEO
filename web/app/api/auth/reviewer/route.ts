import { NextRequest, NextResponse } from "next/server";
import { getActiveReviewer, listReviewers } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const activeReviewer = await getActiveReviewer();
  return NextResponse.json({ activeReviewer, reviewers: listReviewers() });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json() as { reviewerId: string };
  const reviewer = listReviewers().find((entry) => entry.id === body.reviewerId);
  if (!reviewer) {
    return NextResponse.json({ error: "Reviewer not found" }, { status: 404 });
  }

  const response = NextResponse.json({ activeReviewer: reviewer, reviewers: listReviewers() });
  response.cookies.set("ai_ceo_reviewer", reviewer.id, { httpOnly: false, sameSite: "lax", path: "/" });
  return response;
}
