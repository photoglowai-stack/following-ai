import type { ProviderContext, ProviderResult } from "@/lib/types";
import { normalizeAccountSignal } from "@/lib/normalizers";
import { providerResult, purposeGuard } from "@/lib/providers/common";
import { safeExec } from "@/lib/safeExec";

export async function runGhunt(context: ProviderContext): Promise<ProviderResult> {
  const blocked = purposeGuard("ghunt", context.purpose, "self_only");
  if (blocked) {
    return blocked;
  }
  const start = Date.now();
  if (context.type !== "email") {
    return providerResult("ghunt", "skipped", [], ["GHunt only supports email in this MVP."], Date.now() - start);
  }

  const result = await safeExec("ghunt", ["email", context.query], { timeoutMs: context.timeoutMs });
  const runtimeMs = Date.now() - start;
  if (!result.ok) {
    return providerResult("ghunt", "error", [], ["GHunt failed or is not configured. Install and configure it manually; do not use third-party private sessions."], runtimeMs, result.stderr);
  }

  const signals = `${result.stdout}\n${result.stderr}`
    .split(/\r?\n/)
    .filter((line) => /profile|google|gaia|found/i.test(line) && !/cookie|token|session/i.test(line))
    .map((line) => normalizeAccountSignal("ghunt", "Google public metadata", null, "low", { safeSummary: line.slice(0, 120) }))
    .slice(0, context.maxSignals);

  return providerResult("ghunt", "success", signals, ["Self-check only. No cookies or private sessions are handled by this app."], runtimeMs);
}
