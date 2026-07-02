import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type { ProviderContext, ProviderResult, Signal } from "@/lib/types";
import { normalizeAccountSignal } from "@/lib/normalizers";
import { providerResult } from "@/lib/providers/common";

type WhatsMyNameSite = {
  name?: unknown;
  uri_check?: unknown;
  urlMain?: unknown;
};

export async function runWhatsMyName(context: ProviderContext): Promise<ProviderResult> {
  const start = Date.now();
  if (context.type !== "username") {
    return providerResult("whatsmyname", "skipped", [], ["WhatsMyName only supports username lookups."], Date.now() - start);
  }

  const datasetPath = path.join(process.cwd(), "data", "whatsmyname.json");
  if (!existsSync(datasetPath)) {
    return providerResult(
      "whatsmyname",
      "partial",
      [],
      ["WhatsMyName dataset not found. Download web_accounts_list.json manually into data/whatsmyname.json. No sites were queried."],
      Date.now() - start,
    );
  }

  const raw = await readFile(datasetPath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const sites = extractSites(parsed).slice(0, 30);
  const signals: Signal[] = sites
    .map((site) => {
      const name = typeof site.name === "string" ? site.name : "Unknown platform";
      const template = typeof site.uri_check === "string" ? site.uri_check : typeof site.urlMain === "string" ? site.urlMain : null;
      if (!template || !template.includes("{account}")) {
        return null;
      }
      return normalizeAccountSignal("whatsmyname", name, template.replace("{account}", encodeURIComponent(context.query)), "low", { demoDataset: true });
    })
    .filter((signal): signal is Signal => Boolean(signal))
    .slice(0, context.maxSignals);

  return providerResult(
    "whatsmyname",
    "success",
    signals,
    ["WhatsMyName provider is dataset-first in this MVP; it does not spam public sites."],
    Date.now() - start,
  );
}

function extractSites(value: unknown): WhatsMyNameSite[] {
  if (typeof value !== "object" || value === null) {
    return [];
  }
  const record = value as Record<string, unknown>;
  const candidates = [record.sites, record.web_accounts, record.accounts, value];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is WhatsMyNameSite => typeof item === "object" && item !== null);
    }
  }
  return [];
}
