import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  Brief,
  DecisionPacket,
  PromotionAuditEntry,
  ReviewerRole,
  WritebackExecution,
} from "./types";

export type DecisionOutcomeStatus = "executed" | "deferred" | "reversed" | "validated" | "invalidated";
export type ProposalReviewStatus = "proposed" | "under_review" | "approved" | "rejected" | "executed";
export type PromotionKind = "memory" | "expertise";

export type DecisionOutcome = {
  status: DecisionOutcomeStatus;
  outcomeNotes: string;
  changedSinceDecision: string;
  updatedAt: string;
};

export type ReviewedPromotionPayload = {
  targetRepo: "AI_CEO";
  promotionKind: PromotionKind;
  decisionId: string;
  title: string;
  summary: string;
  evidenceRefs: string[];
  recommendation: string;
  kbWritebackContract: {
    suggestedCommand: string;
    targetPath: string;
    reviewRequired: true;
  };
};

export type MemoryPromotionProposal = {
  id: string;
  decisionId: string;
  kind: "memory";
  title: string;
  summary: string;
  evidenceRefs: string[];
  status: ProposalReviewStatus;
  reviewNotes?: string;
  approvedPayload: ReviewedPromotionPayload | null;
  audit: PromotionAuditEntry[];
  writeback?: WritebackExecution | null;
  createdAt: string;
  reviewedAt?: string;
};

export type ExpertiseUpdateProposal = {
  id: string;
  decisionId: string;
  kind: "expertise";
  title: string;
  summary: string;
  evidenceRefs: string[];
  status: ProposalReviewStatus;
  reviewNotes?: string;
  approvedPayload: ReviewedPromotionPayload | null;
  audit: PromotionAuditEntry[];
  writeback?: WritebackExecution | null;
  createdAt: string;
  reviewedAt?: string;
};

export type DecisionTimelineEvent = {
  id: string;
  at: string;
  type:
    | "decision_created"
    | "outcome_updated"
    | "memory_proposed"
    | "memory_reviewed"
    | "expertise_proposed"
    | "expertise_reviewed"
    | "writeback_executed";
  summary: string;
};

export type StoredDecisionRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  brief: Brief;
  packet: DecisionPacket;
  outcome: DecisionOutcome | null;
  memoryProposal: MemoryPromotionProposal | null;
  expertiseProposal: ExpertiseUpdateProposal | null;
  timeline: DecisionTimelineEvent[];
  activeExpertise: string[];
};

const storageDir = path.join(process.cwd(), ".data");
const storagePath = path.join(storageDir, "decision-history.json");

function nowIso(): string {
  return new Date().toISOString();
}

function buildWritebackContract(kind: PromotionKind, decisionId: string) {
  const slug = `${kind}-${decisionId}.json`;
  return {
    suggestedCommand: `cd ../Agentic-KB && node cli/kb.js repo close-task AI_CEO ai-ceo-review '${slug}'`,
    targetPath: `wiki/repos/AI_CEO/review-exports/${slug}`,
    reviewRequired: true as const,
  };
}

function buildApprovedPayload(input: {
  kind: PromotionKind;
  decisionId: string;
  title: string;
  summary: string;
  evidenceRefs: string[];
  recommendation: string;
}): ReviewedPromotionPayload {
  return {
    targetRepo: "AI_CEO",
    promotionKind: input.kind,
    decisionId: input.decisionId,
    title: input.title,
    summary: input.summary,
    evidenceRefs: input.evidenceRefs,
    recommendation: input.recommendation,
    kbWritebackContract: buildWritebackContract(input.kind, input.decisionId),
  };
}

function appendTimeline(record: StoredDecisionRecord, event: Omit<DecisionTimelineEvent, "id" | "at">) {
  record.timeline.unshift({
    id: `${event.type}-${record.id}-${record.timeline.length + 1}`,
    at: nowIso(),
    ...event,
  });
}

export function makeStoredDecisionRecord(input: { brief: Brief; packet: DecisionPacket }): StoredDecisionRecord {
  const timestamp = nowIso();
  return {
    id: input.brief.id,
    createdAt: timestamp,
    updatedAt: timestamp,
    brief: input.brief,
    packet: input.packet,
    outcome: null,
    memoryProposal: null,
    expertiseProposal: null,
    timeline: [
      {
        id: `decision-created-${input.brief.id}`,
        at: timestamp,
        type: "decision_created",
        summary: `Decision created for ${input.brief.title}`,
      },
    ],
    activeExpertise: [],
  };
}

