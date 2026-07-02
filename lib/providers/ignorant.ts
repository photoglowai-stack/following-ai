import type { ProviderContext, ProviderResult } from "@/lib/types";
import { normalizeAccountSignal } from "@/lib/normalizers";
import { providerResult, purposeGuard } from "@/lib/providers/common";
import { safeExec } from "@/lib/safeExec";

export async function runIgnorant(context: ProviderContext): Promise<ProviderResult> {
  const blocked = purposeGuard("ignorant", context.purpose, "sensitive");
  if (blocked) {
    return blocked;
  }
  const start = Date.now();
  if (context.type !== "phone") {
    return providerResult("ignorant", "skipped", [], ["Ignorant only supports phone lookups."], Date.now() - start);
  }

  const result = await safeExec("ignorant", [context.query], { timeoutMs: context.timeoutMs });
  const runtimeMs = Date.now() - start;
  if (!result.ok) {
    return providerResult("ignorant", "error", [], ["Ignorant failed, timed out, or is not installed."], runtimeMs, result.stderr);
  }

  const signals = `${result.stdout}\n${result.stderr}`
    .split(/\r?\n/)
    .filter((line) => /\[\+\]|used|exists/i.test(line))
    .map((line) => normalizeAccountSignal("ignorant", line.replace(/\[[^\]]+\]/g, "").trim().slice(0, 80) || "platform", null, "medium", { exists: true }))
    .slice(0, context.maxSignals);

  return providerResult("ignorant", "success", signals, ["Sensitive provider: no massive automation; use only for self-check or consent."], runtimeMs);
}
