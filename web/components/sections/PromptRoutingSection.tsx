"use client";

import { useState } from "react";
import { AlertTriangle, Brain, CheckCircle2, ChevronDown, ChevronRight, DollarSign, RefreshCw, Zap } from "lucide-react";
import type { ClassifierFeature, PromptComplexity, PromptRoute, RouterRule, RouterStats } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function complexityColor(c: PromptComplexity) {
  if (c === "low") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (c === "mid") return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  return "text-rose-400 bg-rose-500/10 border-rose-500/30";
}

function modelColor(m: string) {
  if (m === "haiku") return "text-emerald-400";
  if (m === "sonnet") return "text-cyan-400";
  return "text-violet-400";
}

function modelLabel(m: string) {
  if (m === "haiku") return "claude-haiku-4-5";
  if (m === "sonnet") return "claude-sonnet-4-6";
  return "claude-opus-4-6";
}

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatsBar({ stats }: { stats: RouterStats }) {
  const bars = [
    { label: "Low", pct: stats.lowPct, color: "bg-emerald-500" },
    { label: "Mid", pct: stats.midPct, color: "bg-amber-500" },
    { label: "High", pct: stats.highPct, color: "bg-violet-500" },
  ];
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-slate-400">Complexity Distribution</p>
        <span className="text-xs text-slate-500">{stats.totalRouted} routed today</span>
      </div>
      {/* stacked bar */}
      <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full bg-white/10">
        {bars.map((b) => (
          <div key={b.label} className={`h-full ${b.color}`} style={{ width: `${b.pct}%` }} />
        ))}
      </div>
      <div className="flex gap-4">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${b.color}`} />
            <span className="text-xs text-slate-400">{b.label} {b.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavingsCard({ stats }: { stats: RouterStats }) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center gap-2 mb-1">
        <DollarSign size={14} className="text-emerald-400" />
        <p className="text-xs uppercase tracking-widest text-slate-400">Cost Savings vs Always-Opus</p>
      </div>
      <p className="text-3xl font-bold text-emerald-400">{stats.avgCostSavingsPct}%</p>
      <p className="mt-1 text-xs text-slate-500">by routing low/mid prompts to cheaper models</p>
    </div>
  );
}

function DriftAlert({ stats }: { stats: RouterStats }) {
  if (!stats.driftDetected) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
      <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-amber-300">Classifier drift detected</p>
        <p className="mt-0.5 text-xs text-slate-400">{stats.driftNote}</p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          <RefreshCw size={11} />
          Last retrained: {stats.lastRetrained}
        </div>
      </div>
    </div>
  );
}

function RouteRow({ route }: { route: PromptRoute }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.015]">
      <button
        className="flex w-full items-start gap-3 p-3 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        {/* complexity badge */}
        <span className={`mt-0.5 shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${complexityColor(route.complexity)}`}>
          {route.complexity}
        </span>
        {/* prompt snippet */}
        <p className="flex-1 text-xs text-slate-300 line-clamp-1">{route.prompt}</p>
        {/* model */}
        <span className={`shrink-0 text-xs font-mono font-medium ${modelColor(route.model)}`}>
          {route.model}
        </span>
        {/* chevron */}
        <span className="shrink-0 text-slate-500">
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] px-3 pb-3 pt-2">
          {/* full prompt */}
          <p className="mb-3 text-xs text-slate-400 leading-relaxed">{route.prompt}</p>
          {/* stats row */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Model", value: modelLabel(route.model), className: modelColor(route.model) },
              { label: "Confidence", value: pct(route.classifierConfidence), className: "text-slate-200" },
              { label: "Latency", value: `${route.latencyMs}ms`, className: "text-slate-200" },
              { label: "Cost", value: `$${route.costUsd.toFixed(4)}`, className: "text-slate-200" },
            ].map(({ label, value, className }) => (
              <div key={label} className="rounded-lg bg-white/[0.03] p-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
                <p className={`mt-0.5 text-xs font-medium ${className}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-4 text-[10px] text-slate-600">
            <span>Tokens in: {route.tokensIn}</span>
            <span>Tokens out: {route.tokensOut}</span>
            {route.fallback && <span className="text-amber-500">⚠ Fallback used</span>}
            <span className="ml-auto">{route.timestamp}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureBar({ feature }: { feature: ClassifierFeature }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs text-slate-300">{feature.name}</p>
        <span className="text-xs font-mono text-slate-500">{pct(feature.weight)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{ width: `${Math.round(feature.weight * 100)}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-slate-600">{feature.description}</p>
    </div>
  );
}

function RuleRow({ rule }: { rule: RouterRule }) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${rule.active ? "border-white/[0.06] bg-white/[0.015]" : "border-white/[0.03] opacity-50"}`}>
      {rule.active
        ? <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-400" />
        : <Zap size={13} className="mt-0.5 shrink-0 text-slate-600" />
      }
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-200">{rule.name}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          <span className="font-mono">{rule.condition}</span>
          <span className="mx-1 text-slate-600">→</span>
          <span className="text-slate-400">{rule.action}</span>
        </p>
      </div>
      <span className={`ml-auto shrink-0 text-[10px] px-1.5 py-0.5 rounded border ${rule.active ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-slate-600 border-white/10"}`}>
        {rule.active ? "Active" : "Off"}
      </span>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function PromptRoutingSection({
  routes,
  stats,
  rules,
  features,
}: {
  routes: PromptRoute[];
  stats: RouterStats;
  rules: RouterRule[];
  features: ClassifierFeature[];
}) {
  const [filter, setFilter] = useState<PromptComplexity | "all">("all");
  const [activeTab, setActiveTab] = useState<"log" | "rules" | "classifier">("log");

  const filteredRoutes = filter === "all" ? routes : routes.filter((r) => r.complexity === filter);

  return (
    <section id="prompt-routing" className="mb-16 scroll-mt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Prompt Routing</h2>
          <p className="mt-1 text-sm text-slate-400">
            Classifier routes each prompt to the right model — haiku for simple, sonnet for mid-tier, opus for hard reasoning.
          </p>
        </div>
        <button className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 hover:bg-white/[0.07] transition">
          Configure Router
        </button>
      </div>

      {/* Top stats row */}
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <StatsBar stats={stats} />
        <SavingsCard stats={stats} />
        <DriftAlert stats={stats} />
      </div>

      {/* Model tier legend */}
      <div className="mb-4 flex flex-wrap gap-3">
        {[
          { model: "haiku", label: "claude-haiku-4-5", desc: "Simple tasks", color: "emerald" },
          { model: "sonnet", label: "claude-sonnet-4-6", desc: "Mid-tier reasoning", color: "cyan" },
          { model: "opus", label: "claude-opus-4-6", desc: "Hard reasoning & multi-agent", color: "violet" },
        ].map(({ model, label, desc, color }) => (
          <div key={model} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs border-${color}-500/20 bg-${color}-500/5`}>
            <Brain size={12} className={`text-${color}-400`} />
            <div>
              <p className={`font-mono font-medium text-${color}-400`}>{label}</p>
              <p className="text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="mb-4 flex gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1 w-fit">
        {(["log", "rules", "classifier"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-1.5 text-xs font-medium capitalize transition ${
              activeTab === tab
                ? "bg-cyan-500/20 text-cyan-100"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab === "log" ? "Routing Log" : tab === "rules" ? "Router Rules" : "Classifier"}
          </button>
        ))}
      </div>

      {/* Tab: Routing Log */}
      {activeTab === "log" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* left: route list */}
          <div className="lg:col-span-2">
            {/* filter pills */}
            <div className="mb-3 flex gap-2">
              {(["all", "low", "mid", "high"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-3 py-0.5 text-xs capitalize transition ${
                    filter === f
                      ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                      : "border-white/10 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {filteredRoutes.map((r) => <RouteRow key={r.id} route={r} />)}
            </div>
          </div>

          {/* right: per-model summary */}
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-slate-500">Model breakdown</p>
            {(["haiku", "sonnet", "opus"] as const).map((m) => {
              const subset = routes.filter((r) => r.model === m);
              const totalCost = subset.reduce((acc, r) => acc + r.costUsd, 0);
              const avgLatency = subset.length ? Math.round(subset.reduce((a, r) => a + r.latencyMs, 0) / subset.length) : 0;
              return (
                <div key={m} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs font-mono font-semibold ${modelColor(m)}`}>{m}</p>
                    <span className="text-xs text-slate-500">{subset.length} calls</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-slate-600">Total cost</p>
                      <p className="text-xs text-slate-300">${totalCost.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-600">Avg latency</p>
                      <p className="text-xs text-slate-300">{avgLatency}ms</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Router Rules */}
      {activeTab === "rules" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs text-slate-500">Rules are evaluated in order. First match wins.</p>
            <div className="flex flex-col gap-2">
              {rules.map((rule) => <RuleRow key={rule.name} rule={rule} />)}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">Pipeline</p>
            {[
              { step: "1", label: "Classifier", detail: "scikit-learn · outputs low / mid / high", color: "cyan" },
              { step: "2", label: "Router", detail: "applies rules · selects model · handles fallback", color: "amber" },
              { step: "3", label: "Pipeline", detail: "integrates into inference path · monitors drift", color: "violet" },
            ].map(({ step, label, detail, color }) => (
              <div key={step} className="flex gap-3 mb-4 last:mb-0">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-${color}-500/20 text-${color}-400 border border-${color}-500/30`}>
                  {step}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">{label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Classifier */}
      {activeTab === "classifier" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-4 text-xs uppercase tracking-widest text-slate-400">Feature Weights</p>
            <div className="flex flex-col gap-4">
              {features.map((f) => <FeatureBar key={f.name} feature={f} />)}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">Training status</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Model type", value: "scikit-learn gradient boosted classifier" },
                  { label: "Last retrained", value: stats.lastRetrained },
                  { label: "Drift status", value: stats.driftDetected ? "⚠ Drift detected" : "✓ Stable", color: stats.driftDetected ? "text-amber-400" : "text-emerald-400" },
                  { label: "Output classes", value: "low · mid · high" },
                  { label: "Retraining trigger", value: "confidence drop > 5 pts over 200 calls" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <p className="text-[10px] text-slate-500 shrink-0">{label}</p>
                    <p className={`text-[10px] text-right ${color ?? "text-slate-300"}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-2 text-xs uppercase tracking-widest text-slate-400">Confidence distribution (today)</p>
              <div className="flex items-end gap-1 h-16">
                {[0.92, 0.88, 0.95, 0.79, 0.93, 0.85, 0.97, 0.91].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-cyan-500/60"
                    style={{ height: `${Math.round(v * 100)}%` }}
                    title={pct(v)}
                  />
                ))}
              </div>
              <p className="mt-1 text-[10px] text-slate-600">Classifier confidence per recent call</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
