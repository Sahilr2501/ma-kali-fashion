type Bucket = Map<string, number[]>;

const buckets: Bucket = new Map();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}

const recentCheckouts = new Map<string, { orderReference: string; createdAt: number }>();

export function rememberCheckout(fingerprint: string, orderReference: string) {
  recentCheckouts.set(fingerprint, { orderReference, createdAt: Date.now() });
}

export function findRecentCheckout(fingerprint: string) {
  const found = recentCheckouts.get(fingerprint);
  if (!found) return null;
  if (Date.now() - found.createdAt > 2 * 60 * 1000) {
    recentCheckouts.delete(fingerprint);
    return null;
  }
  return found;
}
