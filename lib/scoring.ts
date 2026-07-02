import type { LookupType, Signal } from "@/lib/types";
import { hostnameFromUrl } from "@/lib/normalizers";

export function scoreSignals(type: LookupType, signals: Signal[]): number {
  let score = 0;

  for (const signal of signals) {
    if (signal.confidence === "high") {
      score += 25;
    } else if (signal.confidence === "medium") {
      score += 12;
    } else {
      score += 5;
    }

    if (signal.category === "validation") {
      score += 10;
    }
    if (signal.provider === "osint_industries") {
      score += 20;
    }
  }

  score += repeatedPlatformBonus(signals);

  if (type === "name") {
    score *= 0.7;
  }

  const independentProviders = new Set(signals.map((signal) => signal.provider)).size;
  if (independentProviders < 2) {
    score = Math.min(score, 50);
  }

  const onlyValidationSignals = signals.length > 0 && signals.every((signal) => signal.category === "validation");
  if (onlyValidationSignals) {
    score = Math.min(score, 35);
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

function repeatedPlatformBonus(signals: Signal[]): number {
  const platformProviders = new Map<string, Set<string>>();
  for (const signal of signals) {
    const platform =
      typeof signal.metadata.platform === "string"
        ? signal.metadata.platform
        : signal.url
          ? hostnameFromUrl(signal.url)
          : null;
    if (!platform) {
      continue;
    }
    const providers = platformProviders.get(platform) ?? new Set<string>();
    providers.add(signal.provider);
    platformProviders.set(platform, providers);
  }

  let bonus = 0;
  for (const providers of platformProviders.values()) {
    if (providers.size >= 2) {
      bonus += 15;
    }
  }
  return bonus;
}
