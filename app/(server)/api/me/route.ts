import {requireUser} from "@/app/(server)/lib/auth/authService";
import {getUserById} from "@/app/(server)/lib/user/userService";
import serverApiResponse from "../serverApiResponse";
import {apiLogger} from "../api.utils";

export async function GET() {
  const log = apiLogger("GET", "/api/me");

  let userId: string;
  try {
    const {id} = await requireUser();
    userId = id;
  } catch (e) {
    log("error", "Login required", e);
    return serverApiResponse(401, "Login required", e);
  }
  try {
    const user = await getUserById(userId);

    if (!user) {
      log("error", "User not found", {});
      return serverApiResponse(404, "User not found", {});
    }

    log("info", "Me fetched");
    return serverApiResponse(200, "Me fetched", user);
  } catch (e) {
    log("error", "Failed to load me", {});
    return serverApiResponse(500, "Failed to load me", e);
  }
}
