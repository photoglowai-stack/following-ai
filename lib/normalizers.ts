import type { Confidence, MetadataValue, Signal } from "@/lib/types";

function sanitizeMetadata(metadata: Record<string, MetadataValue>): Record<string, MetadataValue> {
  const blocked = ["password", "pass", "token", "cookie", "session", "sessionid", "secret", "raw"];
  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !blocked.some((blockedKey) => key.toLowerCase().includes(blockedKey))),
  );
}

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url.trim();
  }
}

export function normalizeUrlSignal(provider: string, url: string, confidence: Confidence = "medium"): Signal {
  const normalized = normalizeUrl(url);
  return {
    provider,
    category: "public_presence",
    label: `Public URL found on ${hostnameFromUrl(normalized)}`,
    confidence,
    url: normalized,
    metadata: {},
  };
}

export function normalizeAccountSignal(
  provider: string,
  platform: string,
  url: string | null,
  confidence: Confidence = "medium",
  metadata: Record<string, MetadataValue> = {},
): Signal {
  return {
    provider,
    category: "account_presence",
    label: `Possible account presence on ${platform}`,
    confidence,
    url: url ? normalizeUrl(url) : null,
    metadata: sanitizeMetadata({ platform, ...metadata }),
  };
}

export function normalizeEmailSignal(
  provider: string,
  label: string,
  confidence: Confidence = "low",
  metadata: Record<string, MetadataValue> = {},
): Signal {
  return {
    provider,
    category: "validation",
    label,
    confidence,
    url: null,
    metadata: sanitizeMetadata(metadata),
  };
}

export function normalizePhoneSignal(
  provider: string,
  label: string,
  confidence: Confidence = "low",
  metadata: Record<string, MetadataValue> = {},
): Signal {
  return {
    provider,
    category: "phone_metadata",
    label,
    confidence,
    url: null,
    metadata: sanitizeMetadata(metadata),
  };
}

export function normalizeBreachMetadataSignal(
  provider: string,
  label: string,
  confidence: Confidence = "medium",
  metadata: Record<string, MetadataValue> = {},
): Signal {
  return {
    provider,
    category: "breach_metadata",
    label,
    confidence,
    url: null,
    metadata: sanitizeMetadata(metadata),
  };
}

export function normalizeValidationSignal(
  provider: string,
  label: string,
  confidence: Confidence = "low",
  metadata: Record<string, MetadataValue> = {},
): Signal {
  return {
    provider,
    category: "validation",
    label,
    confidence,
    url: null,
    metadata: sanitizeMetadata(metadata),
  };
}

export function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "public web";
  }
}
