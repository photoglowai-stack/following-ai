import type { LookupType, ProviderContext, ProviderResult, Signal } from "@/lib/types";
import { normalizeAccountSignal, normalizeBreachMetadataSignal, normalizePhoneSignal, normalizeValidationSignal } from "@/lib/normalizers";
import { providerResult } from "@/lib/providers/common";
import { isMockMode, maxSignalsPerProvider, providerTimeoutMs } from "@/lib/toolRegistry";

type SafeOsintItem = {
  module?: unknown;
  platform?: unknown;
  exists?: unknown;
  url?: unknown;
  category?: unknown;
};

export async function searchOsintIndustries(type: LookupType, query: string): Promise<ProviderResult>;
export async function searchOsintIndustries(context: ProviderContext): Promise<ProviderResult>;
export async function searchOsintIndustries(typeOrContext: LookupType | ProviderContext, query?: string): Promise<ProviderResult> {
  const context: ProviderContext =
    typeof typeOrContext === "string"
      ? {
          type: typeOrContext,
          query: query ?? "",
          purpose: "self_check",
          timeoutMs: providerTimeoutMs(),
          maxSignals: maxSignalsPerProvider(),
        }
      : typeOrContext;
  const start = Date.now();
  if (isMockMode() || (process.env.ENABLE_OSINT_INDUSTRIES ?? "false").toLowerCase() !== "true") {
    return providerResult("osint_industries", "disabled", [], ["OSINT Industries is disabled or mock mode is active."], Date.now() - start);
  }

  const apiKey = process.env.OSINT_INDUSTRIES_API_KEY;
  if (!apiKey) {
    return providerResult("osint_industries", "error", [], ["OSINT Industries API key is missing."], Date.now() - start);
  }

  const baseUrl = process.env.OSINT_INDUSTRIES_BASE_URL ?? "https://api.osint.industries";
  const url = new URL("/v2/request", baseUrl);
  url.searchParams.set("type", context.type);
  url.searchParams.set("query", context.query);
  url.searchParams.set("timeout", String(Math.ceil(context.timeoutMs / 1000)));

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(context.timeoutMs),
    });

    if (!response.ok) {
      return providerResult("osint_industries", "error", [], [`OSINT Industries returned HTTP ${response.status}.`], Date.now() - start);
    }

    const json = (await response.json()) as unknown;
    const signals = mapOsintIndustriesSignals(json).slice(0, context.maxSignals);
    return providerResult("osint_industries", "success", signals, ["External API response was filtered before returning to the UI."], Date.now() - start);
  } catch (error) {
    return providerResult("osint_industries", "error", [], ["OSINT Industries request failed or timed out."], Date.now() - start, error instanceof Error ? error.message : "Unknown error");
  }
}

function mapOsintIndustriesSignals(value: unknown): Signal[] {
  const items = extractItems(value);
  return items.map((item) => {
    const platform = typeof item.platform === "string" ? item.platform : typeof item.module === "string" ? item.module : "OSINT source";
    const url = typeof item.url === "string" && item.url.startsWith("http") ? item.url : null;
    const category = typeof item.category === "string" ? item.category : "";

    if (category.toLowerCase().includes("breach")) {
      return normalizeBreachMetadataSignal("osint_industries", `Safe breach metadata signal from ${platform}`, "medium", { platform });
    }
    if (category.toLowerCase().includes("phone")) {
      return normalizePhoneSignal("osint_industries", `Phone metadata signal from ${platform}`, "medium", { platform });
    }
    if (url) {
      return normalizeAccountSignal("osint_industries", platform, url, "medium");
    }
    return normalizeValidationSignal("osint_industries", `Validation signal from ${platform}`, "medium", {
      platform,
      exists: typeof item.exists === "boolean" ? item.exists : null,
    });
  });
}

function extractItems(value: unknown): SafeOsintItem[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is SafeOsintItem => typeof item === "object" && item !== null);
  }
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    for (const key of ["results", "data", "items", "signals"]) {
      if (Array.isArray(record[key])) {
        return record[key].filter((item): item is SafeOsintItem => typeof item === "object" && item !== null);
      }
    }
  }
  return [];
}
