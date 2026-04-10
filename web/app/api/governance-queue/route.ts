import { NextRequest, NextResponse } from "next/server";
import { readDecisionHistory } from "@/lib/persistence";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const records = await readDecisionHistory();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const kind = searchParams.get("kind");
  const queue = records
    .flatMap((record) => [record.memoryProposal, record.expertiseProposal].filter(Boolean).map((proposal) => ({
      decisionId: record.id,
      title: proposal!.title,
      kind: proposal!.kind,
      status: proposal!.status,
      reviewedAt: proposal!.reviewedAt ?? null,
      writebackExecuted: !!proposal!.writeback,
      requiredApprovals: proposal!.kind === "expertise" ? 2 : 1,
      approvals: proposal!.audit.filter((entry) => entry.action === "approve").length,
    })))
    .filter((item) => status ? item.status === status : true)
    .filter((item) => kind ? item.kind === kind : true);
  return NextResponse.json({ queue });
}
