import test from "node:test";
import assert from "node:assert/strict";
import { packetToDecisionSummary } from "./decisionPacket";

test("packetToDecisionSummary maps a decision packet into decision summary fields", () => {
    const summary = packetToDecisionSummary({
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
        missingEvidence: ["Need owner"],
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
        supportingEvidenceRefs: [],
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
    });

    assert.equal(summary.title, "Q3 Hiring Acceleration");
    assert.equal(summary.confidence, 74);
});
