import { apiClient } from "@/lib/api-client";
import { ErrorResponse, ListResponse } from "@/lib/schema/response.schema";
import { RoomDTO } from "@/lib/schema/room.schema";
import { useQuery } from "@tanstack/react-query";

export function useGetRooms() {
  return useQuery<ListResponse<RoomDTO>["data"], ErrorResponse>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await apiClient.get(`rooms`).json<ListResponse<RoomDTO>>();

      return res.data;
    },
  });
}
