import type { LookupType } from "@/lib/types";

export function maskQuery(type: LookupType, query: string): string {
  if (type === "email") {
    return maskEmail(query);
  }
  if (type === "phone") {
    return maskPhone(query);
  }
  if (type === "wallet") {
    return maskLongToken(query);
  }
  if (type === "name") {
    return maskName(query);
  }
  return query;
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) {
    return "***";
  }
  return `${localPart.slice(0, 1)}***@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) {
    return "***";
  }
  return `${phone.trim().startsWith("+") ? "+" : ""}***${digits.slice(-4)}`;
}

export function maskLongToken(value: string): string {
  if (value.length <= 12) {
    return "***";
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function maskName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1)}***`)
    .join(" ");
}

export function redactSensitiveText(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, (match) => maskEmail(match))
    .replace(/\+?[0-9][0-9 .()/-]{7,24}/g, (match) => maskPhone(match))
    .replace(/(password|passwd|token|cookie|sessionid|authorization)\s*[:=]\s*\S+/gi, "$1=[redacted]");
}
