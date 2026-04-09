import type { AgentExpertise } from "@/lib/types";
import { Brain, Users, Swords } from "lucide-react";

export function AgentExpertisePanel({ expertise }: { expertise: AgentExpertise }) {
  const tokenK = (expertise.tokenCount / 1000).toFixed(1);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-300" />
          <p className="text-sm font-medium text-slate-100">{expertise.agentName}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-violet-300">{tokenK}K tokens</p>
          <p className="text-[10px] text-slate-500">{expertise.decisionsBriefed} briefs</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <p className="text-slate-500 uppercase tracking-wider text-[10px]">Learned patterns</p>
        {expertise.keyPatterns.map((p, i) => (
          <div key={i} className="rounded-lg bg-white/[0.04] px-2.5 py-2 text-slate-300 leading-5">
            {p}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 text-emerald-300">
            <Users className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider">Allies</span>
          </div>
          {expertise.allyAgents.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {expertise.allyAgents.map((a) => (
                <span key={a} className="rounded border border-emerald-300/20 bg-emerald-500/[0.05] px-1.5 py-0.5 text-[10px] text-emerald-200">
                  {a.replace(" Agent", "")}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-[10px]">None identified</p>
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 text-rose-300">
            <Swords className="h-3 w-3" />
            <span className="text-[10px] uppercase tracking-wider">Rivals</span>
          </div>
          {expertise.rivalAgents.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {expertise.rivalAgents.map((a) => (
                <span key={a} className="rounded border border-rose-300/20 bg-rose-500/[0.05] px-1.5 py-0.5 text-[10px] text-rose-200">
                  {a.replace(" Agent", "")}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-[10px]">None identified</p>
          )}
        </div>
      </div>

      <p className="text-[10px] text-slate-600">Updated: {expertise.lastUpdated}</p>
    </div>
  );
}
