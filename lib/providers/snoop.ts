import type { ProviderContext, ProviderResult } from "@/lib/types";
import { runUrlParsingCliProvider } from "@/lib/providers/common";

export async function runSnoop(context: ProviderContext): Promise<ProviderResult> {
  if (context.type !== "username") {
    return { provider: "snoop", status: "skipped", signals: [], warnings: ["Snoop only supports username lookups."], runtimeMs: 0 };
  }
  return runUrlParsingCliProvider("snoop", "snoop", [context.query], context);
}
