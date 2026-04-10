import { promises as fs } from "node:fs";
import path from "node:path";
import type { ReviewedPromotionPayload } from "./types";

const KB_ROOT = process.env.AGENTIC_KB_PATH ?? path.resolve(process.cwd(), "../../Agentic-KB");

export type WritebackExecutionResult = {
  executedAt: string;
  targetPath: string;
  bytesWritten: number;
};

export async function executeApprovedWriteback(payload: ReviewedPromotionPayload): Promise<WritebackExecutionResult> {
  const targetPath = path.join(KB_ROOT, payload.kbWritebackContract.targetPath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const content = JSON.stringify(payload, null, 2);
  await fs.writeFile(targetPath, content);
  return {
    executedAt: new Date().toISOString(),
    targetPath,
    bytesWritten: Buffer.byteLength(content, "utf8"),
  };
}
