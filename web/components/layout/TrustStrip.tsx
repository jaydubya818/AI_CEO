import { ArrowDownRight, ArrowUpRight, ShieldCheck, Timer } from "lucide-react";
import { Badge } from "../ui/badge";

export function TrustStrip() {
  const items = [
    {
      label: "Approvals Pending",
      value: "4",
      detail: "Needs action",
      trend: "+2 today",
      tone: "warning",
      icon: Timer,
    },
    {
      label: "Stale Sources",
      value: "2",
      detail: "Slack summaries",
      trend: "-1 in 24h",
      tone: "good",
      icon: ShieldCheck,
    },
    {
      label: "Decision Velocity",
      value: "1.8d",
      detail: "median",
      trend: "-0.4d WoW",
      tone: "good",
      icon: ArrowDownRight,
    },
    {
      label: "Follow-Through Health",
      value: "78",
      detail: "composite score",
      trend: "+5 this week",
      tone: "good",
      icon: ArrowUpRight,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 md:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const trendClass =
          item.tone === "warning"
            ? "border-amber-300/25 bg-amber-400/10 text-amber-100"
            : "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";

        return (
          <div key={item.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
              <Icon className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-100">{item.value}</p>
            <p className="text-xs text-slate-400">{item.detail}</p>
            <div className="mt-2 flex items-center justify-between">
              <Badge className={trendClass}>{item.trend}</Badge>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${item.tone === "warning" ? "bg-amber-300/90 w-[58%]" : "bg-emerald-300/90 w-[82%]"}`}
                />
              </div>
            </div>
          </div>
        );
      })}
      <div className="rounded-xl border border-cyan-400/20 bg-cyan-500/[0.06] p-3 md:col-span-4">
        <p className="text-xs text-cyan-100">
          Recommendation: clear pending approvals in the next 6 hours to restore decision latency under the 1.5d target.
        </p>
      </div>
    </div>
  );
}
