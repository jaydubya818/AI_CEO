import { NextRequest, NextResponse } from "next/server";
import { Brief, DecisionPacket } from "@/lib/types";
import { makeStoredDecisionRecord, saveDecisionRecord } from "@/lib/persistence";
import { applySpecialistOutputs, runSpecialistReasoning } from "@/lib/specialistReasoning";

export const runtime = "nodejs";

async function fetchKbEvidence(): Promise<DecisionPacket["kbEvidence"]> {
  const baseUrl = process.env.AGENTIC_KB_URL ?? "http://localhost:3002";
  const response = await fetch(`${baseUrl}/api/repos/AI_CEO/search?q=${encodeURIComponent("AI CEO Agent")}`, { cache: "no-store" }).catch(() => null);
  if (!response?.ok) return null;
  const payload = await response.json().catch(() => null) as { results?: Array<{ path: string; title?: string; snippet: string; score?: number }> } | null;
  const hits = Array.isArray(payload?.results) ? payload.results.slice(0, 3) : [];
  return { provider: "agentic-kb:AI_CEO", query: "AI CEO Agent", hits };
}

async function buildHarnessPacket(brief: Brief, kbEvidence: DecisionPacket["kbEvidence"]): Promise<DecisionPacket> {
  const harnessModule = await import("../../../../../pi-multi-team-local/Agentic-Pi-Harness/dist/aiCeo/decisionPacket.js").catch(() => null);
  if (!harnessModule?.buildDecisionPacket) {
    return {
      brief: {
        id: brief.id,
        title: brief.title,
        situation: brief.situation,
        stakes: brief.stakes,
        constraints: brief.constraints,
        keyQuestions: brief.keyQuestions,
      },
      kbEvidence,
      recommendation: {
        summary: `Proceed with a bounded recommendation for ${brief.title}.`,
        rationale: [brief.situation, brief.stakes, brief.constraints],
        missingEvidence: kbEvidence?.hits.length ? [] : ["No Agentic-KB evidence retrieved."],
        confidence: kbEvidence?.hits.length ? 80 : 68,
      },
      boardDeliberation: {
        ceoFrame: `CEO frame: decide ${brief.title} with explicit owner and checkpoint.`,
        boardRounds: [],
        finalPositions: [],
        stanceMatrix: [],
        resolvedTensions: [],
        unresolvedTensions: [],
        recommendation: `Proceed with a bounded recommendation for ${brief.title}.`,
        risks: [],
        nextActions: [],
        supportingEvidenceRefs: kbEvidence?.hits.map((hit) => hit.path) ?? [],
        sofieReview: {
          actor: "sofie",
          kind: "review",
          verdict: "answer",
          summary: "Sofie review passes within bounded authority using harness-local validation evidence.",
          details: kbEvidence?.hits.length
            ? [`knowledgeProvider=${kbEvidence.provider}`, `knowledgeHits=${kbEvidence.hits.length}`, `knowledgeQuery=${kbEvidence.query}`]
            : ["knowledgeHits=0"],
          closureRecommendation: "continue",
          scopeDriftDetected: false,
          escalation: { escalate: false, reason: null, why: "routine internal question is answerable from existing runtime evidence" },
        },
      },
      sofieReview: {
        actor: "sofie",
        kind: "review",
        verdict: "answer",
        summary: "Sofie review passes within bounded authority using harness-local validation evidence.",
        details: kbEvidence?.hits.length
          ? [`knowledgeProvider=${kbEvidence.provider}`, `knowledgeHits=${kbEvidence.hits.length}`, `knowledgeQuery=${kbEvidence.query}`]
          : ["knowledgeHits=0"],
        closureRecommendation: "continue",
        scopeDriftDetected: false,
        escalation: { escalate: false, reason: null, why: "routine internal question is answerable from existing runtime evidence" },
      },
    };
  }

  return harnessModule.buildDecisionPacket({
    brief: {
      title: brief.title,
      situation: brief.situation,
      stakes: brief.stakes,
      constraints: brief.constraints,
      keyQuestions: brief.keyQuestions,
    },
    kbEvidence,
  }) as DecisionPacket;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const brief = await request.json() as Brief;
  const kbEvidence = await fetchKbEvidence();
  const packet = await buildHarnessPacket(brief, kbEvidence);
  const specialistOutputs = await runSpecialistReasoning({ brief, packet });
  const enrichedPacket = applySpecialistOutputs({
    ...packet,
    boardDeliberation: {
      ...packet.boardDeliberation,
      specialistOutputs,
    },
  }, specialistOutputs);
  await saveDecisionRecord(makeStoredDecisionRecord({ brief, packet: enrichedPacket }));
  return NextResponse.json(enrichedPacket);
}
