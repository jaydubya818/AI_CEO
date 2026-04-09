import { freshnessFromMinutes } from "@/lib/formatters";
import type { Risk, StoryStep, TelemetryLog } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { FreshnessBadge } from "../ui/FreshnessBadge";

export function ContextRail({
  selectedRisk,
  telemetryLogs,
  storyMode,
  storyStep,
  storySteps,
  onOpenFlow,
  onStartStory,
  onNextStory,
  onPrevStory,
  onStopStory,
  onCopyLink,
}: {
  selectedRisk: Risk;
  telemetryLogs: TelemetryLog[];
  storyMode: boolean;
  storyStep: number;
  storySteps: StoryStep[];
  onOpenFlow: () => void;
  onStartStory: () => void;
  onNextStory: () => void;
  onPrevStory: () => void;
  onStopStory: () => void;
  onCopyLink: () => void;
}) {
  const freshestCitation = selectedRisk.citations.reduce((prev, current) =>
    current.updatedMins < prev.updatedMins ? current : prev,
  );
  const stalestCitation = selectedRisk.citations.reduce((prev, current) =>
    current.updatedMins > prev.updatedMins ? current : prev,
  );

  return (
    <aside className="hidden w-[330px] shrink-0 2xl:block">
      <div className="sticky top-24 space-y-4">
        <Card
          title="Universal Context Rail"
          right="Live context"
          stale={freshnessFromMinutes(stalestCitation.updatedMins) === "stale"}
        >
          <div className="space-y-3 text-sm text-slate-300">
            <div className="rounded-lg bg-white/[0.04] p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs text-slate-500">Selected Risk</p>
                <Badge variant="accent">Active</Badge>
              </div>
              <p className="text-sm text-slate-100">{selectedRisk.title}</p>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-3">
              <p className="text-xs text-slate-500">Freshest source</p>
              <p className="text-sm text-slate-100">{freshestCitation.source}</p>
              <div className="mt-2">
                <FreshnessBadge minutes={freshestCitation.updatedMins} />
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-3">
              <p className="text-xs text-slate-500">Stalest source</p>
              <p className="text-sm text-slate-100">{stalestCitation.source}</p>
              <div className="mt-2">
                <FreshnessBadge minutes={stalestCitation.updatedMins} />
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full" onClick={onOpenFlow}>
              Open Linked Flow
            </Button>
            <Button variant="secondary" size="sm" className="w-full" onClick={onCopyLink}>
              Copy Share Link
            </Button>
          </div>
        </Card>

        <Card title="Story Mode Playbook" right={storyMode ? "Running" : "Idle"}>
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              One-click walkthrough for board/demo flow from risk sensing to governance validation.
            </p>
            <div className="rounded-lg bg-white/[0.04] p-3">
              <p className="text-xs text-slate-500">{storySteps[storyStep]?.title}</p>
              <p className="mt-1 text-sm text-slate-200">{storySteps[storyStep]?.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={onStartStory}>
                Start Story
              </Button>
              <Button variant="secondary" size="sm" onClick={onNextStory}>
                Next
              </Button>
              <Button variant="secondary" size="sm" onClick={onPrevStory}>
                Prev
              </Button>
            </div>
            {storyMode ? (
              <Button variant="secondary" size="sm" onClick={onStopStory}>
                Stop Story Mode
              </Button>
            ) : null}
          </div>
        </Card>

        <Card title="Telemetry Hooks" right="Batched">
          <div className="space-y-2">
            {telemetryLogs.length === 0 ? (
              <p className="text-xs text-slate-500">No events yet. Interact with the prototype to generate logs.</p>
            ) : (
              telemetryLogs.map((log) => (
                <div key={log.id} className="rounded-lg bg-white/[0.04] p-2">
                  <p className="text-xs text-cyan-200">{log.event}</p>
                  <p className="text-[11px] text-slate-400">{log.meta}</p>
                  <p className="text-[10px] text-slate-500">{log.time}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </aside>
  );
}
