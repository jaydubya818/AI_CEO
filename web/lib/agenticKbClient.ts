import type { ReviewedPromotionPayload } from "./types";

export type ReviewedIngestResponse = {
  ingested: boolean;
  ingestRecordPath: string;
  canonicalPath: string;
};

export async function invokeReviewedIngest(input: {
  payload: ReviewedPromotionPayload;
  reviewer: string;
}): Promise<ReviewedIngestResponse> {
  const baseUrl = process.env.AGENTIC_KB_URL ?? "http://localhost:3002";
  const fileName = input.payload.kbWritebackContract.targetPath.split("/").pop();
  if (!fileName) throw new Error("Invalid writeback target path");

  const response = await fetch(`${baseUrl}/api/repos/AI_CEO/reviewed-ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, reviewer: input.reviewer }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Reviewed ingest failed with ${response.status}`);
  }

  return await response.json() as ReviewedIngestResponse;
}
