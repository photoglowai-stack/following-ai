import type { BenchmarkEndpointResult, LookupRequest } from "@/lib/types";
import { maskQuery } from "@/lib/masking";
import { runProviders } from "@/lib/providerRunner";

export async function runBenchmark(input: LookupRequest): Promise<{
  benchmarkId: "local";
  queryMasked: string;
  results: BenchmarkEndpointResult[];
  recommendation: string;
}> {
  const report = await runProviders(input);
  const results = report.providerStats.map((stat) => ({
    provider: stat.provider,
    runtimeMs: stat.runtimeMs,
    signalsCount: stat.signalsCount,
    status: stat.status,
    warnings: stat.warnings,
  }));

  return {
    benchmarkId: "local",
    queryMasked: maskQuery(input.type, input.query),
    results,
    recommendation: recommendationForType(input.type),
  };
}

function recommendationForType(type: LookupRequest["type"]): string {
  if (type === "username") {
    return "Best provider mix: WhatsMyName + Sherlock + Maigret";
  }
  if (type === "email") {
    return "Best provider mix: syntax validation + OSINT Industries if licensed + socialscan in limited consent-based tests";
  }
  if (type === "phone") {
    return "Best provider mix: local validation + PhoneInfoga for technical metadata; keep sensitive tools off by default";
  }
  if (type === "wallet") {
    return "Best provider mix: OSINT Industries or a chain-specific public explorer, with careful false-positive handling";
  }
  return "Best provider mix: broad API search plus manual review; name-only matches should be treated as weak evidence";
}
