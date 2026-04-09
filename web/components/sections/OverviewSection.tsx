import { metrics, risks } from "@/lib/mockData";
import type { AttentionScore } from "@/lib/types";
import { AlertTriangle, Clock, FileWarning, ShieldAlert, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";
import { Sparkline } from "../ui/Sparkline";

const briefContent: Record<string, string> = {
  Risks:
    "Platform delivery variance at 13% — 4 epics at critical risk. APAC legal dependency unresolved with no owner SLA. SLO volatility in one enterprise segment approaching threshold breach.",
  Wins:
    "Enterprise pipeline grew 11% WoW. Reliability SLO at 99.94% — stable after last week's incident. Q2 hiring freeze protected margin through low-visibility period.",
  "Decisions Needed":
    "Q3 hiring acceleration for Platform and Security requires CEO commit. Enterprise feature bundle timeline needs CPO escalation by Wed. Reliability investment approval pending CTO sign-off by Mon EOD.",
  Alerts:
    "Dependency Queue Report contradicts Jira — 2 vs 5 blocked items. Root cause unverified. Slack latency elevated. Approval queue at 4 pending; decision velocity at 1.8d against 1.5d target.",
};

function AttentionMeter({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-rose-400" : score >= 60 ? "bg-amber-400" : "bg-emerald-400";
  const label =
    score >= 80 ? "Overloaded" : score >= 60 ? "Elevated" : "Manageable";
  const labelColor =
    score >= 80 ? "text-rose-300" : score >= 60 ? "text-amber-300" : "text-emerald-300";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Decision surface load</span>
        <span className={`font-medium ${labelColor}`}>
          {score}/100 · {label}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function OverviewSection({
  attentionScore,
  onOpenBriefings,
  onAskFollowup,
}: {
  attentionScore: AttentionScore;
  onOpenBriefings: () => void;
  onAskFollowup: () => void;
}) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const inputs: { icon: React.ReactNode; label: string; value: number; warn: number }[] = [
    { icon: <Clock className="h-3.5 w-3.5" />, label: "Pending approvals", value: attentionScore.pendingApprovals, warn: 2  },
    { icon: <Zap className="h-3.5 w-3.5" />, label: "Open decisions", value: attentionScore.openDecisions, warn: 5 },
    { icon: <AlertTriangle className="h-3.5 w-3.5" />, label: "Blocked actions", value: attentionScore.blockedActions, warn: 1 },
    { icon: <FileWarning className="h-3.5 w-3.5" />, label: "Stale sources", value: attentionScore.staleSources, warn: 3 },
    { icon: <ShieldAlert className="h-3.5 w-3.5" />, label: "Unresolved risks", value: attentionScore.unresolvedRisks, warn: 2 },
  ];

  return (
    <section id="overview" className="scroll-mt-28">
      <SectionHeader
        title="Overview"
        subtitle="Fast executive signal on company state, risks, and follow-through."
        actionLabel="Open Brief Workspace"
        onAction={onOpenBriefings}
      />

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <Card title="Today's Executive Brief" right="Updated 08:12">
            <p className="text-sm leading-6 text-slate-300">
              Delivery risk increased in Platform due to integration drift; enterprise expansion
              pipeline grew 11%; reliability stabilized after last week&apos;s incident.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Risks", "Wins", "Decisions Needed", "Alerts"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${
                    activeFilter === tag
                      ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                      : "border-white/15 bg-white/[0.06] text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {activeFilter && (
              <div className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/[0.06] p-3 text-xs text-slate-200 leading-5 animate-pulse-once">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-cyan-400">{activeFilter}</p>
                {briefContent[activeFilter]}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="default" size="sm" onClick={onOpenBriefings}>
                Open Full Brief
              </Button>
              <Button variant="secondary" size="sm" onClick={onAskFollowup}>
                Ask Follow-up
              </Button>
            </div>
          </Card>
        </div>
        <div className="xl:col-span-4">
          <Card title="Executive Attention Engine" right={`Score ${attentionScore.score}/100`}>
            <div className="mb-4">
              <AttentionMeter score={attentionScore.score} />
            </div>
            <div className="mb-4 grid grid-cols-1 gap-1.5">
              {inputs.map((input) => (
                <div key={input.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className={input.value > input.warn ? "text-rose-300" : "text-slate-500"}>
                      {input.icon}
                    </span>
                    {input.label}
                  </span>
                  <span
                    className={`font-mono font-medium ${
                      input.value > input.warn ? "text-rose-300" : "text-slate-300"
                    }`}
                  >
                    {input.value}
                  </span>
                </div>
              ))}
            </div>
            <ul className="space-y-1.5 text-xs">
              {[
                "Decide now: Q3 hiring tradeoff for Platform and Security",
                "Monitor closely: APAC legal dependency risk",
                "Delegate: Incident retro follow-through",
                "Ignore for now: Low-confidence morale signal",
              ].map((item) => (
                <li key={item} className="rounded-lg bg-white/[0.04] px-3 py-2 text-slate-300">
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => (
          <Card key={metric.label} title={metric.label}>
            <p className="text-2xl font-semibold text-slate-100">{metric.value}</p>
            <p className="mt-1 text-xs text-cyan-300">{metric.delta}</p>
            <p className="mt-2 text-xs text-slate-500">{metric.note}</p>
            <Sparkline points={metric.trend} />
          </Card>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="What changed in last 24h" right="Diff view">
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="rounded-lg bg-white/[0.04] p-2">Delivery variance rose from 11% to 13%</li>
            <li className="rounded-lg bg-white/[0.04] p-2">Pipeline weighted value increased by $1.2M</li>
            <li className="rounded-lg bg-white/[0.04] p-2">Two actions moved into blocked status</li>
          </ul>
        </Card>
        <Card title="Strategic Watchlist" right="Pinned initiatives">
          <ul className="space-y-2 text-sm text-slate-300">
            {["Enterprise Expansion Q3", "Reliability Recovery", "Hiring Velocity", "Mid-Market Retention"].map(
              (item) => (
                <li key={item} className="rounded-lg bg-white/[0.04] p-2">
                  {item}
                </li>
              ),
            )}
          </ul>
        </Card>
      </div>

      <Card title="Top Risks" right="Cross-functional">
        <div className="space-y-2">
          {risks.map((risk) => (
            <p key={risk.id} className="rounded-lg bg-white/[0.04] p-2 text-sm text-slate-300">
              {risk.title} · {risk.confidence}% confidence · {risk.owner}
            </p>
          ))}
        </div>
      </Card>
    </section>
  );
}
