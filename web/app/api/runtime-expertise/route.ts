import { NextResponse } from "next/server";
import { readDecisionHistory } from "@/lib/persistence";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const records = await readDecisionHistory();
  const activeExpertise = records.flatMap((record) => record.activeExpertise.map((summary) => ({ decisionId: record.id, summary })));
  return NextResponse.json({ activeExpertise });
}
