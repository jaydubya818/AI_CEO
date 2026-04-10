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

export type DecisionOutcomeStatus = "executed" | "deferred" | "reversed" | "validated" | "invalidated";

export type DecisionOutcome = {
  status: DecisionOutcomeStatus;
  outcomeNotes: string;
  changedSinceDecision: string;
  updatedAt: string;
};

export type ProviderExecutionTrace = {
  provider: string;
  mode: "blocked" | "fallback" | "live";
  model?: string;
  latencyMs?: number;
  usedFallback: boolean;
  blockedReason?: string | null;
};

export type ProposalReviewStatus = "proposed" | "under_review" | "approved" | "rejected" | "executed";
export type PromotionKind = "memory" | "expertise";

export type ReviewedPromotionPayload = {
  targetRepo: "AI_CEO";
  promotionKind: PromotionKind;
  decisionId: string;
  title: string;
  summary: string;
  evidenceRefs: string[];
  recommendation: string;
  kbWritebackContract: {
    suggestedCommand: string;
    targetPath: string;
    reviewRequired: true;
  };
};

export type ReviewerRole = "reviewer" | "governance-admin";

export type ReviewerIdentity = {
  id: string;
  displayName: string;
  role: ReviewerRole;
};

export type PromotionAuditEntry = {
  reviewer: string;
  reviewerId?: string;
  reviewerRole?: ReviewerRole;
  action: "approve" | "reject" | "execute-writeback" | "ingest-reviewed";
  rationale: string;
  at: string;
};

export type WritebackExecution = {
  executedAt: string;
  targetPath: string;
  bytesWritten: number;
  ingestResponse?: {
    ingested: boolean;
    ingestRecordPath: string;
    canonicalPath: string;
  } | null;
};

export type MemoryPromotionProposal = {
  id: string;
  decisionId: string;
  kind: "memory";
  title: string;
  summary: string;
  evidenceRefs: string[];
  status: ProposalReviewStatus;
  reviewNotes?: string;
  approvedPayload: ReviewedPromotionPayload | null;
  audit: PromotionAuditEntry[];
  writeback?: WritebackExecution | null;
  createdAt: string;
  reviewedAt?: string;
};

export type ExpertiseUpdateProposal = {
  id: string;
  decisionId: string;
  kind: "expertise";
  title: string;
  summary: string;
  evidenceRefs: string[];
  status: ProposalReviewStatus;
  reviewNotes?: string;
  approvedPayload: ReviewedPromotionPayload | null;
  audit: PromotionAuditEntry[];
  writeback?: WritebackExecution | null;
  createdAt: string;
  reviewedAt?: string;
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

export type BoardRound = {
  id: string;
  round: number;
  phase: "broadcast" | "targeted-reply";
  role: string;
  target: "all" | string;
  summary: string;
};

export type FinalPosition = {
  role: string;
  recommendation: string;
  strongestRationale: string;
  keyRisk: string;
  conditionThatChangesView: string;
  confidence: number;
};

export type SpecialistOutput = {
  role: "Product Strategist" | "Revenue Agent" | "Technical Architect" | "Contrarian";
  recommendation: string;
  strongestRationale: string;
  keyRisk: string;
  conditionThatChangesView: string;
  confidence: number;
};

export type BoardTension = {
  id: string;
  between: [string, string];
  description: string;
  resolution?: string;
};

export type DecisionPacket = {
  brief: Pick<Brief, "id" | "title" | "situation" | "stakes" | "constraints" | "keyQuestions">;
  kbEvidence: {
    provider: string;
    query: string;
    hits: Array<{
      path: string;
      title?: string;
      snippet: string;
      score?: number;
    }>;
  } | null;
  recommendation: {
    summary: string;
    rationale: string[];
    missingEvidence: string[];
    confidence: number;
  };
  boardDeliberation: {
    ceoFrame: string;
    boardRounds: BoardRound[];
    finalPositions: FinalPosition[];
    stanceMatrix: Array<{
      role: string;
      stance: "support" | "conditional" | "dissent";
      confidence: number;
      keyRisk: string;
    }>;
    resolvedTensions: BoardTension[];
    unresolvedTensions: BoardTension[];
    recommendation: string;
    risks: string[];
    nextActions: string[];
    supportingEvidenceRefs: string[];
    specialistOutputs?: SpecialistOutput[];
    specialistTrace?: ProviderExecutionTrace;
    sofieReview: {
      actor: "sofie";
      kind: string;
      verdict: string;
      summary: string;
      details: string[];
      closureRecommendation: string;
      scopeDriftDetected: boolean;
      escalation: {
        escalate: boolean;
        reason: string | null;
        why: string;
      };
    };
  };
  sofieReview: {
    actor: "sofie";
    kind: string;
    verdict: string;
    summary: string;
    details: string[];
    closureRecommendation: string;
    scopeDriftDetected: boolean;
    escalation: {
      escalate: boolean;
      reason: string | null;
      why: string;
    };
  };
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

export type DecisionTimelineEvent = {
  id: string;
  at: string;
  type:
    | "decision_created"
    | "outcome_updated"
    | "memory_proposed"
    | "memory_reviewed"
    | "expertise_proposed"
    | "expertise_reviewed";
  summary: string;
};

export type StoredDecisionRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  brief: Brief;
  packet: DecisionPacket;
  outcome: DecisionOutcome | null;
  memoryProposal: MemoryPromotionProposal | null;
  expertiseProposal: ExpertiseUpdateProposal | null;
  timeline: DecisionTimelineEvent[];
  activeExpertise: string[];
  executionFollowThrough?: {
    owner: string;
    status: "planned" | "in_progress" | "done";
    nextCheckpoint: string;
  } | null;
  outcomeLearning?: {
    learningSummary: string;
    promoted: boolean;
  } | null;
  cadenceKey?: string;
};

export type GovernanceQueueItem = {
  decisionId: string;
  title: string;
  kind: PromotionKind;
  status: ProposalReviewStatus;
  reviewedAt: string | null;
  writebackExecuted: boolean;
  requiredApprovals: number;
  approvals: number;
};

export type DecisionComparisonRow = {
  id: string;
  title: string;
  recommendation: string;
  confidence: number;
  outcomeStatus: DecisionOutcomeStatus | "pending";
  domain: string;
  changedSinceDecision: string;
  specialistSummary?: string;
  cadenceKey?: string;
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
