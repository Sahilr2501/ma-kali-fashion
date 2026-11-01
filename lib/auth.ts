import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import {
  COOKIE_NAME,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from "./session";

export async function getAdminSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return null;
  }
  return session;
}

function envValue(name: string) {
  return process.env[name]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

export async function verifyAdminCredentials(username: string, password: string) {
  const expectedUser = envValue("ADMIN_USERNAME");
  const passwordHash = envValue("ADMIN_PASSWORD_HASH");
  if (!expectedUser || !passwordHash.startsWith("$2")) {
    return false;
  }
  if (username !== expectedUser) {
    await bcrypt.compare(password, passwordHash);
    return false;
  }
  return bcrypt.compare(password, passwordHash);
}

export async function establishAdminSession(username: string) {
  const token = await createSessionToken(username);
  const jar = await cookies();
  const options = sessionCookieOptions();
  jar.set(options.name, token, options);
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { ...sessionCookieOptions(), maxAge: 0 });
}
