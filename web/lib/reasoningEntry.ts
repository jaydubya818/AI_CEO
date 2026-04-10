export type SpecialistReasoningConfig = {
  provider: "disabled" | "stub" | "openai-compatible";
  enabled: boolean;
  allowLiveProvider: boolean;
  specialists: Array<{
    role: string;
    enabled: boolean;
    reasonerKey: string;
  }>;
};

export function getSpecialistReasoningConfig(): SpecialistReasoningConfig {
  const provider = (process.env.AI_CEO_SPECIALIST_PROVIDER ?? "stub") as SpecialistReasoningConfig["provider"];
  const disabledRoles = (process.env.AI_CEO_SPECIALIST_DISABLED_ROLES ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return {
    provider,
    enabled: process.env.AI_CEO_SPECIALIST_ENABLED !== "0",
    allowLiveProvider: process.env.AI_CEO_SPECIALIST_ALLOW_LIVE === "1",
    specialists: [
      { role: "Product Strategist", enabled: !disabledRoles.includes("Product Strategist"), reasonerKey: "product-strategist-v1" },
      { role: "Revenue Agent", enabled: !disabledRoles.includes("Revenue Agent"), reasonerKey: "revenue-agent-v1" },
      { role: "Technical Architect", enabled: !disabledRoles.includes("Technical Architect"), reasonerKey: "technical-architect-v1" },
      { role: "Contrarian", enabled: !disabledRoles.includes("Contrarian"), reasonerKey: "contrarian-v1" },
    ],
  };
}
