import { NextResponse } from "next/server";
import { checkRateLimit, rateLimitKeyFromRequest } from "@/lib/rateLimit";
import { runBenchmark } from "@/lib/benchmark";
import { validateLookupPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(rateLimitKeyFromRequest(request));
  if (!rateLimit.allowed) {
    return NextResponse.json({ status: "error", error: "Local rate limit exceeded.", retryAfterSeconds: rateLimit.retryAfterSeconds }, { status: 429 });
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

  return NextResponse.json(await runBenchmark(validation.value));
}
