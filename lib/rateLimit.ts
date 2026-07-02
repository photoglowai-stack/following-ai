type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string): { allowed: true; remaining: number } | { allowed: false; retryAfterSeconds: number } {
  const limit = Number.parseInt(process.env.RATE_LIMIT_PER_HOUR ?? "10", 10);
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: Math.max(0, limit - 1) };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - bucket.count) };
}

export function rateLimitKeyFromRequest(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
