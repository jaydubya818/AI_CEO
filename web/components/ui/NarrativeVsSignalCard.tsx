import { Card } from "./Card";

export function NarrativeVsSignalCard() {
  return (
    <Card title="Narrative vs Reality" right="Divergence score 67">
      <div className="space-y-2 text-sm">
        <div className="rounded-lg bg-white/[0.04] p-3">
          <p className="text-xs text-slate-500">Management narrative</p>
          <p className="text-slate-200">Delivery remains broadly on plan with isolated risk.</p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-3">
          <p className="text-xs text-slate-500">Operational signal</p>
          <p className="text-slate-200">Integration dependency wait time grew 28% across two sprints.</p>
        </div>
      </div>
    </Card>
  );
}
