"use client";

import type { DecisionPacket, DeliberationMessage, DeliberationSession } from "@/lib/types";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Radio,
  Send,
} from "lucide-react";
import { AgentStanceCard } from "../ui/AgentStanceCard";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { ConstraintMeter } from "../ui/ConstraintMeter";
import { DecisionMapCard } from "../ui/DecisionMapCard";
import { SectionHeader } from "../ui/SectionHeader";
import { TensionPanel } from "../ui/TensionPanel";

const messageTypeStyles: Record<
  DeliberationMessage["type"],
  { border: string; bg: string; badge: string; badgeText: string }
> = {
  broadcast: {
    border: "border-cyan-400/30",
    bg: "bg-cyan-500/[0.06]",
    badge: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200",
    badgeText: "CEO Broadcast",
  },
  response: {
    border: "border-white/10",
    bg: "bg-white/[0.03]",
    badge: "border-white/15 bg-white/[0.06] text-slate-400",
    badgeText: "Response",
  },
  closing: {
    border: "border-violet-300/20",
    bg: "bg-violet-500/[0.05]",
    badge: "border-violet-300/25 bg-violet-400/10 text-violet-200",
    badgeText: "Final Statement",
  },
  system: {
    border: "border-rose-300/20",
    bg: "bg-rose-500/[0.05]",
    badge: "border-rose-300/25 bg-rose-400/10 text-rose-200",
    badgeText: "System",
  },
};

