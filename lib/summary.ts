import type { LookupType, Signal } from "@/lib/types";

export const DEFAULT_WARNINGS = [
  "Results can be incomplete, outdated or false-positive.",
  "Use only for authorized checks.",
];

export function buildHumanSummary(type: LookupType, score: number, signals: Signal[]): string {
  if (signals.length === 0) {
    return `No usable ${type} signals were found in this run. This does not prove absence of exposure.`;
  }

  const providerCount = new Set(signals.map((signal) => signal.provider)).size;
  const publicSignals = signals.filter((signal) => signal.category !== "validation").length;
  const scoreLabel = score >= 70 ? "strong" : score >= 35 ? "moderate" : "limited";

  return `Found ${signals.length} safe signal${signals.length === 1 ? "" : "s"} from ${providerCount} provider${
    providerCount === 1 ? "" : "s"
  }. The current confidence is ${scoreLabel}; ${publicSignals} signal${publicSignals === 1 ? "" : "s"} may indicate public exposure.`;
}
