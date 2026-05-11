import { apiClient } from "@/lib/api-client";
import type { EntryBodyDTO, EntryDTO } from "@/lib/schemas/entry.schema";
import type { ErrorResponse, OkResponse } from "@/lib/schemas/response.schema";
import { useMutation } from "@tanstack/react-query";

export default function useEntry() {
  return useMutation<EntryDTO, ErrorResponse, EntryBodyDTO | void>({
    mutationFn: async (body) => {
      const res = await apiClient
        .post("entry", { json: body })
        .json<OkResponse<EntryDTO>>();
      return res.data;
    },
  });
}
