import type { ProviderContext, ProviderResult } from "@/lib/types";
import { normalizePhoneSignal } from "@/lib/normalizers";
import { providerResult } from "@/lib/providers/common";
import { safeExec } from "@/lib/safeExec";

export async function runPhoneInfoga(context: ProviderContext): Promise<ProviderResult> {
  const start = Date.now();
  if (context.type !== "phone") {
    return providerResult("phoneinfoga", "skipped", [], ["PhoneInfoga only supports phone lookups."], Date.now() - start);
  }

  const result = await safeExec("phoneinfoga", ["scan", "-n", context.query], { timeoutMs: context.timeoutMs });
  const runtimeMs = Date.now() - start;
  if (!result.ok) {
    return providerResult("phoneinfoga", "error", [], ["PhoneInfoga failed, timed out, or is not installed."], runtimeMs, result.stderr);
  }

  const text = `${result.stdout}\n${result.stderr}`;
  const signals = [
    extractPhoneInfo(text, "country"),
    extractPhoneInfo(text, "carrier"),
    extractPhoneInfo(text, "line type"),
    extractPhoneInfo(text, "format"),
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => normalizePhoneSignal("phoneinfoga", "Technical phone metadata found", "medium", { value: value.slice(0, 100) }))
    .slice(0, context.maxSignals);

  return providerResult("phoneinfoga", "success", signals, ["Technical phone metadata only; this does not identify the owner."], runtimeMs);
}

function extractPhoneInfo(text: string, key: string): string | null {
  const line = text.split(/\r?\n/).find((candidate) => candidate.toLowerCase().includes(key));
  return line?.trim() ?? null;
}
