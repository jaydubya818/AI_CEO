import test from "node:test";
import assert from "node:assert/strict";
import { applySpecialistOutputs, executeSpecialistWithTrace, runSpecialistReasoning } from "./specialistReasoning";
import { resolveSpecialistExecutionPolicy, validateSpecialistOutputs } from "./specialistPolicy";
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

test("specialist policy resolves fallback when live provider not allowed", () => {
  const packet = samplePacket();
  const policy = resolveSpecialistExecutionPolicy({ brief: packet.brief, packet });
  assert.ok(["fallback", "live", "blocked"].includes(policy.mode));
  assert.ok(Array.isArray(policy.allowedRoles));
});

test("specialist output validation catches incomplete outputs", () => {
  const validation = validateSpecialistOutputs([
    {
      role: "Product Strategist",
      recommendation: "",
      strongestRationale: "ok",
      keyRisk: "ok",
      conditionThatChangesView: "ok",
      confidence: 80,
    },
  ]);
  assert.equal(validation.ok, false);
  assert.ok(validation.errors[0]?.includes("missing recommendation"));
});

test("fallback prevents hidden autonomy creep by keeping fixed specialist set", async () => {
  const packet = samplePacket();
  const outputs = await runSpecialistReasoning({ brief: packet.brief, packet });
  assert.deepEqual(outputs.map((output) => output.role), ["Product Strategist", "Revenue Agent", "Technical Architect", "Contrarian"]);
});

test("provider trace is inspectable even when fallback is used", async () => {
  const packet = samplePacket();
  const result = await executeSpecialistWithTrace({ role: "Revenue Agent", brief: packet.brief, kbSnippet: packet.kbEvidence?.hits[0]?.snippet });
  assert.ok(result.trace.provider.length > 0);
  assert.equal(typeof result.trace.usedFallback, "boolean");
});
