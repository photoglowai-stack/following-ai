import type { ProviderContext, ProviderResult, Signal } from "@/lib/types";
import {
  normalizeAccountSignal,
  normalizeEmailSignal,
  normalizePhoneSignal,
  normalizeUrlSignal,
  normalizeValidationSignal,
} from "@/lib/normalizers";
import { providerResult } from "@/lib/providers/common";

export async function runMockProvider(context: ProviderContext): Promise<ProviderResult> {
  const start = Date.now();
  const signals: Signal[] = [];

  if (context.type === "email") {
    signals.push(
      normalizeEmailSignal("mock", "Email format appears valid", "medium", { validationOnly: true }),
      normalizeAccountSignal("mock", "example-forum.test", "https://example-forum.test/profile/demo-user", "low", { demo: true }),
      normalizeAccountSignal("mock", "portfolio.example", "https://portfolio.example/contact/demo", "low", { demo: true }),
    );
  }

  if (context.type === "phone") {
    signals.push(
      normalizePhoneSignal("mock", "Phone format appears valid", "medium", { countryHint: "FR", lineType: "mobile", demo: true }),
      normalizeValidationSignal("mock", "Public phone metadata demo signal", "low", { validationOnly: true }),
    );
  }

  if (context.type === "username") {
    signals.push(
      normalizeUrlSignal("mock", "https://github.com/demo-user", "medium"),
      normalizeUrlSignal("mock", "https://mastodon.social/@demo-user", "low"),
      normalizeUrlSignal("mock", "https://dev.to/demo-user", "low"),
    );
  }

  if (context.type === "name") {
    signals.push(
      normalizeAccountSignal("mock", "public directory demo", null, "low", { matchType: "name-only", demo: true }),
      normalizeAccountSignal("mock", "conference page demo", "https://events.example/speakers/demo", "low", { matchType: "weak-name-match", demo: true }),
    );
  }

  if (context.type === "wallet") {
    signals.push({
      provider: "mock",
      category: "wallet_activity",
      label: "Demo public chain activity found",
      confidence: "low",
      url: "https://etherscan.io/address/0x0000000000000000000000000000000000000000",
      metadata: { chain: "ethereum", demo: true, risk: "unknown" },
    });
  }

  return providerResult("mock", "success", signals.slice(0, context.maxSignals), ["Mock mode is enabled; no external provider was called."], Date.now() - start);
}
