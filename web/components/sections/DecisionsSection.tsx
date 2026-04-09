import type { Decision, DelegationSuggestion, GateChecks } from "@/lib/types";
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
              Recommendation: <span className="text-slate-100">{selectedDecision.recommendation}</span>
            </div>
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
