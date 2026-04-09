import { Card } from "../ui/Card";
import { SectionHeader } from "../ui/SectionHeader";

export function MeetingsSection() {
  return (
    <section id="meetings" className="scroll-mt-28">
      <SectionHeader title="Meetings" subtitle="Pre-brief, live support, and post-meeting action capture." />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card title="Upcoming Meetings">
          <p className="text-sm text-slate-300">Exec Staff · Tue 09:00 · Board Prep · Thu 14:00</p>
        </Card>
        <Card title="Pre-brief">
          <p className="text-sm text-slate-300">Open decisions, unresolved tensions, and critical questions ready.</p>
        </Card>
        <Card title="Post-meeting">
          <p className="text-sm text-slate-300">5 actions extracted · 2 escalations · 1 decision logged.</p>
        </Card>
      </div>
    </section>
  );
}
