import type { DecisionReplay } from "@/lib/types";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";

export function MemorySection({ replays }: { replays: DecisionReplay[] }) {
  return (
    <section id="memory" className="scroll-mt-28">
      <SectionHeader title="Memory" subtitle="Strategic continuity across prior decisions, assumptions, and replay." />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <Card title="Strategic Timeline" right="Linked to outcomes">
            <div className="space-y-3">
              {[
                { quarter: "Q1", text: "Entered enterprise segment with moderated margin target." },
                { quarter: "Q2", text: "Chose reliability investment over feature expansion." },
                { quarter: "Q3", text: "Rebalanced hiring to reduce integration bottlenecks." },
              ].map((event) => (
                <div
                  key={event.quarter}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
                >
                  <span className="mt-0.5 rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                    {event.quarter}
                  </span>
                  <p className="text-sm text-slate-300">{event.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-7">
          <Card title="Decision Replay" right="Calibration audit">
            <p className="mb-4 text-xs text-slate-500">
              What the system recommended · what was chosen · what happened · whether confidence calibration held.
            </p>
            <div className="space-y-4">
              {replays.map((replay) => (
                <div
                  key={replay.id}
                  className={`rounded-xl border p-4 space-y-3 ${
                    replay.calibrationHeld
                      ? "border-emerald-300/20 bg-emerald-500/[0.04]"
                      : "border-rose-300/20 bg-rose-500/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{replay.decisionTitle}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {replay.calibrationHeld ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-300" />
                      )}
                      <span
                        className={`text-xs ${
                          replay.calibrationHeld ? "text-emerald-300" : "text-rose-300"
                        }`}
                      >
                        {replay.calibrationHeld ? "Calibration held" : "Calibration missed"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                    <div className="rounded-lg bg-white/[0.04] p-2">
                      <p className="text-slate-500 mb-1">System recommended</p>
                      <p className="text-slate-300">{replay.systemRecommendation}</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.04] p-2">
                      <p className="text-slate-500 mb-1">Human choice</p>
                      <p className="text-slate-300">{replay.humanChoice}</p>
                    </div>
                    <div className="rounded-lg bg-white/[0.04] p-2">
                      <p className="text-slate-500 mb-1">Outcome</p>
                      <p className="text-slate-300">{replay.outcome}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-cyan-400/20 bg-cyan-500/[0.06] p-3 text-xs text-cyan-100">
              2 of 3 replays show calibration held. Override on Q1 enterprise timing underperformed forecast — flag for assumption review.
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
