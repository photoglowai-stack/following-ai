import type { ProviderContext, ProviderResult } from "@/lib/types";
import { providerResult } from "@/lib/providers/common";

export async function runSpiderFoot(context: ProviderContext): Promise<ProviderResult> {
  return providerResult(
    "spiderfoot",
    "skipped",
    [],
    [`SpiderFoot supports ${context.type}, but this MVP exposes it as a health-check-only integration. Run it separately for deep investigations.`],
    0,
  );
}