function MessageRow({ msg }: { msg: DeliberationMessage }) {
  const style = messageTypeStyles[msg.type];
  return (
    <div className={`rounded-xl border p-3 space-y-1.5 ${style.border} ${style.bg}`}>
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${style.badge}`}
          >
            {style.badgeText}
          </span>
          <span className="text-xs text-slate-300 font-medium">{msg.from}</span>
          {msg.to !== "all" && (
            <span className="text-[10px] text-slate-500">→ {msg.to}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          {msg.tokenCost > 0 && (
            <span className="font-mono">${msg.tokenCost.toFixed(2)}</span>
          )}
          <span className="rounded border border-white/10 px-1.5 py-0.5">R{msg.round}</span>
          {msg.hasSvg && (
            <span className="rounded border border-violet-300/25 bg-violet-400/10 px-1.5 py-0.5 text-violet-300">
              SVG
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-slate-200 leading-6">{msg.content}</p>
    </div>
  );
}

export function DeliberationSection({
  session,
  packet,
  onOpenMemo,
  onSendToInbox,
}: {
  session: DeliberationSession;
  packet?: DecisionPacket | null;
  onOpenMemo: () => void;
  onSendToInbox: () => void;
}) {
  const [showLog, setShowLog] = useState(false);
  const [activeRound, setActiveRound] = useState<number | "all">("all");

  const rounds = Array.from(new Set(session.messages.map((m) => m.round))).sort();
  const visibleMessages =
    activeRound === "all"
      ? session.messages
      : session.messages.filter((m) => m.round === activeRound);

  const statusColors = {
    running: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200",
    complete: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
    "constraint-hit": "border-amber-300/25 bg-amber-400/10 text-amber-200",
  };

  const statusLabels = {
    running: "In progress",
    complete: "Complete",
    "constraint-hit": "Constraint hit",
  };

  return (
    <section id="deliberation" className="scroll-mt-28">
      <SectionHeader
        title="Deliberation"
        subtitle="Multi-agent strategic debate — brief in, memo out. Full observability of every round."
        actionLabel="Open Memo"
        onAction={onOpenMemo}
      />

      {/* Session header */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-100 truncate">{session.briefTitle}</p>
          <p className="text-xs text-slate-500 mt-0.5">Brief ID: {session.briefId} · Session: {session.id}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            statusColors[session.status]
          }`}
        >
          {session.status === "running" && <Radio className="h-3 w-3 animate-pulse" />}
          {statusLabels[session.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">

        {/* Left — stances + tensions + map */}
        <div className="xl:col-span-5 space-y-4">
          <DecisionMapCard
            recommendation={packet?.recommendation.summary ?? session.recommendation}
            voteTally={session.voteTally}
            stances={session.stances}
          />

          {packet && (
            <>
              <Card title="CEO Frame" right={`Confidence ${packet.recommendation.confidence}%`}>
                <div className="space-y-3 text-sm text-slate-300">
                  <p className="text-slate-100">{packet.boardDeliberation.ceoFrame}</p>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Recommendation</p>
                    <p className="text-xs text-slate-300">{packet.boardDeliberation.recommendation}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-slate-500">Supporting evidence</p>
                    <p className="text-xs text-slate-400">{packet.kbEvidence?.query ?? "No KB query"}</p>
                    <p className="mt-1 text-xs text-slate-300">{packet.kbEvidence?.hits[0]?.snippet ?? "No evidence retrieved."}</p>
                  </div>
                </div>
              </Card>

              <Card title="Board Rounds" right={`${packet.boardDeliberation.boardRounds.length} outputs`}>
                <div className="space-y-2 text-xs text-slate-300">
                  {packet.boardDeliberation.boardRounds.map((round) => (
                    <div key={round.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Round {round.round} · {round.phase} · {round.role} → {round.target}</p>
                      <p className="mt-1 text-sm text-slate-200">{round.summary}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Final Positions" right={`${packet.boardDeliberation.finalPositions.length} roles`}>
                <div className="space-y-2">
                  {packet.boardDeliberation.finalPositions.map((position) => (
                    <div key={position.role} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-slate-100">{position.role}</p>
                        <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-200">{position.confidence}%</span>
                      </div>
                      <p className="mt-2"><span className="text-slate-500">Recommendation:</span> {position.recommendation}</p>
                      <p className="mt-1"><span className="text-slate-500">Rationale:</span> {position.strongestRationale}</p>
                      <p className="mt-1"><span className="text-slate-500">Risk:</span> {position.keyRisk}</p>
                      <p className="mt-1"><span className="text-slate-500">Condition:</span> {position.conditionThatChangesView}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {packet.boardDeliberation.specialistOutputs?.length ? (
                <Card title="Specialist Outputs" right={`${packet.boardDeliberation.specialistOutputs.length} specialists`}>
                  <div className="space-y-2">
                    {packet.boardDeliberation.specialistOutputs.map((output) => (
                      <div key={output.role} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-100">{output.role}</p>
                          <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-200">{output.confidence}%</span>
                        </div>
                        <p className="mt-2"><span className="text-slate-500">Recommendation:</span> {output.recommendation}</p>
                        <p className="mt-1"><span className="text-slate-500">Rationale:</span> {output.strongestRationale}</p>
                        <p className="mt-1"><span className="text-slate-500">Risk:</span> {output.keyRisk}</p>
                        <p className="mt-1"><span className="text-slate-500">Condition:</span> {output.conditionThatChangesView}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              <Card title="Stance Matrix" right={`${packet.boardDeliberation.stanceMatrix.length} roles`}>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {packet.boardDeliberation.stanceMatrix.map((stance) => (
                    <div key={stance.role} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-slate-300">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-slate-100">{stance.role}</p>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-300">{stance.stance}</span>
                      </div>
                      <p className="mt-1 text-slate-400">Risk: {stance.keyRisk}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          <Card title="Agent Stances" right={`${session.stances.length} members`}>
            <div className="space-y-2">
              {session.stances.map((stance) => (
                <AgentStanceCard key={stance.agentName} stance={stance} showClosing />
              ))}
            </div>
          </Card>
        </div>

        {/* Right — constraint meter + tensions + log */}
        <div className="xl:col-span-7 space-y-4">
          <ConstraintMeter c={session.constraint} />

          <Card title="Tensions" right={`${packet ? packet.boardDeliberation.unresolvedTensions.length : session.tensions.filter((t) => !t.resolved).length} unresolved`}>
            {packet ? (
              <div className="space-y-3 text-sm text-slate-300">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Resolved</p>
                  <div className="space-y-2">
                    {packet.boardDeliberation.resolvedTensions.map((tension) => (
                      <div key={tension.id} className="rounded-xl border border-emerald-300/20 bg-emerald-500/[0.05] p-3 text-xs">
                        <p className="text-slate-100">{tension.between.join(" vs ")}</p>
                        <p className="mt-1 text-slate-300">{tension.description}</p>
                        <p className="mt-1 text-emerald-200">{tension.resolution}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">Unresolved</p>
                  <div className="space-y-2">
                    {packet.boardDeliberation.unresolvedTensions.map((tension) => (
                      <div key={tension.id} className="rounded-xl border border-amber-300/20 bg-amber-500/[0.05] p-3 text-xs">
                        <p className="text-slate-100">{tension.between.join(" vs ")}</p>
                        <p className="mt-1 text-slate-300">{tension.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <TensionPanel tensions={session.tensions} />
            )}
          </Card>

          {/* Conversation log */}
          <Card
            title="Deliberation Log"
            right={`${session.messages.length} messages`}
          >
            {/* Round filter */}
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveRound("all")}
                className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                  activeRound === "all"
                    ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07]"
                }`}
              >
                All rounds
              </button>
              {rounds.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRound(r)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                    activeRound === r
                      ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07]"
                  }`}
                >
                  Round {r}
                </button>
              ))}
            </div>

            {/* Preview (collapsed) */}
            {!showLog ? (
              <div className="space-y-2">
                {visibleMessages.slice(0, 3).map((msg) => (
                  <MessageRow key={msg.id} msg={msg} />
                ))}
                {visibleMessages.length > 3 && (
                  <button
                    onClick={() => setShowLog(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs text-slate-400 hover:bg-white/[0.06] transition"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                    Show {visibleMessages.length - 3} more messages
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {visibleMessages.map((msg) => (
                  <MessageRow key={msg.id} msg={msg} />
                ))}
                <button
                  onClick={() => setShowLog(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs text-slate-400 hover:bg-white/[0.06] transition"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  Collapse log
                </button>
              </div>
            )}

            <div className="mt-4 flex gap-2 flex-wrap">
              <Button variant="default" size="sm" onClick={onOpenMemo}>
                <MessageSquare className="h-3.5 w-3.5" />
                View Full Memo
              </Button>
              <Button variant="secondary" size="sm" onClick={onSendToInbox}>
                <Send className="h-3.5 w-3.5" />
                Send to Decision Inbox
              </Button>
            </div>

            {packet && (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card title="Risks">
                  <div className="space-y-2 text-xs text-slate-300">
                    {packet.boardDeliberation.risks.map((risk) => (
                      <p key={risk}>{risk}</p>
                    ))}
                  </div>
                </Card>
                <Card title="Next Actions">
                  <div className="space-y-2 text-xs text-slate-300">
                    {packet.boardDeliberation.nextActions.map((action) => (
                      <p key={action}>{action}</p>
                    ))}
                  </div>
                </Card>
                <Card title="Sofie Review">
                  <p className="text-xs text-slate-200">{packet.boardDeliberation.sofieReview.summary}</p>
                  <div className="mt-2 space-y-1">
                    {packet.boardDeliberation.sofieReview.details.map((detail) => (
                      <p key={detail} className="text-[11px] text-slate-500">{detail}</p>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
