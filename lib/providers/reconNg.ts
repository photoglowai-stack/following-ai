import type { ProviderContext, ProviderResult } from "@/lib/types";
import { providerResult } from "@/lib/providers/common";

export async function runReconNg(context: ProviderContext): Promise<ProviderResult> {
  return providerResult(
    "reconng",
    "skipped",
    [],
    [`Recon-ng supports ${context.type}, but this MVP keeps it out of the fast lookup flow because module selection can become invasive.`],
    0,
  );
}
