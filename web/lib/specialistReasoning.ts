import type { Brief, DecisionPacket, FinalPosition, ProviderExecutionTrace } from "./types";
import { getSpecialistReasoningConfig } from "./reasoningEntry";
import { resolveSpecialistExecutionPolicy, validateSpecialistOutputs } from "./specialistPolicy";
import { runOpenAiCompatibleSpecialist } from "./specialistProvider";

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

export async function executeSpecialistWithTrace(input: {
  role: SpecialistRole;
  brief: Pick<Brief, "title" | "situation" | "stakes" | "constraints" | "keyQuestions">;
  kbSnippet?: string;
}): Promise<{ output: SpecialistOutput; trace: ProviderExecutionTrace }> {
  const config = getSpecialistReasoningConfig();
  const startedAt = Date.now();
  if (config.provider === "openai-compatible" && config.allowLiveProvider) {
    try {
      const output = await runOpenAiCompatibleSpecialist(input);
      return {
        output,
        trace: {
          provider: "openai-compatible",
          mode: "live",
          model: process.env.AI_CEO_SPECIALIST_MODEL ?? "gpt-4o-mini",
          latencyMs: Date.now() - startedAt,
          usedFallback: false,
          blockedReason: null,
        },
      };
    } catch {
      const output = deterministicFallback(input);
      return {
        output,
        trace: {
          provider: "openai-compatible",
          mode: "fallback",
          model: process.env.AI_CEO_SPECIALIST_MODEL ?? "gpt-4o-mini",
          latencyMs: Date.now() - startedAt,
          usedFallback: true,
          blockedReason: "live provider failed; fallback used",
        },
      };
    }
  }
  const output = deterministicFallback(input);
  return {
    output,
    trace: {
      provider: config.provider,
      mode: config.provider === "disabled" ? "blocked" : "fallback",
      latencyMs: Date.now() - startedAt,
      usedFallback: true,
      blockedReason: config.provider === "disabled" ? "provider disabled" : null,
    },
  };
}

export async function runSpecialistReasoning(input: {
  brief: Pick<Brief, "title" | "situation" | "stakes" | "constraints" | "keyQuestions">;
  packet: DecisionPacket;
  reasoner?: SpecialistReasoner;
}): Promise<SpecialistOutput[]> {
  const policy = resolveSpecialistExecutionPolicy({ brief: input.brief, packet: input.packet });
  if (!policy.enabled || policy.mode === "blocked") return [];

  const reasoner = input.reasoner;
  const kbSnippet = input.packet.kbEvidence?.hits[0]?.snippet;
  const roles = policy.allowedRoles as SpecialistRole[];
  const traces: ProviderExecutionTrace[] = [];
  const outputs = await Promise.all(roles.map(async (role) => {
    if (reasoner) return await reasoner({ role, brief: input.brief, kbSnippet });
    const executed = await executeSpecialistWithTrace({ role, brief: input.brief, kbSnippet });
    traces.push(executed.trace);
    return executed.output;
  }));
  const validation = validateSpecialistOutputs(outputs);
  if (!validation.ok) {
    return roles.map((role) => deterministicFallback({ role, brief: input.brief, kbSnippet }));
  }
  return outputs.map((output) => output);
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
      specialistOutputs: outputs,
      specialistTrace: outputs.length > 0 ? {
        provider: getSpecialistReasoningConfig().provider,
        mode: getSpecialistReasoningConfig().provider === "openai-compatible" && getSpecialistReasoningConfig().allowLiveProvider ? "live" : "fallback",
        model: process.env.AI_CEO_SPECIALIST_MODEL,
        usedFallback: !(getSpecialistReasoningConfig().provider === "openai-compatible" && getSpecialistReasoningConfig().allowLiveProvider),
        blockedReason: null,
      } : {
        provider: getSpecialistReasoningConfig().provider,
        mode: "blocked",
        usedFallback: false,
        blockedReason: "specialist reasoning blocked",
      },
    },
  };
}
