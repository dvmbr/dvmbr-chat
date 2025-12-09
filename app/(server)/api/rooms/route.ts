import {requireUser} from "../../lib/auth/authService";
import {getRooms} from "../../lib/room/roomService";
import {apiLogger} from "../api.utils";
import serverApiResponse from "../serverApiResponse";

// GET /api/rooms -> 전체 방 불러오기
export async function GET() {
  const log = apiLogger("GET", "/api/rooms");

  let userId: string;
  try {
    const {id} = await requireUser();
    userId = id;
  } catch (e) {
    log("error", "Login required", e);
    return serverApiResponse(401, "Login required", e);
  }

  try {
    const rooms = await getRooms({userId});

    log("info", "Rooms fetched");
    return serverApiResponse(200, "Rooms fetched", rooms);
  } catch (e) {
    log("error", "Failed to fetch rooms", e);
    return serverApiResponse(500, "Failed to fetch rooms", e);
  }
}
