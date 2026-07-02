import type { ProviderContext, ProviderDefinition, ProviderResult, ProviderStats, Signal, ToolDefinition } from "@/lib/types";
import { normalizeUrl } from "@/lib/normalizers";
import { runBlackbird } from "@/lib/providers/blackbird";
import { runEmailValidation } from "@/lib/providers/emailValidation";
import { runGhunt } from "@/lib/providers/ghunt";
import { runH8mail } from "@/lib/providers/h8mail";
import { runHolehe } from "@/lib/providers/holehe";
import { runIgnorant } from "@/lib/providers/ignorant";
import { runMaigret } from "@/lib/providers/maigret";
import { runMockProvider } from "@/lib/providers/mockProvider";
import { searchOsintIndustries } from "@/lib/providers/osintIndustries";
import { runPhoneInfoga } from "@/lib/providers/phoneInfoga";
import { runPhoneValidation } from "@/lib/providers/phoneValidation";
import { runReconNg } from "@/lib/providers/reconNg";
import { runSherlock } from "@/lib/providers/sherlock";
import { runSnoop } from "@/lib/providers/snoop";
import { runSocialscan } from "@/lib/providers/socialscan";
import { runSpiderFoot } from "@/lib/providers/spiderfoot";
import { runUsernameValidation } from "@/lib/providers/usernameValidation";
import { runUserRecon } from "@/lib/providers/userRecon";
import { runWhatsMyName } from "@/lib/providers/whatsMyName";
import { commandExists } from "@/lib/safeExec";
import { getToolsForType, isMockMode, isToolEnabled, maxSignalsPerProvider, providerTimeoutMs } from "@/lib/toolRegistry";

const providerMap: Record<string, ProviderDefinition["run"]> = {
  osint_industries: searchOsintIndustries,
  whatsmyname: runWhatsMyName,
  socialscan: runSocialscan,
  sherlock: runSherlock,
  maigret: runMaigret,
  blackbird: runBlackbird,
  holehe: runHolehe,
  h8mail: runH8mail,
  ghunt: runGhunt,
  phoneinfoga: runPhoneInfoga,
  ignorant: runIgnorant,
  snoop: runSnoop,
  userrecon: runUserRecon,
  spiderfoot: runSpiderFoot,
  reconng: runReconNg,
};

export interface ProviderRunReport {
  status: "success" | "partial" | "error";
  signals: Signal[];
  providersUsed: string[];
  warnings: string[];
  providerStats: ProviderStats[];
  totalRuntimeMs: number;
}

export async function runProviders(context: Omit<ProviderContext, "timeoutMs" | "maxSignals">): Promise<ProviderRunReport> {
  const start = Date.now();
  const fullContext: ProviderContext = {
    ...context,
    timeoutMs: providerTimeoutMs(),
    maxSignals: maxSignalsPerProvider(),
  };

  if (isMockMode()) {
    const mockResult = await runMockProvider(fullContext);
    const disabledStats = getToolsForType(context.type).map((tool) => toolToStats(tool, false, false, "disabled", 0, 0, ["Mock mode is active."]));
    return finalizeProviderResults([mockResult], [resultToStats(mockResult, true, true), ...disabledStats], Date.now() - start);
  }

  const tools = getToolsForType(context.type);
  const enabledTools = tools.filter((tool) => tool.directProvider && isToolEnabled(tool) && providerMap[tool.id]);
  const disabledStats = tools
    .filter((tool) => !enabledTools.some((enabledTool) => enabledTool.id === tool.id))
    .map((tool) => toolToStats(tool, isToolEnabled(tool), false, tool.directProvider ? "disabled" : "skipped", 0, 0, [tool.directProvider ? "Provider disabled by environment flag." : "Reference-only tool."]));

  const validationProviders = [runEmailValidation, runPhoneValidation, runUsernameValidation];
  const validationResults = await Promise.all(validationProviders.map((provider) => provider(fullContext)));
  const providerResults = await runWithConcurrency(
    enabledTools.map((tool) => ({ tool, run: providerMap[tool.id] })),
    3,
    async ({ run }) => run(fullContext),
  );

  const installedByTool = await Promise.all(
    enabledTools.map(async (tool) => ({
      id: tool.id,
      installed: tool.commandName ? await commandExists(tool.commandName) : tool.id === "osint_industries" ? Boolean(process.env.OSINT_INDUSTRIES_API_KEY) : true,
    })),
  );

  const providerStats = providerResults.map((result) => {
    const installed = installedByTool.find((item) => item.id === result.provider)?.installed ?? true;
    return resultToStats(result, true, installed);
  });

  const validationStats = validationResults
    .filter((result) => result.status !== "skipped")
    .map((result) => resultToStats(result, true, true));

  return finalizeProviderResults([...validationResults, ...providerResults], [...validationStats, ...providerStats, ...disabledStats], Date.now() - start);
}

