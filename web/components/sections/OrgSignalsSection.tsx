import type { Risk } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { NarrativeVsSignalCard } from "../ui/NarrativeVsSignalCard";
import { SectionHeader } from "../ui/SectionHeader";

export function OrgSignalsSection({
  risks,
  selectedRiskId,
  onRiskSelect,
  onOpenDecision,
  onOpenActions,
  onOpenMeetings,
  onOpenGovernance,
}: {
  risks: Risk[];
  selectedRiskId: string;
  onRiskSelect: (id: string) => void;
  onOpenDecision: () => void;
  onOpenActions: () => void;
  onOpenMeetings: () => void;
  onOpenGovernance: () => void;
}) {
  const selectedRisk = risks.find((risk) => risk.id === selectedRiskId) ?? risks[0];
  return (
    <section id="signals" className="scroll-mt-28">
      <SectionHeader title="Org Signals" subtitle="Cross-functional risk, weak signals, and coordination drag." />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <Card title="Top Risks" right="Linked across sections">
            <div className="space-y-3">
              {risks.map((risk) => (
                <button
                  key={risk.id}
                  className={`w-full rounded-xl border p-3 text-left text-sm transition ${
                    selectedRiskId === risk.id
                      ? "border-cyan-400/40 bg-cyan-500/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                  }`}
                  onClick={() => onRiskSelect(risk.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-100">{risk.title}</p>
                    <Badge
                      className={
                        risk.severity === "High"
                          ? "border-rose-300/25 bg-rose-400/10 text-rose-100"
                          : "border-amber-300/25 bg-amber-400/10 text-amber-100"
                      }
                    >
                      {risk.severity}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {risk.confidence}% confidence · {risk.owner}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>
        <div className="xl:col-span-5 space-y-4">
          <Card title="Cross-Section Entity Linking" right="Risk -> Decision -> Action -> Meeting">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-lg bg-white/[0.04] p-3">
                Selected risk: <span className="text-slate-100">{selectedRisk.title}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-between text-left"
                onClick={onOpenDecision}
              >
                Open linked decision
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-between text-left"
                onClick={onOpenActions}
              >
                Open linked action lane ({selectedRisk.relatedActionLane})
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-between text-left"
                onClick={onOpenMeetings}
              >
                Open linked meeting ({selectedRisk.relatedMeeting})
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-between text-left"
                onClick={onOpenGovernance}
              >
                Open governance approval ({selectedRisk.approvalRef})
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/[0.06] p-2 text-xs text-cyan-100">
                Suggestion: add explicit owner SLA for each linked action to reduce decision-to-execution lag.
              </div>
            </div>
          </Card>
          <NarrativeVsSignalCard />
        </div>
      </div>
    </section>
  );
}
