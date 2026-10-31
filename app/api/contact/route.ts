import { sendContactEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { clientKey, isSameOrigin, jsonError, jsonOk } from "@/lib/request";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError("This request is not allowed.", 403);
  if (!rateLimit(`contact:${clientKey(request)}`, 3, 15 * 60 * 1000)) {
    return jsonError("Too many messages. Please wait and try again.", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonError("Message details could not be read.", 400);
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const message = String(body.message || "").trim();
  if (name.length < 2 || !email.includes("@") || message.length < 10) {
    return jsonError("Please complete your name, email, and message.", 400);
  }

  const result = await sendContactEmail({ name, email, phone, message });
  if (!result.accepted) {
    return jsonError("Your message could not be sent. Please try again later or use the store email.", 503);
  }
  return jsonOk({ message: "Thank you. Your message has been sent to the store." });
}
