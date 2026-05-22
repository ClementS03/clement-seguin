// ── Lightweight in-memory rate limiter ─────────────────────────────
// Keyed by IP. Sliding window via timestamp-pruning.
// Note: in-memory means it resets on every cold start and is per-instance —
// fine for low-traffic forms (contact/newsletter), not for a real auth flow.
// For stronger guarantees, swap to Upstash Redis or Netlify Blobs.

import type { NextRequest } from "next/server";

const buckets = new Map<string, number[]>();

export type RateLimitOptions = {
  /** Max requests allowed per window */
  limit: number;
  /** Window length in milliseconds */
  windowMs: number;
};

export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/** Returns true if the request is allowed, false if rate-limited. */
export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const cutoff = now - windowMs;
  const hits = (buckets.get(key) ?? []).filter((t) => t > cutoff);

  if (hits.length >= limit) {
    const oldest = hits[0] ?? now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, oldest + windowMs - now),
    };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup to keep the map small
  if (buckets.size > 5000) {
    for (const [k, v] of buckets.entries()) {
      if (v.every((t) => t <= cutoff)) buckets.delete(k);
    }
  }

  return { allowed: true, remaining: limit - hits.length, resetMs: windowMs };
}
