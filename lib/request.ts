export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export function jsonError(message: string, status: number, extra?: Record<string, unknown>) {
  return Response.json({ ok: false, message, ...extra }, { status });
}

export function jsonOk(data: Record<string, unknown>, status = 200) {
  return Response.json({ ok: true, ...data }, { status });
}
