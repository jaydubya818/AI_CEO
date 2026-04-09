import type { AgentStance } from "@/lib/types";
import { CheckCircle2, GitMerge, XCircle } from "lucide-react";

const stanceConfig = {
  support: {
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-300" />,
    label: "Support",
    className: "border-emerald-300/20 bg-emerald-500/[0.05]",
    labelClass: "text-emerald-300",
  },
  conditional: {
    icon: <GitMerge className="h-4 w-4 text-amber-300" />,
    label: "Conditional",
    className: "border-amber-300/20 bg-amber-500/[0.05]",
    labelClass: "text-amber-300",
  },
  dissent: {
    icon: <XCircle className="h-4 w-4 text-rose-300" />,
    label: "Dissent",
    className: "border-rose-300/20 bg-rose-500/[0.05]",
    labelClass: "text-rose-300",
  },
};

export function AgentStanceCard({
  stance,
  showClosing,
}: {
  stance: AgentStance;
  showClosing?: boolean;
}) {
  const cfg = stanceConfig[stance.position];
  return (
    <div className={`rounded-xl border p-3 space-y-2 ${cfg.className}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {cfg.icon}
          <span className="text-sm font-medium text-slate-100">{stance.agentName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium uppercase tracking-wider ${cfg.labelClass}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-slate-500">{stance.confidence}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-300 leading-5">{stance.summary}</p>
      {showClosing && stance.closingStatement && (
        <p className="text-xs text-slate-400 border-t border-white/10 pt-2 italic leading-5">
          &ldquo;{stance.closingStatement}&rdquo;
        </p>
      )}
    </div>
  );
}
