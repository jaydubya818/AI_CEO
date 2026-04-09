import type { Tension } from "@/lib/types";
import { CheckCircle2, Zap } from "lucide-react";

export function TensionPanel({ tensions }: { tensions: Tension[] }) {
  const resolved = tensions.filter((t) => t.resolved);
  const unresolved = tensions.filter((t) => !t.resolved);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="text-emerald-300 font-medium">{resolved.length} resolved</span>
        <span className="text-amber-300 font-medium">{unresolved.length} unresolved</span>
      </div>

      {unresolved.length > 0 && (
        <div className="space-y-2">
          {unresolved.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-amber-300/20 bg-amber-500/[0.05] p-3 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span className="text-xs font-medium text-amber-200">
                  {t.between[0]} vs {t.between[1]}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-5">{t.description}</p>
            </div>
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-2">
          {resolved.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                <span className="text-xs font-medium text-slate-300">
                  {t.between[0]} vs {t.between[1]}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-5">{t.description}</p>
              {t.resolution && (
                <p className="text-xs text-emerald-200 border-t border-white/10 pt-1.5 leading-5">
                  {t.resolution}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
