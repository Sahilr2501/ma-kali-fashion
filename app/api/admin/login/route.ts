import { adminCredentialsConfigured, establishAdminSession, verifyAdminCredentials } from "@/lib/auth";
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
  const password = String(body.password || "").trim();

  if (!adminCredentialsConfigured()) {
    console.error("Admin login is not configured: set ADMIN_USERNAME and ADMIN_PASSWORD on the host.");
    return jsonError(
      "Admin login is not configured on this server. Add ADMIN_USERNAME and ADMIN_PASSWORD in Vercel environment variables, then redeploy.",
      503,
    );
  }

  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    return jsonError("The username or password is incorrect.", 401);
  }

  await establishAdminSession(username);
  return jsonOk({ message: "Signed in." });
}
