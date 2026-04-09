import type { AgentRole } from "@/lib/types";

const roleConfig: Record<AgentRole, { label: string; className: string }> = {
  specialist: {
    label: "Specialist",
    className: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200",
  },
  contrarian: {
    label: "Contrarian",
    className: "border-amber-300/25 bg-amber-400/10 text-amber-200",
  },
  moonshot: {
    label: "Moonshot",
    className: "border-violet-300/25 bg-violet-400/10 text-violet-200",
  },
  judge: {
    label: "Judge / QA",
    className: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
  },
  revenue: {
    label: "Revenue",
    className: "border-rose-300/25 bg-rose-400/10 text-rose-200",
  },
  compounder: {
    label: "Compounder",
    className: "border-cyan-300/25 bg-cyan-400/10 text-cyan-200",
  },
};

export function AgentRoleBadge({ role }: { role: AgentRole }) {
  const cfg = roleConfig[role];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
