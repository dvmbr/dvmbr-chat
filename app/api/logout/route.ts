import {apiError, apiSuccess} from "@/lib/apiResponse";
import {clearSession} from "@/lib/auth";

// POST /api/logout
export async function POST() {
  try {
    await clearSession();

    return apiSuccess("Logged out successfully");
  } catch (e) {
    console.error("POST /api/logout error:", e);
    return apiError("Failed to logout", 500);
  }
}
