import type { ProviderContext, ProviderResult } from "@/lib/types";
import { runUrlParsingCliProvider } from "@/lib/providers/common";

export async function runSherlock(context: ProviderContext): Promise<ProviderResult> {
  if (context.type !== "username") {
    return { provider: "sherlock", status: "skipped", signals: [], warnings: ["Sherlock only supports username lookups."], runtimeMs: 0 };
  }
  return runUrlParsingCliProvider("sherlock", "sherlock", [context.query, "--print-found", "--timeout", "10"], context);
}
