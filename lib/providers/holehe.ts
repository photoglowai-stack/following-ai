import type { ProviderContext, ProviderResult } from "@/lib/types";
import { normalizeAccountSignal } from "@/lib/normalizers";
import { providerResult, purposeGuard } from "@/lib/providers/common";
import { safeExec } from "@/lib/safeExec";

export async function runHolehe(context: ProviderContext): Promise<ProviderResult> {
  const blocked = purposeGuard("holehe", context.purpose, "sensitive");
  if (blocked) {
    return blocked;
  }
  const start = Date.now();
  if (context.type !== "email") {
    return providerResult("holehe", "skipped", [], ["Holehe only supports email."], Date.now() - start);
  }

  const result = await safeExec("holehe", [context.query, "--only-used"], { timeoutMs: context.timeoutMs });
  const runtimeMs = Date.now() - start;
  if (!result.ok) {
    return providerResult("holehe", "error", [], ["Holehe failed, timed out, or is not installed."], runtimeMs, result.stderr);
  }

  const signals = `${result.stdout}\n${result.stderr}`
    .split(/\r?\n/)
    .filter((line) => /\[\+\]|used|exists/i.test(line))
    .map((line) => normalizeAccountSignal("holehe", line.replace(/\[[^\]]+\]/g, "").trim().slice(0, 80) || "platform", null, "medium", { exists: true }))
    .slice(0, context.maxSignals);

  return providerResult("holehe", "success", signals, ["Sensitive provider: use only for self-check or explicit consent. No storage is performed."], runtimeMs);
}
