"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ContextRail } from "@/components/layout/ContextRail";
import { TrustStrip } from "@/components/layout/TrustStrip";
import { ActionsSection } from "@/components/sections/ActionsSection";
import { AskCompanySection } from "@/components/sections/AskCompanySection";
import { BoardSimSection } from "@/components/sections/BoardSimSection";
import { BriefingsSection } from "@/components/sections/BriefingsSection";
import { CabinetSection } from "@/components/sections/CabinetSection";
import { DecisionsSection } from "@/components/sections/DecisionsSection";
import { DeliberationSection } from "@/components/sections/DeliberationSection";
import { GovernanceSection } from "@/components/sections/GovernanceSection";
import { MeetingsSection } from "@/components/sections/MeetingsSection";
import { MemorySection } from "@/components/sections/MemorySection";
import { OrgSignalsSection } from "@/components/sections/OrgSignalsSection";
import { OverviewSection } from "@/components/sections/OverviewSection";
import { PromptRoutingSection } from "@/components/sections/PromptRoutingSection";
import { KeyboardShortcutHint } from "@/components/ui/KeyboardShortcutHint";
import {
  activeDeliberation,
  agentExpertise,
  agents,
  attentionScore,
  boardSimQuestions,
  classifierFeatures,
  decisions,
  decisionReplays,
  delegationSuggestions,
  promptRoutes,
  risks,
  routerRules,
  routerStats,
  storySteps,
} from "@/lib/mockData";
import { navItems } from "@/lib/navigation";
import { makeTelemetryLog } from "@/lib/telemetry";
import type { GateChecks, TelemetryEvent, TelemetryLog } from "@/lib/types";
import { clamp } from "@/lib/utils";
import { getInitialParam, syncUrlState } from "@/lib/urlState";

