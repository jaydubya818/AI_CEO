import type { DecisionPacket } from "./types";
import { specialistReasoningConfig } from "./reasoningEntry";

export function applyRuntimeExpertise(packet: DecisionPacket, activeExpertise: string[]): DecisionPacket {
  if (activeExpertise.length === 0) return packet;
  const expertiseNote = activeExpertise.join(" | ");
  return {
    ...packet,
    boardDeliberation: {
      ...packet.boardDeliberation,
      ceoFrame: `${packet.boardDeliberation.ceoFrame} Active expertise: ${expertiseNote}. Specialist seam: ${specialistReasoningConfig.specialists.filter((entry) => entry.enabled).map((entry) => `${entry.role}:${entry.reasonerKey}`).join(" | ")}`,
      finalPositions: packet.boardDeliberation.finalPositions.map((position) =>
        position.role === "Technical Architect" || position.role === "Compounder"
          ? {
              ...position,
              strongestRationale: `${position.strongestRationale} Applied expertise: ${expertiseNote}`,
              confidence: Math.min(95, position.confidence + 4),
            }
          : position,
      ),
      stanceMatrix: packet.boardDeliberation.stanceMatrix.map((stance) =>
        stance.role === "Technical Architect" || stance.role === "Compounder"
          ? { ...stance, confidence: Math.min(95, stance.confidence + 4) }
          : stance,
      ),
      nextActions: [...packet.boardDeliberation.nextActions, `Apply approved expertise: ${expertiseNote}`],
    },
  };
}
