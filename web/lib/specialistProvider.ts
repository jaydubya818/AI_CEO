import type { Brief } from "./types";
import type { SpecialistOutput, SpecialistRole } from "./specialistReasoning";

export async function runOpenAiCompatibleSpecialist(input: {
  role: SpecialistRole;
  brief: Pick<Brief, "title" | "situation" | "stakes" | "constraints" | "keyQuestions">;
  kbSnippet?: string;
}): Promise<SpecialistOutput> {
  const baseUrl = process.env.AI_CEO_SPECIALIST_BASE_URL;
  const apiKey = process.env.AI_CEO_SPECIALIST_API_KEY;
  const model = process.env.AI_CEO_SPECIALIST_MODEL ?? "gpt-4o-mini";
  if (!baseUrl || !apiKey) {
    throw new Error("Missing AI_CEO specialist provider config");
  }

  const prompt = [
    `You are the ${input.role}.`,
    `Return strict JSON with keys: recommendation, strongest_rationale, key_risk, condition_that_changes_the_view, confidence.`,
    `Title: ${input.brief.title}`,
    `Situation: ${input.brief.situation}`,
    `Stakes: ${input.brief.stakes}`,
    `Constraints: ${input.brief.constraints}`,
    `Key Questions: ${input.brief.keyQuestions.join(" | ")}`,
    input.kbSnippet ? `KB: ${input.kbSnippet}` : "",
  ].filter(Boolean).join("\n");

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a bounded specialist reasoner. Do not add extra keys." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Specialist provider failed with ${response.status}`);
  }

  const payload = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("Missing provider response content");
  const parsed = JSON.parse(content) as {
    recommendation: string;
    strongest_rationale: string;
    key_risk: string;
    condition_that_changes_the_view: string;
    confidence: number;
  };

  return {
    role: input.role,
    recommendation: parsed.recommendation,
    strongestRationale: parsed.strongest_rationale,
    keyRisk: parsed.key_risk,
    conditionThatChangesView: parsed.condition_that_changes_the_view,
    confidence: Number(parsed.confidence),
  };
}
