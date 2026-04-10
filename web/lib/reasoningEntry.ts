export type SpecialistReasoningConfig = {
  provider: "disabled" | "stub";
  specialists: Array<{
    role: string;
    enabled: boolean;
    reasonerKey: string;
  }>;
};

export const specialistReasoningConfig: SpecialistReasoningConfig = {
  provider: "stub",
  specialists: [
    { role: "Product Strategist", enabled: true, reasonerKey: "product-strategist-v1" },
    { role: "Revenue Agent", enabled: true, reasonerKey: "revenue-agent-v1" },
    { role: "Technical Architect", enabled: true, reasonerKey: "technical-architect-v1" },
  ],
};
