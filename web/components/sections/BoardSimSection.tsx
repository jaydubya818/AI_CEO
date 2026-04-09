import type { BoardSimQuestion } from "@/lib/types";
import { useState } from "react"; // v2
import { CheckCircle2, ChevronDown, ChevronUp, Circle, MessageSquare, ShieldAlert } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";

function SimQuestion({
  question,
  index,
}: {
  question: BoardSimQuestion;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        question.weakArea
          ? "border-rose-300/20 bg-rose-500/[0.04]"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <button
        className="w-full text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="mt-0.5 rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-slate-400 font-mono shrink-0">
              Q{index + 1}
            </span>
            <p className="text-sm text-slate-100 font-medium leading-snug">
              {question.question}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {question.weakArea && (
              <Badge className="border-rose-300/25 bg-rose-400/10 text-rose-200 text-[10px]">
                Weak area
              </Badge>
            )}
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="mt-3 rounded-lg bg-white/[0.05] p-3 border-l-2 border-cyan-400/40">
          <p className="text-xs text-slate-500 mb-1 font-medium">Suggested response</p>
          <p className="text-sm text-slate-200 leading-6">{question.suggestedResponse}</p>
        </div>
      )}
    </div>
  );
}

const PREP_ITEMS = [
  { key: "cro", text: "Request CRO pipeline close probability update", done: false },
  { key: "people", text: "Get People team onboarding capacity confirmation", done: false },
  { key: "framing", text: "Prepare conditional commit framing for acceleration", done: false },
  { key: "rationale", text: "Stage enterprise delivery rationale documented", done: true },
  { key: "contrarian", text: "Contrarian dissent acknowledged in brief", done: true },
];

export function BoardSimSection({
  questions,
  onOpenGovernance,
  onGenerateBrief,
}: {
  questions: BoardSimQuestion[];
  onOpenGovernance: () => void;
  onGenerateBrief?: () => void;
}) {
  const weakAreas = questions.filter((q) => q.weakArea);
  const strongAreas = questions.filter((q) => !q.weakArea);
  const [prepItems, setPrepItems] = useState(PREP_ITEMS);
  const remainingCount = prepItems.filter((i) => !i.done).length;

  const togglePrep = (key: string) => {
    setPrepItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, done: !item.done } : item)),
    );
  };

  return (
    <section id="boardsim" className="scroll-mt-28">
      <SectionHeader
        title="Board Simulation"
        subtitle="Anticipate likely board objections, weak evidence areas, and suggested responses."
        actionLabel="Open Governance"
        onAction={onOpenGovernance}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <Card title="Likely Board Questions" right={`${questions.length} generated`}>
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <ShieldAlert className="h-4 w-4 text-rose-300 shrink-0" />
              <p className="text-xs text-slate-300">
                <span className="text-rose-300 font-medium">{weakAreas.length} weak evidence areas</span> detected ·{" "}
                <span className="text-emerald-300">{strongAreas.length} well-supported positions</span>
              </p>
            </div>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <SimQuestion key={q.id} question={q} index={i} />
              ))}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-4 space-y-4">
          <Card title="Board Readiness Score" right="Pre-meeting">
            <div className="space-y-3">
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-slate-100">
                  {Math.round(((questions.length - weakAreas.length) / questions.length) * 100)}
                  <span className="text-2xl text-slate-400">%</span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Evidence coverage</p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{
                    width: `${Math.round(((questions.length - weakAreas.length) / questions.length) * 100)}%`,
                  }}
                />
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg bg-rose-500/[0.06] border border-rose-300/20 p-2 text-rose-200">
                  Strengthen before meeting: pipeline probability evidence + onboarding capacity data
                </div>
                <div className="rounded-lg bg-emerald-500/[0.06] border border-emerald-300/20 p-2 text-emerald-200">
                  Ready: delivery decomposition, staged enterprise approach, contrarian acknowledgement
                </div>
              </div>
            </div>
          </Card>

          <Card title="Preparation Actions" right={`${remainingCount} remaining`}>
            <div className="space-y-2 text-xs">
              {prepItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => togglePrep(item.key)}
                  className={`flex w-full items-start gap-2 rounded-lg p-2 text-left transition hover:bg-white/[0.06] ${
                    item.done
                      ? "bg-white/[0.02] text-slate-500"
                      : "bg-white/[0.04] text-slate-300"
                  }`}
                >
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  )}
                  <span className={item.done ? "line-through" : ""}>{item.text}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={onGenerateBrief}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Generate Full Brief
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
