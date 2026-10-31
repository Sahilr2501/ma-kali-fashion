import { establishAdminSession, verifyAdminCredentials } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { clientKey, isSameOrigin, jsonError, jsonOk } from "@/lib/request";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("This request is not allowed.", 403);
  if (!rateLimit(`login:${clientKey(request)}`, 10, 15 * 60 * 1000)) {
    return jsonError("Too many login attempts. Please wait and try again.", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Login details could not be read.", 400);
  }

  const username = String(body.username || "").trim();
  const password = String(body.password || "");
  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    return jsonError("The username or password is incorrect.", 401);
  }

  await establishAdminSession(username);
  return jsonOk({ message: "Signed in." });
}
