import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  EnterChatCreateBodyDTO,
  EnterChatDTO,
} from "@/lib/schema/entry.schema";

export function useRestoreEntry() {
  return useQuery<EnterChatDTO>({
    queryKey: ["entry"],
    queryFn: async () => {
      return apiClient.get("entry").json();
    },
    retry: false,
  });
}

export function useCreateEntry() {
  return useMutation<EnterChatDTO, Error, EnterChatCreateBodyDTO>({
    mutationFn: async (payload: EnterChatCreateBodyDTO) => {
      return apiClient
        .post("entry", {
          json: payload,
        })
        .json();
    },
  });
}
