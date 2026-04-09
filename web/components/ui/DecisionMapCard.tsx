import type { AgentStance } from "@/lib/types";

export function DecisionMapCard({
  recommendation,
  voteTally,
  stances,
}: {
  recommendation: string;
  voteTally: Record<string, "support" | "dissent" | "conditional">;
  stances: AgentStance[];
}) {
  const support = stances.filter((s) => s.position === "support");
  const conditional = stances.filter((s) => s.position === "conditional");
  const dissent = stances.filter((s) => s.position === "dissent");
  const total = stances.length;

  const colors = {
    support: "bg-emerald-400",
    conditional: "bg-amber-400",
    dissent: "bg-rose-400",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">Decision Map</p>

      {/* Visual vote bar */}
      <div className="h-3 rounded-full overflow-hidden flex">
        {(["support", "conditional", "dissent"] as const).map((pos) => {
          const count = pos === "support" ? support.length : pos === "conditional" ? conditional.length : dissent.length;
          const pct = (count / total) * 100;
          return pct > 0 ? (
            <div
              key={pos}
              className={`h-full ${colors[pos]} first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${pct}%` }}
              title={`${pos}: ${count}`}
            />
          ) : null;
        })}
      </div>

      {/* Vote tally */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-emerald-300">{support.length} support</span>
        <span className="text-amber-300">{conditional.length} conditional</span>
        <span className="text-rose-300">{dissent.length} dissent</span>
      </div>

      {/* Recommendation */}
      <div className="rounded-lg border border-cyan-400/20 bg-cyan-500/[0.07] p-3">
        <p className="text-xs text-slate-500 mb-1">CEO memo recommendation</p>
        <p className="text-sm text-cyan-100 leading-6">{recommendation}</p>
      </div>

      {/* Agent map grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {Object.entries(voteTally).map(([agent, pos]) => (
          <div
            key={agent}
            className={`rounded-lg border px-2 py-1.5 text-[10px] flex items-center justify-between ${
              pos === "support"
                ? "border-emerald-300/20 bg-emerald-500/[0.04] text-emerald-200"
                : pos === "conditional"
                ? "border-amber-300/20 bg-amber-500/[0.04] text-amber-200"
                : "border-rose-300/20 bg-rose-500/[0.04] text-rose-200"
            }`}
          >
            <span className="text-slate-300 truncate mr-1">{agent.replace(" Agent", "")}</span>
            <span className="font-medium shrink-0 capitalize">{pos === "conditional" ? "cond." : pos}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
