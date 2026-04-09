import type { NavItem } from "@/lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function Sidebar({
  items,
  activeSection,
  mobileOpen,
  onSelect,
}: {
  items: NavItem[];
  activeSection: string;
  mobileOpen: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <aside
      className={`fixed inset-y-16 left-0 z-40 w-64 border-r border-white/10 bg-[#080d18]/95 p-4 backdrop-blur-xl transition md:static md:inset-auto md:block md:translate-x-0 md:rounded-2xl md:border md:bg-white/[0.02] ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <p className="mb-4 px-2 text-xs uppercase tracking-widest text-slate-500">Command Center</p>
      <nav className="space-y-1">
        {items.map((item) => (
          <Button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            variant="ghost"
            className={`block h-9 w-full justify-start rounded-xl px-3 py-2 text-left text-sm transition ${
              activeSection === item.id
                ? "bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/25"
                : "text-slate-300"
            }`}
          >
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-xs text-slate-400">System Trust</p>
          <Badge variant="muted">Healthy</Badge>
        </div>
        <p className="mt-1 text-sm font-medium text-slate-100">96% source coverage</p>
        <p className="mt-2 text-xs text-slate-500">Last retrieval refresh: 2m ago</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[96%] rounded-full bg-cyan-400" />
        </div>
      </div>
    </aside>
  );
}
