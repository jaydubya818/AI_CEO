import type { Decision, DecisionComparisonRow, DecisionOutcomeStatus, DecisionPacket, DelegationSuggestion, GateChecks, GovernanceQueueItem, PromotionKind, ReviewerIdentity, StoredDecisionRecord } from "@/lib/types";
import { CheckCircle2, Circle, GitBranch, SlidersHorizontal, Sparkles, UserCheck } from "lucide-react";
import { AssumptionChip } from "../ui/AssumptionChip";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { ConfidenceBadge } from "../ui/ConfidenceBadge";
import { DecisionOptionCard } from "../ui/DecisionOptionCard";
import { ReversibilityBadge } from "../ui/ReversibilityBadge";
import { SectionHeader } from "../ui/SectionHeader";
import { Sparkline } from "../ui/Sparkline";
import { StrongestCaseAgainst } from "../ui/StrongestCaseAgainst";

export function DecisionsSection({
  decisions,
  selectedDecision,
  selectedDecisionId,
  headcountDelta,
  deliveryFocus,
  riskTolerance,
  scenarioConfidence,
  confidenceThreshold,
  gateChecks,
  qualityGatePassed,
  delegationSuggestions,
  onDecisionSelect,
  onHeadcountChange,
  onDeliveryFocusChange,
  onRiskToleranceChange,
  onConfidenceThresholdChange,
  onGateChange,
  onCommitDecision,
  onOpenActions,
  packet,
  decisionHistory,
  decisionComparison,
  historyStatusFilter,
  historyQuery,
  onHistoryStatusFilterChange,
  onHistoryQueryChange,
  onReopenDecision,
  onUpdateOutcome,
  onPromoteMemory,
  onProposeExpertise,
  onReviewPromotion,
  onExecuteWriteback,
  onExecuteReviewedIngest,
  governanceQueue,
  governanceStatusFilter,
  governanceKindFilter,
  onGovernanceStatusFilterChange,
  onGovernanceKindFilterChange,
  activeReviewer,
  reviewers,
  onReviewerChange,
}: {
  decisions: Decision[];
  selectedDecision: Decision;
  selectedDecisionId: string;
  headcountDelta: number;
  deliveryFocus: number;
  riskTolerance: number;
  scenarioConfidence: number;
  confidenceThreshold: number;
  gateChecks: GateChecks;
  qualityGatePassed: boolean;
  delegationSuggestions: DelegationSuggestion[];
  onDecisionSelect: (id: string, title: string) => void;
  onHeadcountChange: (value: number) => void;
  onDeliveryFocusChange: (value: number) => void;
  onRiskToleranceChange: (value: number) => void;
  onConfidenceThresholdChange: (value: number) => void;
  onGateChange: (next: GateChecks) => void;
  onCommitDecision: () => void;
  onOpenActions: () => void;
  packet?: DecisionPacket | null;
  decisionHistory: StoredDecisionRecord[];
  decisionComparison: DecisionComparisonRow[];
  historyStatusFilter: string;
  historyQuery: string;
  onHistoryStatusFilterChange: (value: string) => void;
  onHistoryQueryChange: (value: string) => void;
  onReopenDecision: (record: StoredDecisionRecord) => void;
  onUpdateOutcome: (
    decisionId: string,
    status: DecisionOutcomeStatus,
    outcomeNotes: string,
    changedSinceDecision: string,
  ) => void;
  onPromoteMemory: (decisionId: string, title: string, summary: string) => void;
  onProposeExpertise: (decisionId: string, title: string, summary: string) => void;
  onReviewPromotion: (decisionId: string, kind: PromotionKind, action: "approve" | "reject" | "request-second-review", reviewNotes: string) => void;
  onExecuteWriteback: (decisionId: string, kind: PromotionKind) => void;
  onExecuteReviewedIngest: (decisionId: string, kind: PromotionKind) => void;
  governanceQueue: GovernanceQueueItem[];
  governanceStatusFilter: string;
  governanceKindFilter: string;
  onGovernanceStatusFilterChange: (value: string) => void;
  onGovernanceKindFilterChange: (value: string) => void;
  activeReviewer: ReviewerIdentity;
  reviewers: ReviewerIdentity[];
  onReviewerChange: (reviewerId: string) => void;
}) {
  return (
    <section id="decisions" className="scroll-mt-28">
      <SectionHeader
        title="Decisions"
        subtitle="Decision workspace with options, tradeoffs, and recommendation clarity."
        actionLabel="Create Action Plan"
        onAction={onOpenActions}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <Card title="Decision Inbox" right="8 open">
            <div className="space-y-3">
              {decisions.map((decision) => (
                <button
                  key={decision.id}
                  className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                    selectedDecisionId === decision.id
                      ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.07]"
                  }`}
                  onClick={() => onDecisionSelect(decision.id, decision.title)}
                >
                  <p className="font-medium">{decision.title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {decision.type} · {decision.urgency} · {decision.owner}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-500/[0.06] p-3">
              <p className="text-xs text-cyan-100">
                Recommendation: prioritize decisions with confidence in the 65-80% band where more evidence can quickly de-risk outcomes.
              </p>
            </div>
          </Card>
        </div>
        <div className="xl:col-span-8">
          <Card title={`Selected Decision: ${selectedDecision.title}`} right={`Owner: ${selectedDecision.owner}`}>
            <div className="mb-3 flex flex-wrap gap-2">
              <ConfidenceBadge value={selectedDecision.confidence} />
              <ReversibilityBadge value={selectedDecision.reversibility} />
              <AssumptionChip text={selectedDecision.assumptions} />
              <Badge variant="accent">{selectedDecision.urgency}</Badge>
            </div>
            <p className="mb-4 text-sm leading-6 text-slate-300">{selectedDecision.framing}</p>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <DecisionOptionCard title={selectedDecision.options[0]?.title ?? ""} result={selectedDecision.options[0]?.result ?? ""} />
              <DecisionOptionCard
                title={selectedDecision.options[1]?.title ?? ""}
                result={selectedDecision.options[1]?.result ?? ""}
                recommended
              />
            </div>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
              Recommendation: <span className="text-slate-100">{packet?.recommendation.summary ?? selectedDecision.recommendation}</span>
            </div>
            {packet && (
              <div className="mt-3 space-y-3">
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/[0.07] p-3 text-xs text-cyan-100">
                  Sofie: {packet.sofieReview.summary}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
                  <p className="mb-2 uppercase tracking-wider text-slate-500">Board recommendation</p>
                  <p className="text-slate-100">{packet.boardDeliberation.recommendation}</p>
                  <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div>
                      <p className="text-slate-500">Top risk</p>
                      <p>{packet.boardDeliberation.risks[0] ?? "None recorded"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Next action</p>
                      <p>{packet.boardDeliberation.nextActions[0] ?? "None recorded"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Evidence refs</p>
                      <p>{packet.boardDeliberation.supportingEvidenceRefs.join(", ") || "None"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-3">
              <StrongestCaseAgainst
                dissent={selectedDecision.strongestCaseAgainst}
                missingEvidence={selectedDecision.missingEvidence}
              />
            </div>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Dynamic cabinet for this decision</p>
              <div className="flex flex-wrap gap-2">
                {selectedDecision.cabinetComposition.map((agent) => (
                  <span key={agent} className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs text-slate-300">
                    {agent}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-xs uppercase tracking-wider text-slate-500">Confidence history (last 14 days)</p>
              <Sparkline points={selectedDecision.confidenceHistory14d} stroke="rgba(139,92,246,0.95)" />
              <p className="mt-2 text-xs text-slate-400">
                Trend: {selectedDecision.confidenceHistory14d[0]}% to{" "}
                {selectedDecision.confidenceHistory14d[selectedDecision.confidenceHistory14d.length - 1]}%
              </p>
            </div>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs uppercase tracking-wider text-slate-500">Decision readiness</p>
                <p className="text-xs text-slate-300">{scenarioConfidence.toFixed(1)} / 100</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${
                    scenarioConfidence >= confidenceThreshold ? "bg-emerald-300" : "bg-amber-300"
                  }`}
                  style={{ width: `${Math.max(0, Math.min(100, scenarioConfidence))}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Suggestion:{" "}
                {scenarioConfidence >= confidenceThreshold
                  ? "you can commit now; keep owner/accountability explicit in the action plan."
                  : "gather one more evidence packet before commit to avoid avoidable reversals."}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card title="Governance Queue" right={activeReviewer.displayName}>
          <div className="mb-3 grid grid-cols-1 gap-2">
            <select
              value={activeReviewer.id}
              onChange={(e) => onReviewerChange(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200"
            >
              {reviewers.map((reviewer) => (
                <option key={reviewer.id} value={reviewer.id}>{reviewer.displayName} · {reviewer.role}</option>
              ))}
            </select>
            <select
              value={governanceStatusFilter}
              onChange={(e) => onGovernanceStatusFilterChange(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200"
            >
              <option value="all">All governance states</option>
              <option value="proposed">Proposed</option>
              <option value="under_review">Under review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="executed">Executed</option>
            </select>
            <select
              value={governanceKindFilter}
              onChange={(e) => onGovernanceKindFilterChange(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200"
            >
              <option value="all">All proposal kinds</option>
              <option value="memory">Memory</option>
              <option value="expertise">Expertise</option>
            </select>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            {governanceQueue.map((item) => (
              <div key={`${item.decisionId}-${item.kind}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-slate-100">{item.title}</p>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-300">{item.status}</span>
                </div>
                <p className="mt-1 text-slate-500">{item.kind} · approvals {item.approvals}/{item.requiredApprovals} · writeback {item.writebackExecuted ? "executed" : "pending"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={() => onReviewPromotion(item.decisionId, item.kind, "request-second-review", "Escalated for second reviewer")}
                    className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-200">Second review</button>
                  <button onClick={() => onReviewPromotion(item.decisionId, item.kind, "approve", "Approved from governance queue")}
                    className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-200">Approve</button>
                  <button onClick={() => onReviewPromotion(item.decisionId, item.kind, "reject", "Rejected from governance queue")}
                    className="rounded-full border border-rose-400/25 bg-rose-500/10 px-2.5 py-1 text-[10px] text-rose-200">Reject</button>
                  <button onClick={() => onExecuteWriteback(item.decisionId, item.kind)}
                    className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-[10px] text-cyan-200">Writeback</button>
                  <button onClick={() => onExecuteReviewedIngest(item.decisionId, item.kind)}
                    className="rounded-full border border-violet-400/25 bg-violet-500/10 px-2.5 py-1 text-[10px] text-violet-200">Ingest</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Decision History" right={`${decisionHistory.length} stored`}>
          <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-2">
            <select
              value={historyStatusFilter}
              onChange={(e) => onHistoryStatusFilterChange(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="executed">Executed</option>
              <option value="deferred">Deferred</option>
              <option value="reversed">Reversed</option>
              <option value="validated">Validated</option>
              <option value="invalidated">Invalidated</option>
            </select>
            <input
              value={historyQuery}
              onChange={(e) => onHistoryQueryChange(e.target.value)}
              placeholder="Filter recommendation text"
              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-200"
            />
          </div>
          <div className="space-y-3">
            {decisionHistory.slice(0, 8).map((record) => (
              <div key={record.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-slate-100">{record.brief.title}</p>
                    <p className="mt-1 text-slate-500">{new Date(record.updatedAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => onReopenDecision(record)}
                    className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-[10px] text-cyan-200"
                  >
                    Reopen
                  </button>
                </div>
                <p className="mt-2">{record.packet.boardDeliberation.recommendation}</p>
                <p className="mt-1 text-slate-500">Outcome: {record.outcome?.status ?? "pending"}</p>
                <p className="mt-1 text-slate-500">Changed: {record.outcome?.changedSinceDecision ?? "No change recorded"}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {record.memoryProposal && (
                    <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200">Memory {record.memoryProposal.status}</span>
                  )}
                  {record.expertiseProposal && (
                    <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-200">Expertise {record.expertiseProposal.status}</span>
                  )}
                </div>
                {record.timeline.length > 0 && (
                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="mb-2 uppercase tracking-wider text-slate-500">Timeline</p>
                    <div className="space-y-2">
                      {record.timeline.slice(0, 6).map((event) => (
                        <div key={event.id} className="rounded-lg border border-white/10 bg-black/10 p-2">
                          <p className="text-[10px] text-slate-500">{new Date(event.at).toLocaleString()} · {event.type}</p>
                          <p className="mt-1 text-slate-300">{event.summary}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                      {record.memoryProposal?.audit?.length ? (
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">Memory audit</p>
                          {record.memoryProposal.audit.map((entry, index) => (
                            <p key={`${entry.at}-${index}`} className="mt-1 text-[11px] text-slate-300">{entry.reviewer}: {entry.action} — {entry.rationale}</p>
                          ))}
                        </div>
                      ) : null}
                      {record.expertiseProposal?.audit?.length ? (
                        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">Expertise audit</p>
                          {record.expertiseProposal.audit.map((entry, index) => (
                            <p key={`${entry.at}-${index}`} className="mt-1 text-[11px] text-slate-300">{entry.reviewer}: {entry.action} — {entry.rationale}</p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Decision Comparison" right="MVP trend view">
          <div className="space-y-2 text-xs text-slate-300">
            {decisionComparison.slice(0, 5).map((row) => (
              <div key={row.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-slate-100">{row.title}</p>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-300">{row.outcomeStatus}</span>
                </div>
                <p className="mt-1">Confidence: {row.confidence}%</p>
                <p className="mt-1 text-slate-500">{row.recommendation}</p>
                <p className="mt-1 text-slate-500">Changed: {row.changedSinceDecision}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {packet && (
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card title="Outcome Tracking" right="Durable scaffold">
            <div className="space-y-2 text-xs text-slate-300">
              {(["executed", "deferred", "reversed", "validated", "invalidated"] as DecisionOutcomeStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateOutcome(packet.brief.id, status, `${status} via MVP update`, "Updated operating assumptions after review")}
                  className="mr-2 mb-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 hover:bg-white/[0.06]"
                >
                  Mark {status}
                </button>
              ))}
              <p className="text-slate-500">Stores status, notes, and what changed since the decision.</p>
            </div>
          </Card>
          <Card title="Memory Promotion" right="Review-only scaffold">
            <div className="space-y-3 text-xs text-slate-300">
              <p>Promote a bounded learning proposal back toward Agentic-KB review.</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onPromoteMemory(packet.brief.id, `${packet.brief.title} learning`, packet.boardDeliberation.recommendation)}
                  className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-200"
                >
                  Propose memory promotion
                </button>
                <button
                  onClick={() => onProposeExpertise(packet.brief.id, `${packet.brief.title} expertise update`, packet.boardDeliberation.risks[0] ?? packet.boardDeliberation.recommendation)}
                  className="rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-amber-200"
                >
                  Propose expertise update
                </button>
              </div>
              {decisionHistory.find((record) => record.id === packet.brief.id)?.memoryProposal && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-slate-100">Memory proposal</p>
                  <p className="mt-1 text-slate-400">{decisionHistory.find((record) => record.id === packet.brief.id)?.memoryProposal?.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => onReviewPromotion(packet.brief.id, "memory", "approve", "Approved for bounded KB writeback export")}
                      className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-200"
                    >
                      Approve memory
                    </button>
                    <button
                      onClick={() => onReviewPromotion(packet.brief.id, "memory", "reject", "Rejected pending better evidence")}
                      className="rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-rose-200"
                    >
                      Reject memory
                    </button>
                    <button
                      onClick={() => onExecuteWriteback(packet.brief.id, "memory")}
                      className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-200"
                    >
                      Execute writeback
                    </button>
                    <button
                      onClick={() => onExecuteReviewedIngest(packet.brief.id, "memory")}
                      className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-200"
                    >
                      Execute ingest
                    </button>
                  </div>
                </div>
              )}
              {decisionHistory.find((record) => record.id === packet.brief.id)?.expertiseProposal && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-slate-100">Expertise proposal</p>
                  <p className="mt-1 text-slate-400">{decisionHistory.find((record) => record.id === packet.brief.id)?.expertiseProposal?.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => onReviewPromotion(packet.brief.id, "expertise", "approve", "Approved for bounded expertise writeback export")}
                      className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-emerald-200"
                    >
                      Approve expertise
                    </button>
                    <button
                      onClick={() => onReviewPromotion(packet.brief.id, "expertise", "reject", "Rejected pending reviewer changes")}
                      className="rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-1 text-rose-200"
                    >
                      Reject expertise
                    </button>
                    <button
                      onClick={() => onExecuteWriteback(packet.brief.id, "expertise")}
                      className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-cyan-200"
                    >
                      Execute writeback
                    </button>
                    <button
                      onClick={() => onExecuteReviewedIngest(packet.brief.id, "expertise")}
                      className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-violet-200"
                    >
                      Execute ingest
                    </button>
                  </div>
                </div>
              )}
              {(() => {
                const record = decisionHistory.find((entry) => entry.id === packet.brief.id);
                const approvedPayload = record?.memoryProposal?.approvedPayload ?? record?.expertiseProposal?.approvedPayload;
                if (!approvedPayload) return null;
                return (
                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/[0.07] p-3 text-[11px] text-cyan-100">
                    <p className="font-medium">Approved writeback payload</p>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[10px] text-cyan-50">{JSON.stringify(approvedPayload, null, 2)}</pre>
                    <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <div className="rounded-lg border border-white/10 bg-black/10 p-2">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">Artifact diff</p>
                        <p className="mt-1 text-slate-200">Previous recommendation: {selectedDecision.recommendation}</p>
                        <p className="mt-1 text-slate-200">Packet recommendation: {packet.boardDeliberation.recommendation}</p>
                      </div>
                      {record?.memoryProposal?.writeback ? (
                        <div className="rounded-lg border border-white/10 bg-black/10 p-2">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">Memory writeback</p>
                          <p className="mt-1 text-slate-200">{record.memoryProposal.writeback.targetPath}</p>
                        </div>
                      ) : null}
                      {record?.expertiseProposal?.writeback ? (
                        <div className="rounded-lg border border-white/10 bg-black/10 p-2">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">Expertise writeback</p>
                          <p className="mt-1 text-slate-200">{record.expertiseProposal.writeback.targetPath}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>
        </div>
      )}

      {/* Delegation Intelligence */}
      {delegationSuggestions.length > 0 && (
        <div className="mt-4">
          <Card title="Delegation Intelligence" right="CEO attention optimizer">
            <div className="space-y-3">
              {delegationSuggestions.map((d) => {
                const isSelected = d.decisionId === selectedDecisionId;
                return (
                  <div
                    key={d.decisionId}
                    className={`rounded-xl border p-3 text-sm transition ${
                      isSelected
                        ? "border-violet-400/30 bg-violet-500/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <UserCheck className="h-4 w-4 text-violet-300 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-100 font-medium">
                          Delegate to <span className="text-violet-200">{d.suggestedOwner}</span>
                          <span className="ml-2 text-xs text-slate-400">· Escalate by {d.escalationDeadline}</span>
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{d.rationale}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {d.contextPackage.map((item) => (
                            <span key={item} className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-slate-400">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs text-slate-400">
                <GitBranch className="h-3.5 w-3.5 text-violet-300 shrink-0" />
                CEO attention is highest-value on the hiring tradeoff this week. Delegate the rest with a context package.
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="Scenario Mini-Simulators" right="Headcount / Delivery / Risk">
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wider text-slate-500">
                <p>Headcount delta</p>
                <Badge variant="muted">{headcountDelta}</Badge>
              </div>
              <input
                type="range"
                min={-5}
                max={10}
                value={headcountDelta}
                onChange={(e) => onHeadcountChange(Number(e.target.value))}
                className="accent-cyan-300 w-full"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wider text-slate-500">
                <p>Delivery focus</p>
                <Badge variant="muted">{deliveryFocus}</Badge>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={deliveryFocus}
                onChange={(e) => onDeliveryFocusChange(Number(e.target.value))}
                className="accent-cyan-300 w-full"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-wider text-slate-500">
                <p>Risk tolerance</p>
                <Badge variant="muted">{riskTolerance}</Badge>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={riskTolerance}
                onChange={(e) => onRiskToleranceChange(Number(e.target.value))}
                className="accent-cyan-300 w-full"
              />
            </div>
            <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/[0.07] p-2 text-xs text-cyan-100">
              Scenario-adjusted confidence: {scenarioConfidence.toFixed(1)}%
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs text-slate-300">
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-300" />
              Try one-variable-at-a-time changes first to isolate impact before committing.
            </div>
          </div>
        </Card>

        <Card title="Decision Quality Gate" right="Commit guardrail">
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Confidence threshold ({confidenceThreshold}%)</p>
              <input type="range" min={60} max={90} value={confidenceThreshold} onChange={(e) => onConfidenceThresholdChange(Number(e.target.value))} className="w-full" />
            </div>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={gateChecks.assumptionsReviewed}
                onChange={(e) => onGateChange({ ...gateChecks, assumptionsReviewed: e.target.checked })}
              />
              Assumptions reviewed
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={gateChecks.evidenceVerified}
                onChange={(e) => onGateChange({ ...gateChecks, evidenceVerified: e.target.checked })}
              />
              Evidence verified
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={gateChecks.ownerAligned}
                onChange={(e) => onGateChange({ ...gateChecks, ownerAligned: e.target.checked })}
              />
              Owner aligned
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs">
                {gateChecks.assumptionsReviewed ? (
                  <CheckCircle2 className="mb-1 h-3.5 w-3.5 text-emerald-300" />
                ) : (
                  <Circle className="mb-1 h-3.5 w-3.5 text-slate-500" />
                )}
                Assumptions
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs">
                {gateChecks.evidenceVerified ? (
                  <CheckCircle2 className="mb-1 h-3.5 w-3.5 text-emerald-300" />
                ) : (
                  <Circle className="mb-1 h-3.5 w-3.5 text-slate-500" />
                )}
                Evidence
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs">
                {gateChecks.ownerAligned ? (
                  <CheckCircle2 className="mb-1 h-3.5 w-3.5 text-emerald-300" />
                ) : (
                  <Circle className="mb-1 h-3.5 w-3.5 text-slate-500" />
                )}
                Ownership
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs">
              Gate status:{" "}
              <span className={qualityGatePassed ? "text-emerald-300" : "text-amber-300"}>
                {qualityGatePassed ? "Ready to commit" : "Blocked until checks complete"}
              </span>
            </div>
            <Button
              variant={qualityGatePassed ? "default" : "secondary"}
              size="sm"
              className={qualityGatePassed ? "" : "cursor-not-allowed text-slate-400"}
              disabled={!qualityGatePassed}
              onClick={onCommitDecision}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Commit Decision
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
