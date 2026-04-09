import { BellRing, Menu, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function TopNav({
  query,
  onQueryChange,
  onToggleMobileNav,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onToggleMobileNav: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b14]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1700px] items-center gap-3 px-4 md:px-6">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="md:hidden"
          onClick={onToggleMobileNav}
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="mr-2 flex items-center gap-2 text-sm font-semibold tracking-[0.02em]">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400" />
          AI CEO Agent
          <Badge variant="accent" className="hidden md:inline-flex">
            Live Signal
          </Badge>
        </div>
        <div className="hidden flex-1 items-center md:flex">
          <Input
            aria-label="Ask the company"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Ask the company anything..."
            className="max-w-2xl"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden lg:inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            New Brief
          </Button>
          <Button variant="default" size="sm" className="hidden lg:inline-flex">
            New Decision
          </Button>
          <Button variant="warning" size="sm">
            <BellRing className="h-3.5 w-3.5" />
            4 Approvals
          </Button>
          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-medium">
            JW
          </div>
        </div>
      </div>
    </header>
  );
}
