import type { ReactNode } from "react";
import type { NavItem } from "@/lib/types";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppShell({
  children,
  navItems,
  activeSection,
  mobileNavOpen,
  query,
  onToggleMobileNav,
  onNavSelect,
  onQueryChange,
}: {
  children: ReactNode;
  navItems: NavItem[];
  activeSection: string;
  mobileNavOpen: boolean;
  query: string;
  onToggleMobileNav: () => void;
  onNavSelect: (id: string) => void;
  onQueryChange: (value: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 antialiased">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute -top-24 left-1/4 h-72 w-72 animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-40 right-12 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(circle_at_50%_20%,black,transparent_78%)]" />
      </div>
      <TopNav query={query} onQueryChange={onQueryChange} onToggleMobileNav={onToggleMobileNav} />
      <div className="mx-auto flex w-full max-w-[1700px] gap-6 px-4 pb-10 pt-6 md:px-6">
        <Sidebar
          items={navItems}
          activeSection={activeSection}
          mobileOpen={mobileNavOpen}
          onSelect={onNavSelect}
        />
        {children}
      </div>
    </div>
  );
}
