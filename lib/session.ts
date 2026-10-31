const COOKIE_NAME = "mkfa_admin";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) return null;
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array | string) {
  const buffer =
    typeof bytes === "string"
      ? new TextEncoder().encode(bytes)
      : bytes instanceof Uint8Array
        ? bytes
        : new Uint8Array(bytes);
  let binary = "";
  buffer.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function fromBase64Url(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmac(message: string) {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toBase64Url(signature);
}

export async function createSessionToken(username: string) {
  if (!getSecret()) {
    throw new Error("SESSION_SECRET must be set to a long random value");
  }
  const payload = JSON.stringify({
    u: username,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const encoded = toBase64Url(payload);
  const signature = await hmac(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token || !getSecret()) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  try {
    const expected = await hmac(encoded);
    if (expected.length !== signature.length) return null;
    let mismatch = 0;
    for (let i = 0; i < expected.length; i += 1) {
      mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    }
    if (mismatch !== 0) return null;

    const json = new TextDecoder().decode(fromBase64Url(encoded));
    const payload = JSON.parse(json) as { u?: string; exp?: number };
    if (!payload.u || !payload.exp || payload.exp < Date.now()) return null;
    return { username: payload.u };
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  };
}

export { COOKIE_NAME };
