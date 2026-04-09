import { ShieldAlert } from "lucide-react";

export function StrongestCaseAgainst({
  dissent,
  missingEvidence,
}: {
  dissent: string;
  missingEvidence: string;
}) {
  return (
    <div className="rounded-xl border border-rose-300/20 bg-rose-500/[0.06] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-rose-300 shrink-0" />
        <p className="text-xs uppercase tracking-wider text-rose-300 font-medium">
          Strongest Case Against
        </p>
      </div>
      <p className="text-sm text-slate-200 leading-6">{dissent}</p>
      <div className="border-t border-white/10 pt-3">
        <p className="text-xs text-slate-500 mb-1">Missing evidence that could flip this call</p>
        <p className="text-xs text-slate-300">{missingEvidence}</p>
      </div>
    </div>
  );
}
