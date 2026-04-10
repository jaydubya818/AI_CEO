import type { Brief, DecisionPacket, SpecialistOutput } from "./types";
import { getSpecialistReasoningConfig } from "./reasoningEntry";

export type SpecialistExecutionPolicy = {
  enabled: boolean;
  provider: "disabled" | "stub" | "openai-compatible";
  mode: "blocked" | "fallback" | "live";
  allowedRoles: string[];
  blockedReason: string | null;
};

export function resolveSpecialistExecutionPolicy(input: {
  brief: Pick<Brief, "title" | "constraints">;
  packet: DecisionPacket;
}): SpecialistExecutionPolicy {
  const config = getSpecialistReasoningConfig();
  if (!config.enabled) {
    return { enabled: false, provider: config.provider, mode: "blocked", allowedRoles: [], blockedReason: "specialist reasoning disabled by config" };
  }
  if (!input.packet.kbEvidence?.hits.length) {
    return { enabled: true, provider: config.provider, mode: "fallback", allowedRoles: config.specialists.filter((s) => s.enabled).map((s) => s.role), blockedReason: "no kb evidence; using fallback" };
  }
  if (config.provider === "disabled") {
    return { enabled: false, provider: config.provider, mode: "blocked", allowedRoles: [], blockedReason: "provider disabled" };
  }
  if (config.provider === "openai-compatible" && config.allowLiveProvider) {
    return { enabled: true, provider: config.provider, mode: "live", allowedRoles: config.specialists.filter((s) => s.enabled).map((s) => s.role), blockedReason: null };
  }
  return { enabled: true, provider: config.provider, mode: "fallback", allowedRoles: config.specialists.filter((s) => s.enabled).map((s) => s.role), blockedReason: config.provider === "stub" ? null : "live provider not allowed; using fallback" };
}

export function validateSpecialistOutputs(outputs: SpecialistOutput[]): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const output of outputs) {
    if (!output.recommendation.trim()) errors.push(`${output.role}: missing recommendation`);
    if (!output.strongestRationale.trim()) errors.push(`${output.role}: missing strongest rationale`);
    if (!output.keyRisk.trim()) errors.push(`${output.role}: missing key risk`);
    if (!output.conditionThatChangesView.trim()) errors.push(`${output.role}: missing condition that changes the view`);
    if (typeof output.confidence !== "number") errors.push(`${output.role}: missing confidence`);
  }
  return { ok: errors.length === 0, errors };
}
