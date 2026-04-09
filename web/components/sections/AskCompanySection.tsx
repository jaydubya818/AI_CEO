import { suggestedPrompts } from "@/lib/mockData";
import type { Citation } from "@/lib/types";
import { AuditHint } from "../ui/AuditHint";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { CommandInputBar } from "../ui/CommandInputBar";
import { ConfidenceBadge } from "../ui/ConfidenceBadge";
import { ConflictFlag } from "../ui/ConflictFlag";
import { FreshnessBadge } from "../ui/FreshnessBadge";
import { SectionHeader } from "../ui/SectionHeader";

export function AskCompanySection({
  queryInput,
  activeTab,
  citations,
  onQueryChange,
  onPromptSelect,
  onTabChange,
  onSubmit,
  onEscalate,
  onEvidenceOpen,
}: {
  queryInput: string;
  activeTab: string;
  citations: Citation[];
  onQueryChange: (value: string) => void;
  onPromptSelect: (value: string) => void;
  onTabChange: (tab: string) => void;
  onSubmit: () => void;
  onEscalate: () => void;
  onEvidenceOpen: (source: string) => void;
}) {
  const tabs = ["Summary", "Evidence", "Timeline", "Risks", "Actions"];

  return (
    <section id="ask" className="scroll-mt-28">
      <SectionHeader
        title="Ask the Company"
        subtitle="Grounded answers with evidence, confidence, and freshness."
        actionLabel="Escalate To Decision"
        onAction={onEscalate}
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <Card title="Query Composer" right="Natural language">
            <CommandInputBar value={queryInput} onChange={onQueryChange} onSubmit={onSubmit} />
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  onClick={() => onPromptSelect(prompt)}
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </Card>
          <div className="mt-4">
            <Card title="Answer Panel" right="Mode: Executive">
              <div className="mb-3 flex flex-wrap gap-2">
                <ConfidenceBadge value={81} />
                <FreshnessBadge minutes={6} />
                <ConflictFlag active />
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab}
                    type="button"
                    variant={activeTab === tab ? "default" : "secondary"}
                    size="sm"
                    className={`rounded-lg ${
                      activeTab === tab
                        ? "text-slate-950"
                        : "text-slate-300"
                    }`}
                    onClick={() => onTabChange(tab)}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
              <div className="space-y-4 text-sm text-slate-300">
                {activeTab === "Summary" && (
                  <>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Executive Summary</p>
                      <p>Q3 delivery risk is concentrated in Platform integration scope and dependency wait time.</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Facts</p>
                      <p>Epic burn-down variance increased from 7% to 13% over two sprints.</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Recommendations</p>
                      <p>Approve temporary integration strike team and freeze low-leverage roadmap scope.</p>
                    </div>
                  </>
                )}
                {activeTab === "Evidence" && (
                  <>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Primary source</p>
                      <p>Jira Program Board: 14 of 17 Platform epics show &gt;10% burn-down variance as of sprint end.</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Supporting signal</p>
                      <p>Sprint Health Snapshot: integration dependency wait time up 28% over 2 sprints (from 3.1d to 4.0d median).</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Contradiction</p>
                      <p className="text-amber-400">Dependency Queue Report cites only 2 blocked items vs 5 flagged in Jira. Root cause unverified.</p>
                    </div>
                  </>
                )}
                {activeTab === "Timeline" && (
                  <>
                    {[
                      { when: "Sprint −2", what: "Integration bottleneck first flagged in retrospective." },
                      { when: "Sprint −1", what: "Burn-down variance crossed 10% threshold. No escalation." },
                      { when: "Today", what: "Risk elevated to High. Delivery forecast adjusted to 84%." },
                      { when: "This week", what: "Decision: strike team or scope freeze must be committed." },
                    ].map(({ when, what }) => (
                      <div key={when} className="flex gap-3">
                        <span className="shrink-0 w-20 text-xs text-slate-500 pt-0.5">{when}</span>
                        <p className="text-xs text-slate-300">{what}</p>
                      </div>
                    ))}
                  </>
                )}
                {activeTab === "Risks" && (
                  <>
                    {[
                      { level: "High", risk: "Strike team stands up too slowly — risk compounds into Q4." },
                      { level: "Medium", risk: "Scope freeze delays two enterprise feature commitments." },
                      { level: "Low", risk: "COO overrides recommendation — accountability gap widens." },
                    ].map(({ level, risk }) => (
                      <div key={risk} className="flex gap-3">
                        <span className={`shrink-0 text-xs font-semibold pt-0.5 ${level === "High" ? "text-rose-400" : level === "Medium" ? "text-amber-400" : "text-slate-400"}`}>{level}</span>
                        <p className="text-xs text-slate-300">{risk}</p>
                      </div>
                    ))}
                  </>
                )}
                {activeTab === "Actions" && (
                  <>
                    {[
                      { owner: "COO", action: "Approve 6-week integration strike team by EOD." },
                      { owner: "CPO", action: "Confirm which roadmap items are freezable this sprint." },
                      { owner: "Eng", action: "Publish dependency queue with daily refresh." },
                    ].map(({ owner, action }) => (
                      <div key={action} className="flex gap-3">
                        <span className="shrink-0 w-10 text-xs font-medium text-cyan-400 pt-0.5">{owner}</span>
                        <p className="text-xs text-slate-300">{action}</p>
                      </div>
                    ))}
                  </>
                )}
                <AuditHint text="Read events logged and traceable in Governance." />
              </div>
            </Card>
          </div>
        </div>
        <div className="xl:col-span-4">
          <Card title="Evidence & Related" right="Citations">
            <div className="space-y-2 text-sm">
              {citations.map((citation) => (
                <button
                  key={citation.id}
                  className="w-full rounded-lg border border-white/8 bg-white/[0.04] p-3 text-left text-slate-300 transition hover:bg-white/[0.08]"
                  onClick={() => onEvidenceOpen(citation.source)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p>{citation.source}</p>
                    <Badge variant="muted">Evidence</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Updated {citation.updatedMins}m ago · Relevance {citation.relevance.toFixed(2)}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
