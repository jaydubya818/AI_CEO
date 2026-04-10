"use client";

import { briefTemplates } from "@/lib/mockData";
import type { Brief, BriefSection } from "@/lib/types";
import { useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Play, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";

const REQUIRED_SECTIONS: BriefSection[] = ["situation", "stakes", "constraints", "keyQuestions"];

const sectionLabels: Record<BriefSection, string> = {
  situation: "Situation",
  stakes: "Stakes",
  constraints: "Constraints",
  keyQuestions: "Key Questions",
};

const sectionDescriptions: Record<BriefSection, string> = {
  situation: "What is the context and current state? Be specific.",
  stakes: "What happens if we get this wrong? What is the upside if we get it right?",
  constraints: "What are the hard limits — time, budget, ownership, irreversibility?",
  keyQuestions: "What are the 2–4 questions the board must answer to reach a decision?",
};

function validateBrief(brief: Partial<Brief>): BriefSection[] {
  const errors: BriefSection[] = [];
  if (!brief.situation?.trim()) errors.push("situation");
  if (!brief.stakes?.trim()) errors.push("stakes");
  if (!brief.constraints?.trim()) errors.push("constraints");
  if (!brief.keyQuestions?.length || brief.keyQuestions.every((q) => !q.trim()))
    errors.push("keyQuestions");
  return errors;
}

function BriefCard({
  brief,
  onRun,
}: {
  brief: Brief;
  onRun: (brief: Brief) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-100">{brief.title}</p>
        <Badge
          className={
            brief.valid
              ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
              : "border-rose-300/25 bg-rose-400/10 text-rose-200"
          }
        >
          {brief.valid ? "Valid" : "Incomplete"}
        </Badge>
      </div>
      <p className="text-xs text-slate-400">Created: {brief.createdAt}</p>
      <p className="text-xs text-slate-300 leading-5 line-clamp-2">{brief.situation}</p>
      <div className="flex flex-wrap gap-1">
        {REQUIRED_SECTIONS.map((sec) => {
          const missing = brief.validationErrors.includes(sec);
          return (
            <span
              key={sec}
              className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] ${
                missing
                  ? "border-rose-300/25 bg-rose-400/10 text-rose-300"
                  : "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
              }`}
            >
              {missing ? (
                <AlertCircle className="h-2.5 w-2.5" />
              ) : (
                <CheckCircle2 className="h-2.5 w-2.5" />
              )}
              {sectionLabels[sec]}
            </span>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Button
          variant={brief.valid ? "default" : "secondary"}
          size="sm"
          disabled={!brief.valid}
          onClick={() => onRun(brief)}
          className={!brief.valid ? "cursor-not-allowed text-slate-500" : ""}
        >
          <Play className="h-3.5 w-3.5" />
          Run Deliberation
        </Button>
      </div>
    </div>
  );
}

function BriefBuilder({ onSubmit }: { onSubmit: (brief: Brief) => void }) {
  const [title, setTitle] = useState("");
  const [situation, setSituation] = useState("");
  const [stakes, setStakes] = useState("");
  const [constraints, setConstraints] = useState("");
  const [keyQuestions, setKeyQuestions] = useState(["", "", ""]);
  const [submitted, setSubmitted] = useState(false);

  const draft: Partial<Brief> = { situation, stakes, constraints, keyQuestions: keyQuestions.filter(Boolean) };
  const errors = validateBrief(draft);
  const isValid = errors.length === 0 && title.trim().length > 0;

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isValid) return;
    const brief: Brief = {
      id: `brief-${Date.now()}`,
      title,
      situation,
      stakes,
      constraints,
      keyQuestions: keyQuestions.filter(Boolean),
      createdAt: "Just now",
      valid: true,
      validationErrors: [],
    };
    onSubmit(brief);
  };

  const fieldClass = (section: BriefSection) =>
    submitted && errors.includes(section)
      ? "border-rose-400/40 bg-rose-500/[0.06] focus:outline-none focus:border-rose-400/60"
      : "border-white/10 bg-white/[0.03] focus:outline-none focus:border-cyan-400/40";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-slate-500 mb-1.5">Brief title <span className="text-rose-400">*</span></p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Q3 Hiring Acceleration — Platform & Security"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400/40"
        />
      </div>

      {REQUIRED_SECTIONS.map((sec) => {
        if (sec === "keyQuestions") return null;
        const value = sec === "situation" ? situation : sec === "stakes" ? stakes : constraints;
        const setValue = sec === "situation" ? setSituation : sec === "stakes" ? setStakes : setConstraints;
        return (
          <div key={sec}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-slate-400 font-medium">
                {sectionLabels[sec]} <span className="text-rose-400">*</span>
              </p>
              {submitted && errors.includes(sec) && (
                <span className="text-[10px] text-rose-300 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Required
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-600 mb-1.5">{sectionDescriptions[sec]}</p>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              placeholder={sectionDescriptions[sec]}
              className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-100 placeholder-slate-600 resize-none ${fieldClass(sec)}`}
            />
          </div>
        );
      })}

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs text-slate-400 font-medium">
            Key Questions <span className="text-rose-400">*</span>
          </p>
          {submitted && errors.includes("keyQuestions") && (
            <span className="text-[10px] text-rose-300 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> At least one required
            </span>
          )}
        </div>
        <p className="text-[10px] text-slate-600 mb-1.5">{sectionDescriptions.keyQuestions}</p>
        <div className="space-y-2">
          {keyQuestions.map((q, i) => (
            <input
              key={i}
              value={q}
              onChange={(e) => {
                const next = [...keyQuestions];
                next[i] = e.target.value;
                setKeyQuestions(next);
              }}
              placeholder={`Question ${i + 1}`}
              className={`w-full rounded-xl border px-3 py-2 text-sm text-slate-100 placeholder-slate-600 ${
                submitted && errors.includes("keyQuestions") && !keyQuestions.some(Boolean)
                  ? "border-rose-400/40 bg-rose-500/[0.06] focus:outline-none"
                  : "border-white/10 bg-white/[0.03] focus:outline-none focus:border-cyan-400/40"
              }`}
            />
          ))}
        </div>
      </div>

      {submitted && !isValid && (
        <div className="rounded-xl border border-rose-300/20 bg-rose-500/[0.06] p-3 text-xs text-rose-200">
          Brief rejected. Complete all required sections before submitting to the board.
        </div>
      )}

      <Button variant={isValid ? "default" : "secondary"} size="sm" onClick={handleSubmit}>
        <FileText className="h-3.5 w-3.5" />
        {isValid ? "Submit Brief to Board" : "Validate Brief"}
      </Button>
    </div>
  );
}

