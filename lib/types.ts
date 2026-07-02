export type LookupType = "email" | "phone" | "username" | "name" | "wallet";

export type LookupPurpose =
  | "self_check"
  | "consent"
  | "fraud_prevention"
  | "security_audit"
  | "educational_demo";

export type Confidence = "low" | "medium" | "high";

export type ProviderCategory = LookupType | "framework";

export type RiskLevel = "low" | "medium" | "high";

export type ProviderStatus = "success" | "partial" | "error" | "disabled" | "skipped";

export type MetadataValue = string | number | boolean | null;

export interface LookupRequest {
  type: LookupType;
  query: string;
  purpose: LookupPurpose;
}

export interface Signal {
  provider: string;
  category:
    | "public_presence"
    | "validation"
    | "breach_metadata"
    | "phone_metadata"
    | "account_presence"
    | "wallet_activity"
    | "name_match";
  label: string;
  confidence: Confidence;
  url: string | null;
  metadata: Record<string, MetadataValue>;
}

export interface ProviderStats {
  provider: string;
  enabled: boolean;
  installed: boolean;
  runtimeMs: number;
  signalsCount: number;
  status: ProviderStatus;
  warnings: string[];
  error?: string;
  confidenceAverage?: number;
  falsePositiveWarning?: string;
  commandAvailable?: boolean;
}

export interface BenchmarkReport {
  totalRuntimeMs: number;
  providerStats: ProviderStats[];
}

export interface LookupResponse {
  status: "success" | "partial" | "error";
  type: LookupType;
  queryMasked: string;
  purpose: LookupPurpose;
  confidenceScore: number;
  summary: string;
  providersUsed: string[];
  signals: Signal[];
  warnings: string[];
  benchmark: BenchmarkReport;
}

export interface ProviderResult {
  provider: string;
  status: ProviderStatus;
  signals: Signal[];
  warnings: string[];
  runtimeMs: number;
  error?: string;
}

export interface ProviderContext {
  type: LookupType;
  query: string;
  purpose: LookupPurpose;
  timeoutMs: number;
  maxSignals: number;
}

export interface ProviderDefinition {
  id: string;
  run: (context: ProviderContext) => Promise<ProviderResult>;
}

export interface ToolDefinition {
  id: string;
  repo: string;
  category: ProviderCategory;
  enabledEnv: string;
  defaultEnabled: boolean;
  riskLevel: RiskLevel;
  priority: number;
  commandName: string | null;
  installHint: string;
  allowedTypes: LookupType[];
  notes: string;
  directProvider: boolean;
}

export interface ToolHealth {
  id: string;
  repo: string;
  installed: boolean;
  enabled: boolean;
  riskLevel: RiskLevel;
  supportedTypes: LookupType[];
  installHint: string;
  notes: string;
}

export interface BenchmarkEndpointResult {
  provider: string;
  runtimeMs: number;
  signalsCount: number;
  status: ProviderStatus;
  warnings: string[];
}
