import type { DeliberationConstraint } from "@/lib/types";
import { Clock, DollarSign, Cpu } from "lucide-react";

function MeterBar({
  value,
  max,
  color,
  overrun,
}: {
  value: number;
  max: number;
  color: string;
  overrun?: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full transition-all ${overrun ? "bg-rose-400" : color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ConstraintMeter({ c }: { c: DeliberationConstraint }) {
  const timeOverrun = c.timeElapsedMins > c.timeLimitMins;
  const budgetPct = (c.dollarSpent / c.dollarBudget) * 100;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">Deliberation Constraints</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Clock className="h-3 w-3" />
            Time
          </span>
          <span className={timeOverrun ? "text-rose-300 font-medium" : "text-slate-300"}>
            {c.timeElapsedMins.toFixed(1)} / {c.timeLimitMins} min
            {timeOverrun && " · over"}
          </span>
        </div>
        <MeterBar value={c.timeElapsedMins} max={c.timeLimitMins} color="bg-cyan-400" overrun={timeOverrun} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <DollarSign className="h-3 w-3" />
            Budget
          </span>
          <span className={budgetPct > 90 ? "text-amber-300 font-medium" : "text-slate-300"}>
            ${c.dollarSpent.toFixed(2)} / ${c.dollarBudget.toFixed(2)}
          </span>
        </div>
        <MeterBar
          value={c.dollarSpent}
          max={c.dollarBudget}
          color={budgetPct > 75 ? "bg-amber-400" : "bg-emerald-400"}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="h-3 w-3" />
            Context (1M window)
          </span>
          <span className="text-slate-300 font-mono">
            {(c.contextUsed / 1000).toFixed(0)}K / {(c.contextLimit / 1000).toFixed(0)}K
          </span>
        </div>
        <MeterBar value={c.contextUsed} max={c.contextLimit} color="bg-violet-400" />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Rounds: {c.roundsCompleted} / {c.maxRounds}</span>
        <span
          className={`rounded-full px-2 py-0.5 border text-[10px] font-medium ${
            timeOverrun
              ? "border-rose-300/25 bg-rose-500/10 text-rose-300"
              : "border-emerald-300/25 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {timeOverrun ? "Constraint hit" : "In budget"}
        </span>
      </div>
    </div>
  );
}
