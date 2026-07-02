import type { ProviderContext, ProviderResult } from "@/lib/types";
import { runUrlParsingCliProvider } from "@/lib/providers/common";

export async function runMaigret(context: ProviderContext): Promise<ProviderResult> {
  if (context.type !== "username") {
    return { provider: "maigret", status: "skipped", signals: [], warnings: ["Maigret only supports username lookups."], runtimeMs: 0 };
  }
  return runUrlParsingCliProvider("maigret", "maigret", [context.query, "--no-color", "--timeout", "10"], {
    ...context,
    timeoutMs: Math.max(context.timeoutMs, 45_000),
  });
}
