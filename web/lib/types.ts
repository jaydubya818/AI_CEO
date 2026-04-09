export type NavItem = { id: string; label: string };

export type Freshness = "fresh" | "aging" | "stale";

export type Reversibility = "reversible" | "irreversible";

export type TelemetryEvent =
  | "ask_submitted"
  | "decision_selected"
  | "evidence_opened"
  | "action_lane_changed"
  | "risk_link_navigate"
  | "decision_committed"
  | "board_sim_opened"
  | "delegation_suggested"
  | "replay_opened"
  | "deliberation_started"
  | "deliberation_complete"
  | "brief_submitted"
  | "brief_rejected"
  | "deliberation_sent_to_inbox"
  | "board_sim_generate_brief";

export type Metric = {
  label: string;
  value: string;
  delta: string;
  note: string;
  trend: number[];
};

export type Citation = {
  id: string;
  source: string;
  updatedMins: number;
  relevance: number;
};

export type Risk = {
  id: string;
  title: string;
  severity: string;
  confidence: number;
  owner: string;
  horizon: string;
  relatedDecisionId: string;
  relatedActionLane: string;
  relatedMeeting: string;
  approvalRef: string;
  citations: Citation[];
};

export type DecisionOption = {
  title: string;
  result: string;
};

export type Decision = {
  id: string;
  title: string;
  type: string;
  urgency: string;
  owner: string;
  deadline: string;
  framing: string;
  options: DecisionOption[];
  recommendation: string;
  confidence: number;
  assumptions: string;
  confidenceHistory14d: number[];
  reversibility: Reversibility;
  strongestCaseAgainst: string;
  missingEvidence: string;
  delegateTo?: string;
  cabinetComposition: string[];
};

export type DecisionReplay = {
  id: string;
  decisionTitle: string;
  quarter: string;
  systemRecommendation: string;
  humanChoice: string;
  outcome: string;
  calibrationHeld: boolean;
};

export type BoardSimQuestion = {
  id: string;
  question: string;
  weakArea: boolean;
  suggestedResponse: string;
};

export type AttentionScore = {
  score: number;
  pendingApprovals: number;
  openDecisions: number;
  blockedActions: number;
  staleSources: number;
  contradictions: number;
  unresolvedRisks: number;
};

export type DelegationSuggestion = {
  decisionId: string;
  suggestedOwner: string;
  rationale: string;
  contextPackage: string[];
  escalationDeadline: string;
};

export type AgentRole = "specialist" | "contrarian" | "moonshot" | "judge" | "revenue" | "compounder";

// ─── Deliberation System ────────────────────────────────────────────────────

export type DeliberationMessageType = "broadcast" | "response" | "closing" | "system";

export type DeliberationMessage = {
  id: string;
  from: string;
  to: string;            // "all" | specific agent name
  type: DeliberationMessageType;
  content: string;
  round: number;
  tokenCost: number;     // cents
  hasSvg?: boolean;
};

export type AgentStance = {
  agentName: string;
  position: "support" | "dissent" | "conditional";
  summary: string;
  closingStatement: string;
  confidence: number;
};

export type Tension = {
  id: string;
  between: [string, string];
  description: string;
  resolved: boolean;
  resolution?: string;
};

export type DeliberationConstraint = {
  timeLimitMins: number;
  timeElapsedMins: number;
  dollarBudget: number;
  dollarSpent: number;
  contextLimit: number;   // tokens (1M)
  contextUsed: number;
  roundsCompleted: number;
  maxRounds: number;
};

export type DeliberationSession = {
  id: string;
  briefTitle: string;
  briefId: string;
  status: "running" | "complete" | "constraint-hit";
  messages: DeliberationMessage[];
  stances: AgentStance[];
  tensions: Tension[];
  constraint: DeliberationConstraint;
  memoPath?: string;
  recommendation: string;
  voteTally: Record<string, "support" | "dissent" | "conditional">;
};

// ─── Brief Builder ───────────────────────────────────────────────────────────

export type BriefSection = "situation" | "stakes" | "constraints" | "keyQuestions";

export type Brief = {
  id: string;
  title: string;
  situation: string;
  stakes: string;
  constraints: string;
  keyQuestions: string[];
  additionalContext?: string;
  createdAt: string;
  valid: boolean;
  validationErrors: BriefSection[];
};

// ─── Agent Expertise ─────────────────────────────────────────────────────────

export type AgentExpertise = {
  agentName: string;
  tokenCount: number;
  allyAgents: string[];
  rivalAgents: string[];
  keyPatterns: string[];
  decisionsBriefed: number;
  lastUpdated: string;
};

export type AgentSummary = {
  name: string;
  focus: string;
  recommendation: string;
  confidence: number;
  role: AgentRole;
  dissent?: string;
  decisionTypes?: string[];
  model?: string;
  temperament?: string;
  reasoning?: string;
};

export type StoryStep = {
  title: string;
  description: string;
  apply: {
    section: string;
    riskId: string;
    decisionId: string;
    actionLane: string;
  };
};

export type TelemetryLog = {
  id: number;
  event: TelemetryEvent;
  meta: string;
  time: string;
};

export type GateChecks = {
  assumptionsReviewed: boolean;
  evidenceVerified: boolean;
  ownerAligned: boolean;
};

// ─── Prompt Routing ───────────────────────────────────────────────────────────
export type PromptComplexity = "low" | "mid" | "high";

export type ModelTier = "haiku" | "sonnet" | "opus";

export type PromptRoute = {
  id: string;
  prompt: string;                // truncated for display
  complexity: PromptComplexity;
  classifierConfidence: number;  // 0–1
  model: ModelTier;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  costUsd: number;
  timestamp: string;
  fallback?: boolean;            // true if primary model was over latency budget
};

export type RouterRule = {
  name: string;
  condition: string;
  action: string;
  active: boolean;
};

export type RouterStats = {
  totalRouted: number;
  lowPct: number;
  midPct: number;
  highPct: number;
  avgCostSavingsPct: number;     // vs always-opus baseline
  driftDetected: boolean;
  driftNote?: string;
  lastRetrained: string;
};

export type ClassifierFeature = {
  name: string;
  weight: number;                // relative importance 0–1
  description: string;
};