export function BriefingsSection({
  onRunDeliberation,
}: {
  onRunDeliberation: (brief: Brief) => void;
}) {
  const [briefs, setBriefs] = useState<Brief[]>(briefTemplates);
  const [showBuilder, setShowBuilder] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleNewBrief = (brief: Brief) => {
    setBriefs((prev) => [brief, ...prev]);
    setShowBuilder(false);
    setSubmittedId(brief.id);
  };

  return (
    <section id="briefings" className="scroll-mt-28">
      <SectionHeader
        title="Briefings"
        subtitle="Structured briefs feed the deliberation engine. All required sections must be present before the board can run."
        actionLabel={showBuilder ? "Cancel" : "New Brief"}
        onAction={() => setShowBuilder((v) => !v)}
      />

      {/* Brief type cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {["Daily Brief", "Weekly Review", "Board Prep", "Crisis Brief"].map((brief) => (
          <Card key={brief} title={brief} right="Generated">
            <p className="text-xs text-slate-400">
              Includes summary, key metrics, decisions needed, open questions, and citations.
            </p>
            <button className="mt-3 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 transition">
              Open {brief}
            </button>
          </Card>
        ))}
      </div>

      {/* Brief builder */}
      {showBuilder && (
        <Card title="Brief Builder" right="Required sections enforced">
          <div className="mb-3 rounded-lg border border-cyan-400/20 bg-cyan-500/[0.06] p-3 text-xs text-cyan-100">
            A brief must include <span className="font-medium">Situation, Stakes, Constraints, and Key Questions</span> before it can be submitted to the board. Incomplete briefs are rejected at submission.
          </div>
          <BriefBuilder onSubmit={handleNewBrief} />
        </Card>
      )}

      {/* Brief library */}
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-slate-500">Brief Library ({briefs.length})</p>
          <button
            onClick={() => setShowBuilder(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400 hover:bg-white/[0.07] transition"
          >
            <Plus className="h-3 w-3" />
            New brief
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {briefs.map((brief) => (
            <div key={brief.id} className="relative">
              {submittedId === brief.id && (
                <div className="absolute -top-1 -right-1 z-10">
                  <span className="rounded-full border border-emerald-300/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                    New
                  </span>
                </div>
              )}
              <BriefCard brief={brief} onRun={onRunDeliberation} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
