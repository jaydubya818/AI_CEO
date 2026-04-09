import { Card } from "../ui/Card";
import { EmptyStatePanel } from "../ui/EmptyStatePanel";
import { SectionHeader } from "../ui/SectionHeader";

export function GovernanceSection({ approvalRef }: { approvalRef: string }) {
  return (
    <section id="governance" className="scroll-mt-28">
      <SectionHeader
        title="Governance"
        subtitle="Approvals, audit visibility, connector health, and trust status."
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card title="Approval Queue" right="4 pending">
          <p className="text-sm text-slate-300">
            2 delegation approvals, 1 connector scope, 1 policy exception. Linked ref:{" "}
            <span className="text-cyan-200">{approvalRef}</span>
          </p>
        </Card>
        <Card title="Audit Activity" right="Immutable trail">
          <p className="text-sm text-slate-300">142 read events, 12 draft actions, 0 high-risk writes today.</p>
        </Card>
        <Card title="Connector Health" right="9/10 healthy">
          <p className="text-sm text-slate-300">Slack latency elevated; Jira, CRM, BI, Calendar healthy.</p>
        </Card>
      </div>
      <div className="mt-4">
        <EmptyStatePanel
          title="No active policy exceptions"
          message="No overdue approvals right now in this scope."
        />
      </div>
    </section>
  );
}
