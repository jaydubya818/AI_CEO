"use client";

import type { AgentExpertise, AgentSummary } from "@/lib/types";
import { useState } from "react";
import { Brain, DollarSign, Scale, Telescope, TrendingUp } from "lucide-react";
import { AgentExpertisePanel } from "../ui/AgentExpertisePanel";
import { AgentRoleBadge } from "../ui/AgentRoleBadge";
import { Card } from "../ui/Card";
import { ConfidenceBadge } from "../ui/ConfidenceBadge";
import { SectionHeader } from "../ui/SectionHeader";

const roleIcons: Record<string, React.ReactNode> = {
  specialist: null,
  contrarian: <Scale className="h-4 w-4 text-amber-300" />,
  moonshot: <Telescope className="h-4 w-4 text-violet-300" />,
  judge: <Brain className="h-4 w-4 text-emerald-300" />,
  revenue: <DollarSign className="h-4 w-4 text-rose-300" />,
  compounder: <TrendingUp className="h-4 w-4 text-cyan-300" />,
};

export function CabinetSection({
  agents,
  selectedAgentName,
  activeDecisionType,
  expertise,
  onSelectAgent,
  onConsult,
}: {
  agents: AgentSummary[];
  selectedAgentName: string;
  activeDecisionType?: string;
  expertise: AgentExpertise[];
  onSelectAgent: (name: string) => void;
  onConsult: (agentName: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"perspectives" | "expertise">("perspectives");
  const selectedAgent = agents.find((agent) => agent.name === selectedAgentName) ?? agents[0];

  // Dynamic composition: recommend agents based on active decision type
  const recommendedAgents = activeDecisionType
    ? agents.filter(
        (a) =>
          !a.decisionTypes ||
          a.decisionTypes.some((t) => t.includes(activeDecisionType.split(" / ")[0])),
      )
    : agents;

  const specialistAgents = agents.filter((a) => a.role === "specialist");
  const qualityAgents = agents.filter((a) => a.role !== "specialist" && a.role !== "revenue" && a.role !== "compounder");
  const strategyAgents = agents.filter((a) => a.role === "revenue" || a.role === "compounder");
  void recommendedAgents;

  return (
    <section id="cabinet" className="scroll-mt-28">
      <SectionHeader
        title="Cabinet"
        subtitle="Domain agents with perspective summaries, dissent, and recommendation signals."
        actionLabel="Consult Selected Agent"
        onAction={() => onConsult(selectedAgent.name)}
      />

      {/* Tab switcher */}
      <div className="mb-4 flex gap-2">
        {(["perspectives", "expertise"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition capitalize ${
              activeTab === tab
                ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07]"
            }`}
          >
            {tab === "perspectives" ? "Agent Perspectives" : "Agent Expertise"}
          </button>
        ))}
        {activeDecisionType && (
          <span className="ml-auto rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-500">
            Dynamic for: <span className="text-cyan-300">{activeDecisionType}</span>
          </span>
        )}
      </div>

      {activeTab === "perspectives" && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-8 space-y-4">
            {/* Specialist agents */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Specialist Perspectives</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {specialistAgents.map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => onSelectAgent(agent.name)}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      selectedAgentName === agent.name
                        ? "border-cyan-400/40 bg-cyan-500/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="text-sm font-medium text-slate-100">{agent.name}</p>
                      <AgentRoleBadge role={agent.role} />
                    </div>
                    <p className="text-sm text-slate-300">{agent.focus}</p>
                    <p className="mt-2 text-xs text-cyan-200">Confidence {agent.confidence}%</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Revenue + Compounder */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Strategy Agents — Time Horizon</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {strategyAgents.map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => onSelectAgent(agent.name)}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      selectedAgentName === agent.name
                        ? "border-cyan-400/40 bg-cyan-500/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {roleIcons[agent.role]}
                      <AgentRoleBadge role={agent.role} />
                    </div>
                    <p className="text-sm font-medium text-slate-100">{agent.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{agent.focus}</p>
                    {agent.reasoning && (
                      <p className="mt-1.5 text-xs italic text-slate-500">&ldquo;{agent.reasoning}&rdquo;</p>
                    )}
                    <p className="mt-2 text-xs text-cyan-200">Confidence {agent.confidence}%</p>
                  </button>
                ))}
              </div>
              <div className="mt-2 rounded-lg border border-amber-300/20 bg-amber-500/[0.05] p-2 text-xs text-amber-200">
                Revenue vs. Compounder: natural rivals. Revenue maximizes 90-day cash; Compounder maximizes multi-quarter compounding. Expect tension on every brief.
              </div>
            </div>

            {/* Quality agents — Contrarian, Moonshot, Judge */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Quality & Challenge Agents</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {qualityAgents.map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => onSelectAgent(agent.name)}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      selectedAgentName === agent.name
                        ? "border-cyan-400/40 bg-cyan-500/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {roleIcons[agent.role]}
                      <AgentRoleBadge role={agent.role} />
                    </div>
                    <p className="text-sm font-medium text-slate-100">{agent.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{agent.focus}</p>
                    <p className="mt-2 text-xs text-cyan-200">Confidence {agent.confidence}%</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-4">
            <Card title="Selected Agent" right={`${selectedAgent.confidence}%`}>
              <div className="flex items-center gap-2 mb-3">
                <AgentRoleBadge role={selectedAgent.role} />
                <ConfidenceBadge value={selectedAgent.confidence} />
              </div>
              {selectedAgent.model && (
                <p className="text-[10px] font-mono text-slate-600 mb-2">{selectedAgent.model}</p>
              )}
              <p className="text-xs text-slate-500 mb-1">Focus</p>
              <p className="text-sm text-slate-300">{selectedAgent.focus}</p>
              {selectedAgent.temperament && (
                <>
                  <p className="mt-3 text-xs text-slate-500 mb-1">Temperament</p>
                  <p className="text-xs text-slate-400 italic">{selectedAgent.temperament}</p>
                </>
              )}
              <p className="mt-3 text-xs text-slate-500 mb-1">Recommendation</p>
              <p className="text-sm text-slate-100">{selectedAgent.recommendation}</p>
              {selectedAgent.dissent && (
                <div className="mt-3 rounded-lg border border-amber-300/20 bg-amber-500/[0.06] p-3">
                  <p className="text-xs text-amber-300 mb-1 font-medium">Dissent</p>
                  <p className="text-xs text-slate-300">{selectedAgent.dissent}</p>
                </div>
              )}
              <button
                className="mt-4 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 text-slate-200 transition"
                onClick={() => onConsult(selectedAgent.name)}
              >
                Ask This Agent in Context
              </button>
            </Card>

            <Card title="Cabinet Consensus" right={`${agents.length} members`}>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="rounded-lg bg-white/[0.04] p-2">
                  <span className="text-slate-500">Consensus: </span>
                  Targeted acceleration on Platform hiring with 45-day checkpoint.
                </div>
                <div className="rounded-lg bg-amber-500/[0.06] border border-amber-300/20 p-2">
                  <span className="text-amber-300">Primary tension: </span>
                  Revenue vs. Compounder on time horizon; Contrarian on root cause.
                </div>
                <div className="rounded-lg bg-emerald-500/[0.06] border border-emerald-300/20 p-2">
                  <span className="text-emerald-300">Judge verdict: </span>
                  74/100 readiness. Commit pending CRO update.
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "expertise" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-violet-300/20 bg-violet-500/[0.05] p-3 text-xs text-violet-200">
            Agent expertise grows with every deliberation session. Each agent tracks allies, rivals, patterns, and heuristics from prior decisions. Token counts reflect working expertise depth.
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {expertise.map((exp) => (
              <AgentExpertisePanel key={exp.agentName} expertise={exp} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
