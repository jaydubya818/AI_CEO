export function Sparkline({
  points,
  stroke = "rgba(34,211,238,0.9)",
}: {
  points: number[];
  stroke?: string;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(max - min, 1);
  const coordinates = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="mt-3 h-8 w-full">
      <polyline fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" points={coordinates} />
    </svg>
  );
}
