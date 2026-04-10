import test from "node:test";
import assert from "node:assert/strict";
import { applySpecialistOutputs, runSpecialistReasoning } from "./specialistReasoning";
import type { DecisionPacket } from "./types";

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
    kbEvidence: {
      provider: "agentic-kb:AI_CEO",
      query: "AI CEO Agent",
      hits: [{ path: "README.md", snippet: "AI CEO Agent product context" }],
    },
    recommendation: {
      summary: "Proceed with a bounded decision.",
      rationale: ["Rationale"],
      missingEvidence: [],
      confidence: 74,
    },
    boardDeliberation: {
      ceoFrame: "CEO frame",
      boardRounds: [],
      finalPositions: [
        { role: "Product Strategist", recommendation: "old", strongestRationale: "old", keyRisk: "old", conditionThatChangesView: "old", confidence: 70 },
        { role: "Revenue Agent", recommendation: "old", strongestRationale: "old", keyRisk: "old", conditionThatChangesView: "old", confidence: 70 },
        { role: "Technical Architect", recommendation: "old", strongestRationale: "old", keyRisk: "old", conditionThatChangesView: "old", confidence: 70 },
        { role: "Contrarian", recommendation: "old", strongestRationale: "old", keyRisk: "old", conditionThatChangesView: "old", confidence: 70 },
      ],
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

test("specialist reasoning returns structured inspectable outputs", async () => {
  const packet = samplePacket();
  const outputs = await runSpecialistReasoning({ brief: packet.brief, packet });
  assert.equal(outputs.length, 4);
  assert.ok(outputs.every((output) => typeof output.recommendation === "string" && typeof output.confidence === "number"));
});

test("specialist outputs refine packet visibly", async () => {
  const packet = samplePacket();
  const outputs = await runSpecialistReasoning({ brief: packet.brief, packet });
  const updated = applySpecialistOutputs({
    ...packet,
    boardDeliberation: { ...packet.boardDeliberation, specialistOutputs: outputs },
  }, outputs);
  assert.ok(updated.boardDeliberation.ceoFrame.includes("Specialist views"));
  assert.ok(updated.boardDeliberation.nextActions.length > packet.boardDeliberation.nextActions.length);
  assert.ok((updated.boardDeliberation.specialistOutputs?.length ?? 0) === 4);
});
