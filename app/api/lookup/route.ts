import { NextResponse } from "next/server";
import { maskQuery } from "@/lib/masking";
import { checkRateLimit, rateLimitKeyFromRequest } from "@/lib/rateLimit";
import { scoreSignals } from "@/lib/scoring";
import { buildHumanSummary, DEFAULT_WARNINGS } from "@/lib/summary";
import { validateLookupPayload } from "@/lib/validation";
import { runProviders } from "@/lib/providerRunner";
import type { LookupResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(rateLimitKeyFromRequest(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        status: "error",
        error: "Local rate limit exceeded.",
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", error: "Invalid JSON payload." }, { status: 400 });
  }

  const validation = validateLookupPayload(body);
  if (!validation.ok) {
    return NextResponse.json({ status: "error", error: validation.error }, { status: 400 });
  }

  const providerReport = await runProviders(validation.value);
  const confidenceScore = scoreSignals(validation.value.type, providerReport.signals);
  const response: LookupResponse = {
    status: providerReport.status,
    type: validation.value.type,
    queryMasked: maskQuery(validation.value.type, validation.value.query),
    purpose: validation.value.purpose,
    confidenceScore,
    summary: buildHumanSummary(validation.value.type, confidenceScore, providerReport.signals),
    providersUsed: providerReport.providersUsed,
    signals: providerReport.signals,
    warnings: Array.from(new Set([...DEFAULT_WARNINGS, ...providerReport.warnings])),
    benchmark: {
      totalRuntimeMs: providerReport.totalRuntimeMs,
      providerStats: providerReport.providerStats,
    },
  };

  return NextResponse.json(response);
}
