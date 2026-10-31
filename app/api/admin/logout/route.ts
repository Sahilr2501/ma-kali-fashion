import { clearAdminSession } from "@/lib/auth";
import { jsonOk } from "@/lib/request";

export async function POST() {
  await clearAdminSession();
  return jsonOk({ message: "Signed out." });
}
