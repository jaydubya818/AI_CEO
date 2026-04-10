import test from "node:test";
import assert from "node:assert/strict";
import { compareDecisionRecords, executePromotionWriteback, makeStoredDecisionRecord, reviewPromotionProposal } from "./persistence";
import { applyRuntimeExpertise } from "./runtimeExpertise";
import type { Brief, DecisionPacket } from "./types";

function samplePacket(): DecisionPacket {
  return {
    brief: {
      id: "brief-1",
      title: "Q3 Hiring Acceleration",
      situation: "Queues are rising",
      stakes: "Delivery risk",
      constraints: "Owner: COO",
      keyQuestions: ["Which roles matter most?"],
    },
    kbEvidence: null,
    recommendation: {
      summary: "Proceed with a bounded decision.",
      rationale: ["Rationale"],
      missingEvidence: [],
      confidence: 74,
    },
    boardDeliberation: {
      ceoFrame: "CEO frame",
      boardRounds: [],
      finalPositions: [],
      stanceMatrix: [],
      resolvedTensions: [],
      unresolvedTensions: [],
      recommendation: "Proceed",
      risks: [],
      nextActions: [],
      supportingEvidenceRefs: ["README.md"],
      sofieReview: {
        actor: "sofie",
        kind: "review",
        verdict: "answer",
        summary: "ok",
        details: [],
        closureRecommendation: "continue",
        scopeDriftDetected: false,
        escalation: { escalate: false, reason: null, why: "ok" },
      },
    },
    sofieReview: {
      actor: "sofie",
      kind: "review",
      verdict: "answer",
      summary: "ok",
      details: [],
      closureRecommendation: "continue",
      scopeDriftDetected: false,
      escalation: { escalate: false, reason: null, why: "ok" },
    },
  };
}

test("makeStoredDecisionRecord builds durable decision record", () => {
  const brief: Brief = {
    id: "brief-1",
    title: "Q3 Hiring Acceleration",
    situation: "Queues are rising",
    stakes: "Delivery risk",
    constraints: "Owner: COO",
    keyQuestions: ["Which roles matter most?"],
    createdAt: "Today",
    valid: true,
    validationErrors: [],
  };

  const record = makeStoredDecisionRecord({ brief, packet: samplePacket() });
  assert.equal(record.id, "brief-1");
  assert.equal(record.outcome, null);
});

test("compareDecisionRecords returns MVP comparison rows", () => {
  const brief: Brief = {
    id: "brief-1",
    title: "Q3 Hiring Acceleration",
    situation: "Queues are rising",
    stakes: "Delivery risk",
    constraints: "Owner: COO",
    keyQuestions: ["Which roles matter most?"],
    createdAt: "Today",
    valid: true,
    validationErrors: [],
  };
  const rows = compareDecisionRecords([makeStoredDecisionRecord({ brief, packet: samplePacket() })]);
  assert.equal(rows[0]?.outcomeStatus, "pending");
  assert.equal(rows[0]?.recommendation, "Proceed");
});

test("approved promotion payload shape is bounded and explicit", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const brief: Brief = {
    id: "brief-1",
    title: "Q3 Hiring Acceleration",
    situation: "Queues are rising",
    stakes: "Delivery risk",
    constraints: "Owner: COO",
    keyQuestions: ["Which roles matter most?"],
    createdAt: "Today",
    valid: true,
    validationErrors: [],
  };
  const record = makeStoredDecisionRecord({ brief, packet: samplePacket() });
  record.memoryProposal = {
    id: "memory-brief-1",
    decisionId: "brief-1",
    kind: "memory",
    title: "Hiring lesson",
    summary: "Checkpointed decisions outperform ambiguous ones.",
    evidenceRefs: ["README.md"],
    status: "proposed",
    approvedPayload: null,
    audit: [],
    writeback: null,
    createdAt: new Date().toISOString(),
  };
  const storageDir = path.join(process.cwd(), ".data");
  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(path.join(storageDir, "decision-history.json"), JSON.stringify([record], null, 2));
  const reviewed = await reviewPromotionProposal({
    decisionId: "brief-1",
    kind: "memory",
    action: "approve",
    reviewNotes: "Approved",
    reviewer: "Reviewer One",
    reviewerId: "reviewer-1",
    reviewerRole: "reviewer",
  });
  assert.equal(reviewed?.memoryProposal?.status, "approved");
  assert.equal(reviewed?.memoryProposal?.approvedPayload?.targetRepo, "AI_CEO");
  assert.equal(reviewed?.memoryProposal?.approvedPayload?.kbWritebackContract.reviewRequired, true);
});