export async function readDecisionHistory(): Promise<StoredDecisionRecord[]> {
  try {
    const content = await fs.readFile(storagePath, "utf8");
    const parsed = JSON.parse(content) as StoredDecisionRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeDecisionHistory(records: StoredDecisionRecord[]): Promise<void> {
  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(storagePath, JSON.stringify(records, null, 2));
}

export async function saveDecisionRecord(record: StoredDecisionRecord): Promise<StoredDecisionRecord[]> {
  const records = await readDecisionHistory();
  const existingIndex = records.findIndex((entry) => entry.id === record.id);
  if (existingIndex >= 0) {
    records[existingIndex] = { ...record, createdAt: records[existingIndex].createdAt, updatedAt: nowIso() };
  } else {
    records.unshift(record);
  }
  await writeDecisionHistory(records);
  return records;
}

export async function updateDecisionOutcome(input: {
  decisionId: string;
  status: DecisionOutcomeStatus;
  outcomeNotes: string;
  changedSinceDecision: string;
}): Promise<StoredDecisionRecord | null> {
  const records = await readDecisionHistory();
  const next = records.find((entry) => entry.id === input.decisionId);
  if (!next) return null;
  next.outcome = {
    status: input.status,
    outcomeNotes: input.outcomeNotes,
    changedSinceDecision: input.changedSinceDecision,
    updatedAt: nowIso(),
  };
  next.updatedAt = nowIso();
  appendTimeline(next, {
    type: "outcome_updated",
    summary: `Outcome marked ${input.status}: ${input.changedSinceDecision}`,
  });
  await writeDecisionHistory(records);
  return next;
}

export async function promoteDecisionMemory(input: {
  decisionId: string;
  title: string;
  summary: string;
}): Promise<StoredDecisionRecord | null> {
  const records = await readDecisionHistory();
  const next = records.find((entry) => entry.id === input.decisionId);
  if (!next) return null;
  next.memoryProposal = {
    id: `memory-${input.decisionId}`,
    decisionId: input.decisionId,
    kind: "memory",
    title: input.title,
    summary: input.summary,
    evidenceRefs: next.packet.boardDeliberation.supportingEvidenceRefs,
    status: "proposed",
    approvedPayload: null,
    audit: [],
    writeback: null,
    createdAt: nowIso(),
  };
  next.updatedAt = nowIso();
  appendTimeline(next, {
    type: "memory_proposed",
    summary: `Memory proposal created: ${input.title}`,
  });
  await writeDecisionHistory(records);
  return next;
}

export async function proposeExpertiseUpdate(input: {
  decisionId: string;
  title: string;
  summary: string;
}): Promise<StoredDecisionRecord | null> {
  const records = await readDecisionHistory();
  const next = records.find((entry) => entry.id === input.decisionId);
  if (!next) return null;
  next.expertiseProposal = {
    id: `expertise-${input.decisionId}`,
    decisionId: input.decisionId,
    kind: "expertise",
    title: input.title,
    summary: input.summary,
    evidenceRefs: next.packet.boardDeliberation.supportingEvidenceRefs,
    status: "proposed",
    approvedPayload: null,
    audit: [],
    writeback: null,
    createdAt: nowIso(),
  };
  next.updatedAt = nowIso();
  appendTimeline(next, {
    type: "expertise_proposed",
    summary: `Expertise proposal created: ${input.title}`,
  });
  await writeDecisionHistory(records);
  return next;
}

export async function reviewPromotionProposal(input: {
  decisionId: string;
  kind: PromotionKind;
  action: "approve" | "reject" | "request-second-review";
  reviewNotes: string;
  reviewer: string;
  reviewerId?: string;
  reviewerRole?: ReviewerRole;
}): Promise<StoredDecisionRecord | null> {
  const records = await readDecisionHistory();
  const next = records.find((entry) => entry.id === input.decisionId);
  if (!next) return null;
  const proposal = input.kind === "memory" ? next.memoryProposal : next.expertiseProposal;
  if (!proposal) return null;

  const priorApprovals = proposal.audit.filter((entry) => entry.action === "approve").length;
  const requiredApprovals = input.kind === "expertise" ? 2 : 1;
  const nextApprovals = input.action === "approve" ? priorApprovals + 1 : priorApprovals;
  proposal.status = input.action === "reject"
    ? "rejected"
    : input.action === "request-second-review"
      ? "under_review"
      : nextApprovals >= requiredApprovals
        ? "approved"
        : "under_review";
  proposal.reviewNotes = input.reviewNotes;
  proposal.reviewedAt = nowIso();
  proposal.audit.push({
    reviewer: input.reviewer,
    reviewerId: input.reviewerId,
    reviewerRole: input.reviewerRole,
    action: input.action === "request-second-review" ? "approve" : input.action,
    rationale: input.reviewNotes,
    at: nowIso(),
  });
  proposal.approvedPayload = proposal.status === "approved"
    ? buildApprovedPayload({
        kind: input.kind,
        decisionId: next.id,
        title: proposal.title,
        summary: proposal.summary,
        evidenceRefs: proposal.evidenceRefs,
        recommendation: next.packet.boardDeliberation.recommendation,
      })
    : null;

  next.updatedAt = nowIso();
  if (input.kind === "expertise" && proposal.status === "approved") {
    next.activeExpertise = Array.from(new Set([...next.activeExpertise, proposal.summary]));
  }
  appendTimeline(next, {
    type: input.kind === "memory" ? "memory_reviewed" : "expertise_reviewed",
    summary: `${input.kind} proposal ${proposal.status} by ${input.reviewer}: ${input.reviewNotes}`,
  });
  await writeDecisionHistory(records);
  return next;
}

export async function executePromotionWriteback(
  input: { decisionId: string; kind: PromotionKind; reviewer: string; rationale: string },
  executor: (payload: ReviewedPromotionPayload) => Promise<WritebackExecution>,
): Promise<StoredDecisionRecord | null> {
  const records = await readDecisionHistory();
  const next = records.find((entry) => entry.id === input.decisionId);
  if (!next) return null;
  const proposal = input.kind === "memory" ? next.memoryProposal : next.expertiseProposal;
  if (!proposal?.approvedPayload || proposal.status !== "approved") return null;
  proposal.writeback = await executor(proposal.approvedPayload);
  proposal.audit.push({ reviewer: input.reviewer, action: "execute-writeback", rationale: input.rationale, at: nowIso() });
  proposal.status = "executed";
  next.updatedAt = nowIso();
  appendTimeline(next, {
    type: "writeback_executed",
    summary: `${input.kind} writeback executed by ${input.reviewer}: ${proposal.writeback.targetPath}`,
  });
  await writeDecisionHistory(records);
  return next;
}

export async function executeReviewedIngest(
  input: { decisionId: string; kind: PromotionKind; reviewer: string; rationale: string },
  ingester: (input: { payload: ReviewedPromotionPayload; reviewer: string }) => Promise<{ ingested: boolean; ingestRecordPath: string; canonicalPath: string }>,
): Promise<StoredDecisionRecord | null> {
  const records = await readDecisionHistory();
  const next = records.find((entry) => entry.id === input.decisionId);
  if (!next) return null;
  const proposal = input.kind === "memory" ? next.memoryProposal : next.expertiseProposal;
  if (!proposal?.approvedPayload || !proposal.writeback) return null;
  const ingestResponse = await ingester({ payload: proposal.approvedPayload, reviewer: input.reviewer });
  proposal.writeback = { ...proposal.writeback, ingestResponse };
  proposal.audit.push({ reviewer: input.reviewer, action: "ingest-reviewed", rationale: input.rationale, at: nowIso() });
  appendTimeline(next, {
    type: "writeback_executed",
    summary: `${input.kind} reviewed ingest executed by ${input.reviewer}: ${ingestResponse.canonicalPath}`,
  });
  next.updatedAt = nowIso();
  await writeDecisionHistory(records);
  return next;
}

export function compareDecisionRecords(records: StoredDecisionRecord[], filters?: {
  status?: DecisionOutcomeStatus | "pending" | "all";
  domain?: string | "all";
  recommendationQuery?: string;
}): Array<{
  id: string;
  title: string;
  recommendation: string;
  confidence: number;
  outcomeStatus: DecisionOutcomeStatus | "pending";
  domain: string;
  changedSinceDecision: string;
}> {
  return records
    .filter((record) => (filters?.status && filters.status !== "all") ? (record.outcome?.status ?? "pending") === filters.status : true)
    .filter((record) => (filters?.domain && filters.domain !== "all") ? record.brief.title.toLowerCase().includes(filters.domain.toLowerCase()) || record.packet.boardDeliberation.recommendation.toLowerCase().includes(filters.domain.toLowerCase()) : true)
    .filter((record) => filters?.recommendationQuery ? record.packet.boardDeliberation.recommendation.toLowerCase().includes(filters.recommendationQuery.toLowerCase()) : true)
    .map((record) => ({
      id: record.id,
      title: record.brief.title,
      recommendation: record.packet.boardDeliberation.recommendation,
      confidence: record.packet.recommendation.confidence,
      outcomeStatus: record.outcome?.status ?? "pending",
      domain: record.brief.title,
      changedSinceDecision: record.outcome?.changedSinceDecision ?? "No outcome change recorded yet.",
    }));
}
