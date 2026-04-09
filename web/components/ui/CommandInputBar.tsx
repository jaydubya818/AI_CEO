import { Button } from "./button";

export function CommandInputBar({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div>
      <textarea
        className="h-28 w-full resize-none rounded-xl border border-white/12 bg-[#050913] p-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/45 focus:ring-2 focus:ring-cyan-400/20"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask the company anything..."
      />
      <Button className="mt-3" size="sm" onClick={onSubmit}>
        Submit Query
      </Button>
    </div>
  );
}
