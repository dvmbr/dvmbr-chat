import {requireUser} from "../../lib/auth";
import {
  getLastMessagesForAllRooms,
  getUnreadCountsByRoom,
} from "../../lib/message";
import {getRooms} from "../../lib/room";
import {apiLogger} from "../../utils/apiLogger";
import serverApiResponse from "../serverApiResponse";

export type RoomsData = {
  rooms: {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  lastMessageMap: Record<string, string> | undefined;
  unreadCountsMap: Record<string, number> | undefined;
};

// GET /api/rooms -> 방 불러오기
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
    const [rooms, lastMessageMap, unreadCountsMap] = await Promise.all([
      getRooms(),
      getLastMessagesForAllRooms(),
      getUnreadCountsByRoom(userId),
    ]);

    log("info", "Rooms fetched");
    return serverApiResponse(200, "Rooms fetched", {
      rooms,
      lastMessageMap,
      unreadCountsMap,
    });
  } catch (e) {
    log("error", "Failed to fetch rooms", e);
    return serverApiResponse(500, "Failed to fetch rooms", e);
  }
}
