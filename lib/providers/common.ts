import type { LookupPurpose, ProviderContext, ProviderResult, Signal } from "@/lib/types";
import { normalizeUrlSignal } from "@/lib/normalizers";
import { safeExec } from "@/lib/safeExec";
import { isSensitivePurposeAllowed } from "@/lib/validation";

const urlPattern = /https?:\/\/[^\s"'<>]+/g;

export function providerResult(
  provider: string,
  status: ProviderResult["status"],
  signals: Signal[],
  warnings: string[],
  runtimeMs: number,
  error?: string,
): ProviderResult {
  return { provider, status, signals, warnings, runtimeMs, error };
}

export function parseUrlsFromText(provider: string, text: string, maxSignals: number): Signal[] {
  const urls = Array.from(new Set(text.match(urlPattern) ?? []));
  return urls.slice(0, maxSignals).map((url) => normalizeUrlSignal(provider, url, "medium"));
}

export async function runUrlParsingCliProvider(
  provider: string,
  command: string,
  args: string[],
  context: ProviderContext,
  warnings: string[] = [],
): Promise<ProviderResult> {
  const start = Date.now();
  const result = await safeExec(command, args, { timeoutMs: context.timeoutMs });
  const runtimeMs = Date.now() - start;

  if (!result.ok) {
    return providerResult(
      provider,
      "error",
      [],
      [...warnings, result.timedOut ? "Provider timed out." : "Provider command failed or is not installed."],
      runtimeMs,
      result.stderr || "Provider execution failed.",
    );
  }

  return providerResult(provider, "success", parseUrlsFromText(provider, `${result.stdout}\n${result.stderr}`, context.maxSignals), warnings, runtimeMs);
}

export function purposeGuard(provider: string, purpose: LookupPurpose, allowed: "sensitive" | "self_only"): ProviderResult | null {
  if (allowed === "sensitive" && !isSensitivePurposeAllowed(purpose)) {
    return providerResult(provider, "skipped", [], ["Sensitive provider skipped: purpose must be self_check or consent."], 0);
  }
  if (allowed === "self_only" && purpose !== "self_check") {
    return providerResult(provider, "skipped", [], ["Provider skipped: this integration is self_check only."], 0);
  }
  return null;
}
