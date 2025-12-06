import {clearSession} from "@/app/(server)/lib/auth";
import serverApiResponse from "../serverApiResponse";
import {apiLogger} from "@/app/(server)/utils/apiLogger";

// POST /api/logout
export async function POST() {
  const log = apiLogger("POST", "/api/auth");
  try {
    await clearSession();

    log("info", "Logged out successfully");
    return serverApiResponse(200, "Logged out successfully");
  } catch (e) {
    log("error", "Failed to logout", e);
    return serverApiResponse(500, "Failed to logout");
  }
}