function finalizeProviderResults(results: ProviderResult[], providerStats: ProviderStats[], totalRuntimeMs: number): ProviderRunReport {
  const activeResults = results.filter((result) => result.status !== "disabled" && result.status !== "skipped");
  const signals = dedupeAndMergeSignals(activeResults.flatMap((result) => result.signals));
  const warnings = Array.from(new Set(results.flatMap((result) => result.warnings)));
  const providersUsed = Array.from(new Set(activeResults.filter((result) => result.signals.length > 0).map((result) => result.provider)));
  const hasError = activeResults.some((result) => result.status === "error");

  return {
    status: hasError && signals.length === 0 ? "error" : hasError ? "partial" : "success",
    signals,
    providersUsed,
    warnings,
    providerStats,
    totalRuntimeMs,
  };
}

function dedupeAndMergeSignals(signals: Signal[]): Signal[] {
  const byKey = new Map<string, Signal & { providers?: string[] }>();

  for (const signal of signals) {
    const key = signal.url ? `url:${normalizeUrl(signal.url)}` : `label:${signal.provider}:${signal.label.toLowerCase()}`;
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, { ...signal, url: signal.url ? normalizeUrl(signal.url) : null });
      continue;
    }

    const providers = new Set([...(existing.providers ?? [existing.provider]), signal.provider]);
    existing.providers = Array.from(providers);
    existing.metadata = {
      ...existing.metadata,
      confirmedBy: existing.providers.join(", "),
      confirmations: existing.providers.length,
    };
    existing.confidence = upgradeConfidence(existing.confidence, signal.confidence, existing.providers.length);
  }

  return Array.from(byKey.values()).map((signal) => {
    delete signal.providers;
    return signal;
  });
}

function upgradeConfidence(current: Signal["confidence"], incoming: Signal["confidence"], confirmations: number): Signal["confidence"] {
  if (current === "high" || incoming === "high" || confirmations >= 2) {
    return "high";
  }
  if (current === "medium" || incoming === "medium") {
    return "medium";
  }
  return "low";
}

async function runWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let index = 0;

  async function runNext(): Promise<void> {
    const currentIndex = index;
    index += 1;
    if (currentIndex >= items.length) {
      return;
    }
    results[currentIndex] = await worker(items[currentIndex]);
    await runNext();
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runNext));
  return results;
}

function resultToStats(result: ProviderResult, enabled: boolean, installed: boolean): ProviderStats {
  return {
    provider: result.provider,
    enabled,
    installed,
    runtimeMs: result.runtimeMs,
    signalsCount: result.signals.length,
    status: result.status,
    warnings: result.warnings,
    error: result.error,
    confidenceAverage: averageConfidence(result.signals),
    falsePositiveWarning: result.signals.length > 0 ? "Manual review required; OSINT signals can be false positives." : undefined,
    commandAvailable: installed,
  };
}

function toolToStats(
  tool: ToolDefinition,
  enabled: boolean,
  installed: boolean,
  status: ProviderStats["status"],
  runtimeMs: number,
  signalsCount: number,
  warnings: string[],
): ProviderStats {
  return {
    provider: tool.id,
    enabled,
    installed,
    runtimeMs,
    signalsCount,
    status,
    warnings,
    commandAvailable: installed,
  };
}

function averageConfidence(signals: Signal[]): number {
  if (signals.length === 0) {
    return 0;
  }
  const values = signals.map((signal) => (signal.confidence === "high" ? 100 : signal.confidence === "medium" ? 60 : 25));
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
