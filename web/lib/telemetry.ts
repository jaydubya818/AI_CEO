import type { TelemetryEvent, TelemetryLog } from "./types";

export function makeTelemetryLog(
  id: number,
  event: TelemetryEvent,
  meta: string,
): TelemetryLog {
  return {
    id,
    event,
    meta,
    time: `T+${id}`,
  };
}
