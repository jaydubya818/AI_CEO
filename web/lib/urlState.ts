export function getInitialParam(
  validValues: string[],
  key: string,
  fallback: string,
): string {
  if (typeof window === "undefined") return fallback;
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key);
  return value && validValues.includes(value) ? value : fallback;
}

export function syncUrlState(state: {
  riskId: string;
  decisionId: string;
  section: string;
}) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  params.set("risk", state.riskId);
  params.set("decision", state.decisionId);
  params.set("section", state.section);
  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", nextUrl);
}
