"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { EntryDTO, EntryRequestDTO } from "@/lib/schema/entry.schema";
import type { OkResponse } from "@/lib/schema/response.schema";

type UseEntryOptions = {
  onSuccess?: (data: OkResponse<EntryDTO>) => void;
};

export function useEntry(options?: UseEntryOptions) {
  return useMutation<OkResponse<EntryDTO>, Error, EntryRequestDTO>({
    mutationFn: async (payload) =>
      await apiClient
        .post("entry", {
          json: payload,
        })
        .json<OkResponse<EntryDTO>>(),

    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
  });
}
