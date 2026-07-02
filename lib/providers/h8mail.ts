import type { ProviderContext, ProviderResult } from "@/lib/types";
import { normalizeBreachMetadataSignal } from "@/lib/normalizers";
import { providerResult, purposeGuard } from "@/lib/providers/common";
import { safeExec } from "@/lib/safeExec";

export async function runH8mail(context: ProviderContext): Promise<ProviderResult> {
  const blocked = purposeGuard("h8mail", context.purpose, "sensitive");
  if (blocked) {
    return blocked;
  }
  const start = Date.now();
  if (context.type !== "email") {
    return providerResult("h8mail", "skipped", [], ["h8mail only supports email."], Date.now() - start);
  }

  const result = await safeExec("h8mail", ["-t", context.query], { timeoutMs: context.timeoutMs });
  const runtimeMs = Date.now() - start;
  if (!result.ok) {
    return providerResult("h8mail", "error", [], ["h8mail failed, timed out, or is not installed."], runtimeMs, result.stderr);
  }

  const signals = `${result.stdout}\n${result.stderr}`
    .split(/\r?\n/)
    .filter((line) => /breach|leak|found|comprom/i.test(line) && !/password|hash|token|secret/i.test(line))
    .map((line) => normalizeBreachMetadataSignal("h8mail", "Breach metadata mention found", "medium", { sourceHint: line.slice(0, 120) }))
    .slice(0, context.maxSignals);

  return providerResult("h8mail", "success", signals, ["Breach data must be handled carefully; passwords, hashes and secrets are filtered."], runtimeMs);
}
