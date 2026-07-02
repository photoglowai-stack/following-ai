import type { ProviderContext, ProviderResult, Signal } from "@/lib/types";
import { normalizeAccountSignal } from "@/lib/normalizers";
import { providerResult } from "@/lib/providers/common";
import { safeExec } from "@/lib/safeExec";

export async function runSocialscan(context: ProviderContext): Promise<ProviderResult> {
  const start = Date.now();
  if (context.type !== "email" && context.type !== "username") {
    return providerResult("socialscan", "skipped", [], ["socialscan only supports email or username."], Date.now() - start);
  }

  const result = await safeExec("socialscan", [context.query], { timeoutMs: context.timeoutMs });
  const runtimeMs = Date.now() - start;
  if (!result.ok) {
    return providerResult("socialscan", "error", [], ["socialscan failed, timed out, or is not installed."], runtimeMs, result.stderr);
  }

  const signals = parseSocialscan(`${result.stdout}\n${result.stderr}`).slice(0, context.maxSignals);
  return providerResult("socialscan", "success", signals, ["Respect platform rate limits; socialscan is disabled by default."], runtimeMs);
}

function parseSocialscan(text: string): Signal[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines
    .filter((line) => /found|exists|available|registered/i.test(line))
    .map((line) => {
      const platform = line.split(/\s+/)[0]?.replace(/[:]/g, "") || "platform";
      return normalizeAccountSignal("socialscan", platform, null, /found|registered|exists/i.test(line) ? "medium" : "low", { status: line.slice(0, 120) });
    });
}