test("approved writeback execution is explicit and auditable", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const brief: Brief = {
    id: "brief-2",
    title: "Enterprise bundle decision",
    situation: "Need phased delivery",
    stakes: "Revenue risk",
    constraints: "Owner: CPO",
    keyQuestions: ["Can phased delivery preserve confidence?"],
    createdAt: "Today",
    valid: true,
    validationErrors: [],
  };
  const record = makeStoredDecisionRecord({ brief, packet: samplePacket() });
  record.memoryProposal = {
    id: "memory-brief-2",
    decisionId: "brief-2",
    kind: "memory",
    title: "Phased delivery learning",
    summary: "Phased commitments work when explicit guardrails exist.",
    evidenceRefs: ["README.md"],
    status: "approved",
    approvedPayload: {
      targetRepo: "AI_CEO",
      promotionKind: "memory",
      decisionId: "brief-2",
      title: "Phased delivery learning",
      summary: "Phased commitments work when explicit guardrails exist.",
      evidenceRefs: ["README.md"],
      recommendation: "Proceed",
      kbWritebackContract: {
        suggestedCommand: "kb repo close-task",
        targetPath: "wiki/repos/AI_CEO/review-exports/memory-brief-2.json",
        reviewRequired: true,
      },
    },
    audit: [],
    writeback: null,
    createdAt: new Date().toISOString(),
  };
  const storageDir = path.join(process.cwd(), ".data");
  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(path.join(storageDir, "decision-history.json"), JSON.stringify([record], null, 2));
  const updated = await executePromotionWriteback(
    { decisionId: "brief-2", kind: "memory", reviewer: "Reviewer Two", rationale: "Execute explicit reviewed export" },
    async () => ({ executedAt: new Date().toISOString(), targetPath: "tmp/export.json", bytesWritten: 42 }),
  );
  assert.equal(updated?.memoryProposal?.writeback?.targetPath, "tmp/export.json");
  assert.equal(updated?.memoryProposal?.audit.at(-1)?.action, "execute-writeback");
});

test("runtime expertise effects are visible and granular", () => {
  const packet = samplePacket();
  const updated = applyRuntimeExpertise(packet, ["Use explicit checkpoints for technical decisions"]);
  assert.ok(updated.boardDeliberation.ceoFrame.includes("Active expertise"));
  assert.ok(updated.boardDeliberation.nextActions.some((action) => action.includes("Apply approved expertise")));
});

test("expertise approvals require two approvals before approved state", async () => {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const brief: Brief = {
    id: "brief-3",
    title: "Expertise policy",
    situation: "Need review discipline",
    stakes: "Governance quality",
    constraints: "Owner: COO",
    keyQuestions: ["How should expertise be promoted?"],
    createdAt: "Today",
    valid: true,
    validationErrors: [],
  };
  const record = makeStoredDecisionRecord({ brief, packet: samplePacket() });
  record.expertiseProposal = {
    id: "expertise-brief-3",
    decisionId: "brief-3",
    kind: "expertise",
    title: "Expertise rule",
    summary: "Technical decisions need explicit checkpoints.",
    evidenceRefs: ["README.md"],
    status: "proposed",
    approvedPayload: null,
    audit: [],
    writeback: null,
    createdAt: new Date().toISOString(),
  };
  const storageDir = path.join(process.cwd(), ".data");
  await fs.mkdir(storageDir, { recursive: true });
  await fs.writeFile(path.join(storageDir, "decision-history.json"), JSON.stringify([record], null, 2));
  const first = await reviewPromotionProposal({
    decisionId: "brief-3",
    kind: "expertise",
    action: "approve",
    reviewNotes: "First reviewer approves",
    reviewer: "Reviewer One",
    reviewerId: "reviewer-1",
    reviewerRole: "reviewer",
  });
  assert.equal(first?.expertiseProposal?.status, "under_review");
  const second = await reviewPromotionProposal({
    decisionId: "brief-3",
    kind: "expertise",
    action: "approve",
    reviewNotes: "Second reviewer approves",
    reviewer: "Reviewer Two",
    reviewerId: "reviewer-2",
    reviewerRole: "governance-admin",
  });
  assert.equal(second?.expertiseProposal?.status, "approved");
});
