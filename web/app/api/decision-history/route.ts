import { NextRequest, NextResponse } from "next/server";
import { compareDecisionRecords, readDecisionHistory } from "@/lib/persistence";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const records = await readDecisionHistory();
  const { searchParams } = new URL(request.url);
  const status = (searchParams.get("status") ?? "all") as "all" | "pending" | "executed" | "deferred" | "reversed" | "validated" | "invalidated";
  const domain = searchParams.get("domain") ?? "all";
  const recommendationQuery = searchParams.get("q") ?? "";
  return NextResponse.json({
    records,
    comparison: compareDecisionRecords(records, { status, domain, recommendationQuery }),
  });
}
