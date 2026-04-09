import { ArrowRight, Clock3 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";

export function ActionsSection({
  selectedActionLane,
  selectedRiskTitle,
  onLaneChange,
}: {
  selectedActionLane: string;
  selectedRiskTitle: string;
  onLaneChange: (lane: string) => void;
}) {
  const lanes = ["Not Started", "In Progress", "Blocked", "Waiting", "Done"];
  const laneCounts: Record<string, number> = {
    "Not Started": 3,
    "In Progress": 5,
    Blocked: 2,
    Waiting: 2,
    Done: 6,
  };

  return (
    <section id="actions" className="scroll-mt-28">
      <SectionHeader title="Actions" subtitle="Track commitments, blockers, and execution outcomes." />
      <Card title="Follow-Through Tracker" right="Kanban + table hybrid">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {lanes.map((lane) => (
            <button
              key={lane}
              onClick={() => onLaneChange(lane)}
              className={`rounded-xl border p-3 text-left transition ${
                selectedActionLane === lane
                  ? "border-cyan-400/40 bg-cyan-500/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-400">{lane}</p>
                <Badge variant={selectedActionLane === lane ? "accent" : "muted"}>
                  {laneCounts[lane]}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-white/[0.05] p-2 text-xs text-slate-300">Owner: COO · Due Thu</div>
                <div className="rounded-lg bg-white/[0.05] p-2 text-xs text-slate-300">Source: {selectedRiskTitle}</div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${
                      lane === "Done"
                        ? "w-[92%] bg-emerald-300"
                        : lane === "Blocked"
                          ? "w-[28%] bg-rose-300"
                          : "w-[64%] bg-cyan-300"
                    }`}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Clock3 className="h-3.5 w-3.5 text-cyan-300" />
            Recommendation: focus unblock effort on lanes with highest owner concentration.
          </div>
          <Button variant="secondary" size="sm">
            Open Execution Digest
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>
    </section>
  );
}
