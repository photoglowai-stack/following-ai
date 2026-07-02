import type { ProviderContext, ProviderResult } from "@/lib/types";
import { parseUrlsFromText, providerResult } from "@/lib/providers/common";
import { normalizeAccountSignal } from "@/lib/normalizers";
import { safeExec } from "@/lib/safeExec";

export async function runBlackbird(context: ProviderContext): Promise<ProviderResult> {
  const start = Date.now();
  if (context.type !== "email" && context.type !== "username") {
    return providerResult("blackbird", "skipped", [], ["Blackbird only supports email or username in this MVP."], Date.now() - start);
  }

  const mode = context.type === "email" ? "--email" : "--username";
  const result = await safeExec("blackbird", [mode, context.query], { timeoutMs: Math.max(context.timeoutMs, 60_000) });
  const runtimeMs = Date.now() - start;
  if (!result.ok) {
    return providerResult("blackbird", "error", [], ["Blackbird failed, timed out, or is not installed."], runtimeMs, result.stderr);
  }

  const text = `${result.stdout}\n${result.stderr}`;
  const signals = [...parseBlackbirdJson(text), ...parseUrlsFromText("blackbird", text, context.maxSignals)].slice(0, context.maxSignals);
  return providerResult("blackbird", "success", signals, ["Blackbird output was filtered; raw exports are not returned."], runtimeMs);
}

function parseBlackbirdJson(text: string) {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return [];
  }
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const items = Array.isArray(parsed) ? parsed : typeof parsed === "object" && parsed !== null ? Object.values(parsed) : [];
    return items
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .map((item) =>
        normalizeAccountSignal(
          "blackbird",
          typeof item.site === "string" ? item.site : typeof item.platform === "string" ? item.platform : "platform",
          typeof item.url === "string" ? item.url : null,
          "medium",
        ),
      );
  } catch {
    return [];
  }
}
