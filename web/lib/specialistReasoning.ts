import type { Brief, DecisionPacket, FinalPosition } from "./types";

export type SpecialistRole = "Product Strategist" | "Revenue Agent" | "Technical Architect" | "Contrarian";

export type SpecialistOutput = {
  role: SpecialistRole;
  recommendation: string;
  strongestRationale: string;
  keyRisk: string;
  conditionThatChangesView: string;
  confidence: number;
};

export type SpecialistReasoner = (input: {
  role: SpecialistRole;
  brief: Pick<Brief, "title" | "situation" | "stakes" | "constraints" | "keyQuestions">;
  kbSnippet?: string;
}) => Promise<SpecialistOutput>;

const specialistPrompts: Record<SpecialistRole, string> = {
  "Product Strategist": "Focus on sequencing, product coherence, and roadmap displacement.",
  "Revenue Agent": "Focus on customer timing, commercial leverage, and promise risk.",
  "Technical Architect": "Focus on technical plausibility, bottlenecks, and implementation realism.",
  Contrarian: "Stress-test assumptions, false certainty, and hidden downside.",
};

function deterministicFallback(input: {
  role: SpecialistRole;
  brief: Pick<Brief, "title" | "situation" | "stakes" | "constraints" | "keyQuestions">;
  kbSnippet?: string;
}): SpecialistOutput {
  const question = input.brief.keyQuestions[0] ?? "What is the smallest safe next step?";
  const rolePrefix = input.role;
  return {
    role: input.role,
    recommendation: `${rolePrefix}: support a bounded move on ${input.brief.title}.`,
    strongestRationale: `${specialistPrompts[input.role]} Situation: ${input.brief.situation}${input.kbSnippet ? ` KB: ${input.kbSnippet}` : ""}`,
    keyRisk: `${rolePrefix}: ${input.brief.stakes}`,
    conditionThatChangesView: `${rolePrefix}: revise if evidence changes the answer to ${question}`,
    confidence: input.role === "Contrarian" ? 67 : input.role === "Technical Architect" ? 74 : input.role === "Revenue Agent" ? 79 : 76,
  };
}

async function envBackedReasoner(input: {
  role: SpecialistRole;
  brief: Pick<Brief, "title" | "situation" | "stakes" | "constraints" | "keyQuestions">;
  kbSnippet?: string;
}): Promise<SpecialistOutput> {
  const provider = process.env.AI_CEO_SPECIALIST_PROVIDER ?? "stub";
  if (provider === "stub") return deterministicFallback(input);

  return deterministicFallback(input);
}

export async function runSpecialistReasoning(input: {
  brief: Pick<Brief, "title" | "situation" | "stakes" | "constraints" | "keyQuestions">;
  packet: DecisionPacket;
  reasoner?: SpecialistReasoner;
}): Promise<SpecialistOutput[]> {
  const reasoner = input.reasoner ?? envBackedReasoner;
  const kbSnippet = input.packet.kbEvidence?.hits[0]?.snippet;
  const roles: SpecialistRole[] = ["Product Strategist", "Revenue Agent", "Technical Architect", "Contrarian"];
  return await Promise.all(roles.map((role) => reasoner({ role, brief: input.brief, kbSnippet })));
}

export function applySpecialistOutputs(packet: DecisionPacket, outputs: SpecialistOutput[]): DecisionPacket {
  const specialistLines = outputs.map((output) => `${output.role}: ${output.recommendation}`);
  const refinedFinalPositions: FinalPosition[] = packet.boardDeliberation.finalPositions.map((position) => {
    const specialist = outputs.find((output) => output.role === position.role);
    return specialist
      ? {
          role: position.role,
          recommendation: specialist.recommendation,
          strongestRationale: specialist.strongestRationale,
          keyRisk: specialist.keyRisk,
          conditionThatChangesView: specialist.conditionThatChangesView,
          confidence: specialist.confidence,
        }
      : position;
  });

  const extraRisks = outputs.map((output) => `${output.role}: ${output.keyRisk}`);
  const extraActions = outputs.map((output) => `${output.role}: test condition — ${output.conditionThatChangesView}`);
  const contrarian = outputs.find((output) => output.role === "Contrarian");
  const tensions = contrarian
    ? [...packet.boardDeliberation.unresolvedTensions, {
        id: "specialist-contrarian-tension",
        between: ["CEO", "Contrarian"] as [string, string],
        description: contrarian.keyRisk,
      }]
    : packet.boardDeliberation.unresolvedTensions;

  return {
    ...packet,
    recommendation: {
      ...packet.recommendation,
      summary: `${packet.recommendation.summary} Specialist refinement: ${specialistLines.join(" | ")}`,
    },
    boardDeliberation: {
      ...packet.boardDeliberation,
      ceoFrame: `${packet.boardDeliberation.ceoFrame} Specialist views: ${specialistLines.join(" | ")}`,
      recommendation: `${packet.boardDeliberation.recommendation} Specialist refinement applied.`,
      finalPositions: refinedFinalPositions,
      nextActions: [...packet.boardDeliberation.nextActions, ...extraActions],
      risks: [...packet.boardDeliberation.risks, ...extraRisks],
      unresolvedTensions: tensions,
    },
  };
}
