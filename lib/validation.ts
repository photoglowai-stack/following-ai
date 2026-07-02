import type { LookupPurpose, LookupRequest, LookupType } from "@/lib/types";

const lookupTypes: LookupType[] = ["email", "phone", "username", "name", "wallet"];
const purposes: LookupPurpose[] = [
  "self_check",
  "consent",
  "fraud_prevention",
  "security_audit",
  "educational_demo",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9][0-9 .()/-]{5,24}$/;
const usernamePattern = /^[a-zA-Z0-9._-]{2,64}$/;
const walletPattern = /^(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,90})$/;

export function isLookupType(value: unknown): value is LookupType {
  return typeof value === "string" && lookupTypes.includes(value as LookupType);
}

export function isLookupPurpose(value: unknown): value is LookupPurpose {
  return typeof value === "string" && purposes.includes(value as LookupPurpose);
}

export function validateLookupPayload(body: unknown): { ok: true; value: LookupRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Payload must be a JSON object." };
  }

  const candidate = body as Record<string, unknown>;
  if (!isLookupType(candidate.type)) {
    return { ok: false, error: "Invalid lookup type." };
  }

  if (typeof candidate.query !== "string" || candidate.query.trim().length < 2) {
    return { ok: false, error: "Query must be a non-empty string." };
  }

  if (!isLookupPurpose(candidate.purpose)) {
    return { ok: false, error: "Purpose is required and must be authorized." };
  }

  const query = candidate.query.trim();
  const formatError = validateQueryForType(candidate.type, query);
  if (formatError) {
    return { ok: false, error: formatError };
  }

  return {
    ok: true,
    value: {
      type: candidate.type,
      query,
      purpose: candidate.purpose,
    },
  };
}

export function validateQueryForType(type: LookupType, query: string): string | null {
  if (type === "email" && !emailPattern.test(query)) {
    return "Email format is invalid.";
  }
  if (type === "phone" && !phonePattern.test(query)) {
    return "Phone format is invalid. Use an international format when possible.";
  }
  if (type === "username" && !usernamePattern.test(query)) {
    return "Username format is invalid.";
  }
  if (type === "wallet" && !walletPattern.test(query)) {
    return "Wallet format is not recognized for this MVP.";
  }
  if (type === "name" && query.length < 3) {
    return "Name query is too short.";
  }
  return null;
}

export function isSensitivePurposeAllowed(purpose: LookupPurpose): boolean {
  return purpose === "self_check" || purpose === "consent";
}