export default function Home() {
  const initialSection = getInitialParam(navItems.map((i) => i.id), "section", "overview");
  const initialRiskId = getInitialParam(risks.map((r) => r.id), "risk", risks[0].id);
  const initialDecisionId = getInitialParam(
    decisions.map((d) => d.id),
    "decision",
    decisions[0].id,
  );

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Summary");
  const [activeSection, setActiveSection] = useState(initialSection);
  const [queryInput, setQueryInput] = useState("What changed this week across the business?");
  const [selectedRiskId, setSelectedRiskId] = useState(initialRiskId);
  const [selectedDecisionId, setSelectedDecisionId] = useState(initialDecisionId);
  const [selectedAgentName, setSelectedAgentName] = useState(agents[1].name);
  const [selectedActionLane, setSelectedActionLane] = useState("In Progress");
  const [headcountDelta, setHeadcountDelta] = useState(2);
  const [deliveryFocus, setDeliveryFocus] = useState(68);
  const [riskTolerance, setRiskTolerance] = useState(45);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [gateChecks, setGateChecks] = useState<GateChecks>({
    assumptionsReviewed: false,
    evidenceVerified: false,
    ownerAligned: false,
  });
  const [storyMode, setStoryMode] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [telemetryQueue, setTelemetryQueue] = useState<TelemetryLog[]>([]);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);

  const selectedRisk = risks.find((risk) => risk.id === selectedRiskId) ?? risks[0];
  const selectedDecision =
    decisions.find((decision) => decision.id === selectedDecisionId) ?? decisions[0];

  const scenarioConfidence = clamp(
    selectedDecision.confidence +
      headcountDelta * 1.5 +
      (deliveryFocus - 50) * 0.2 -
      (riskTolerance - 50) * 0.2,
    55,
    95,
  );

  const qualityGatePassed =
    scenarioConfidence >= confidenceThreshold &&
    gateChecks.assumptionsReviewed &&
    gateChecks.evidenceVerified &&
    gateChecks.ownerAligned;

  const trackEvent = (event: TelemetryEvent, meta: string) => {
    const nextId = telemetryQueue.length + telemetryLogs.length + 1;
    const log = makeTelemetryLog(nextId, event, meta);
    setTelemetryQueue((prev) => [...prev, log]);
  };

  useEffect(() => {
    if (telemetryQueue.length === 0) return;
    const timer = setTimeout(() => {
      const batched = [...telemetryQueue].reverse();
      setTelemetryLogs((prev) => [...batched, ...prev].slice(0, 12));
      console.info("[telemetry-batch]", batched);
      setTelemetryQueue([]);
    }, 600);
    return () => clearTimeout(timer);
  }, [telemetryQueue]);

  useEffect(() => {
    syncUrlState({
      riskId: selectedRiskId,
      decisionId: selectedDecisionId,
      section: activeSection,
    });
  }, [selectedRiskId, selectedDecisionId, activeSection]);

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyStoryStep = (stepIndex: number) => {
    const step = storySteps[stepIndex];
    if (!step) return;
    setStoryStep(stepIndex);
    setSelectedRiskId(step.apply.riskId);
    setSelectedDecisionId(step.apply.decisionId);
    setSelectedActionLane(step.apply.actionLane);
    handleSectionClick(step.apply.section);
  };

  const handleRiskFlowNavigation = () => {
    setSelectedDecisionId(selectedRisk.relatedDecisionId);
    setSelectedActionLane(selectedRisk.relatedActionLane);
    trackEvent("risk_link_navigate", selectedRisk.title);
    handleSectionClick("decisions");
  };

  const handleCopyShareLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      console.info("Copy failed");
    }
  };

  const evidenceCitations = useMemo(() => selectedRisk.citations, [selectedRisk]);

  return (
    <AppShell
      navItems={navItems}
      activeSection={activeSection}
      mobileNavOpen={mobileNavOpen}
      query={queryInput}
      onToggleMobileNav={() => setMobileNavOpen((v) => !v)}
      onNavSelect={handleSectionClick}
      onQueryChange={setQueryInput}
    >
      <main className="min-w-0 flex-1 space-y-14">
        <TrustStrip />
        <OverviewSection
          attentionScore={attentionScore}
          onOpenBriefings={() => handleSectionClick("briefings")}
          onAskFollowup={() => {
            setQueryInput("What changed this week across the business?");
            handleSectionClick("ask");
          }}
        />
        <AskCompanySection
          queryInput={queryInput}
          activeTab={activeTab}
          citations={evidenceCitations}
          onQueryChange={setQueryInput}
          onPromptSelect={setQueryInput}
          onTabChange={setActiveTab}
          onSubmit={() => trackEvent("ask_submitted", queryInput)}
          onEscalate={() => handleSectionClick("decisions")}
          onEvidenceOpen={(source) => trackEvent("evidence_opened", source)}
        />
        <DecisionsSection
          decisions={decisions}
          selectedDecision={selectedDecision}
          selectedDecisionId={selectedDecisionId}
          headcountDelta={headcountDelta}
          deliveryFocus={deliveryFocus}
          riskTolerance={riskTolerance}
          scenarioConfidence={scenarioConfidence}
          confidenceThreshold={confidenceThreshold}
          gateChecks={gateChecks}
          qualityGatePassed={qualityGatePassed}
          delegationSuggestions={delegationSuggestions}
          onDecisionSelect={(id, title) => {
            setSelectedDecisionId(id);
            trackEvent("decision_selected", title);
          }}
          onHeadcountChange={setHeadcountDelta}
          onDeliveryFocusChange={setDeliveryFocus}
          onRiskToleranceChange={setRiskTolerance}
          onConfidenceThresholdChange={setConfidenceThreshold}
          onGateChange={setGateChecks}
          onCommitDecision={() => trackEvent("decision_committed", selectedDecision.title)}
          onOpenActions={() => handleSectionClick("actions")}
        />
        <BriefingsSection
          onRunDeliberation={(briefId) => {
            trackEvent("brief_submitted", briefId);
            handleSectionClick("deliberation");
          }}
        />
        <DeliberationSection
          session={activeDeliberation}
          onOpenMemo={() => handleSectionClick("decisions")}
          onSendToInbox={() => {
            trackEvent("deliberation_sent_to_inbox", activeDeliberation.briefTitle);
            handleSectionClick("decisions");
          }}
        />
        <ActionsSection
          selectedActionLane={selectedActionLane}
          selectedRiskTitle={selectedRisk.title}
          onLaneChange={(lane) => {
            setSelectedActionLane(lane);
            trackEvent("action_lane_changed", lane);
          }}
        />
        <OrgSignalsSection
          risks={risks}
          selectedRiskId={selectedRiskId}
          onRiskSelect={setSelectedRiskId}
          onOpenDecision={handleRiskFlowNavigation}
          onOpenActions={() => {
            setSelectedActionLane(selectedRisk.relatedActionLane);
            trackEvent("risk_link_navigate", `${selectedRisk.title} -> action lane`);
            handleSectionClick("actions");
          }}
          onOpenMeetings={() => {
            trackEvent("risk_link_navigate", `${selectedRisk.title} -> meeting`);
            handleSectionClick("meetings");
          }}
          onOpenGovernance={() => {
            trackEvent("risk_link_navigate", `${selectedRisk.title} -> governance`);
            handleSectionClick("governance");
          }}
        />
        <MeetingsSection />
        <MemorySection replays={decisionReplays} />
        <CabinetSection
          agents={agents}
          selectedAgentName={selectedAgentName}
          activeDecisionType={selectedDecision.type}
          expertise={agentExpertise}
          onSelectAgent={setSelectedAgentName}
          onConsult={(name) => {
            setQueryInput(`What would ${name} prioritize this week?`);
            handleSectionClick("ask");
          }}
        />
        <BoardSimSection
          questions={boardSimQuestions}
          onOpenGovernance={() => {
            trackEvent("board_sim_opened", "governance");
            handleSectionClick("governance");
          }}
          onGenerateBrief={() => {
            trackEvent("board_sim_generate_brief", "full-brief");
            handleSectionClick("briefings");
          }}
        />
        <PromptRoutingSection
          routes={promptRoutes}
          stats={routerStats}
          rules={routerRules}
          features={classifierFeatures}
        />
        <GovernanceSection approvalRef={selectedRisk.approvalRef} />
        <footer className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-xs text-slate-400">
          AI CEO Agent · Executive Operating System · Grounded intelligence, governed action, measurable outcomes.
          <div className="mt-2">
            <KeyboardShortcutHint />
          </div>
        </footer>
      </main>

      <ContextRail
        selectedRisk={selectedRisk}
        telemetryLogs={telemetryLogs}
        storyMode={storyMode}
        storyStep={storyStep}
        storySteps={storySteps}
        onOpenFlow={handleRiskFlowNavigation}
        onStartStory={() => {
          setStoryMode(true);
          applyStoryStep(0);
        }}
        onNextStory={() => applyStoryStep(Math.min(storyStep + 1, storySteps.length - 1))}
        onPrevStory={() => applyStoryStep(Math.max(storyStep - 1, 0))}
        onStopStory={() => setStoryMode(false)}
        onCopyLink={handleCopyShareLink}
      />
    </AppShell>
  );
}
