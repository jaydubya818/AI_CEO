import type { DecisionPacket } from "./types";

export function packetToDecisionSummary(packet: DecisionPacket) {
  return {
    title: packet.brief.title,
    recommendation: packet.recommendation.summary,
    confidence: packet.recommendation.confidence,
    missingEvidence: packet.recommendation.missingEvidence.join(" "),
  };
}
