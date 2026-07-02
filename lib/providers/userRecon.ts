import type { ProviderContext, ProviderResult } from "@/lib/types";
import { runUrlParsingCliProvider } from "@/lib/providers/common";

export async function runUserRecon(context: ProviderContext): Promise<ProviderResult> {
  if (context.type !== "username") {
    return { provider: "userrecon", status: "skipped", signals: [], warnings: ["UserReCon only supports username lookups."], runtimeMs: 0 };
  }
  return runUrlParsingCliProvider("userrecon", "userrecon", [context.query], context, ["Legacy provider; benchmark quality before relying on it."]);
}
