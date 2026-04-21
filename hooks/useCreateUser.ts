"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { CreateUserDTO, UserDTO } from "@/lib/schema/user.schema";
import type { OkResponse } from "@/lib/schema/response.schema";

type UseCreateUserOptions = {
  onSuccess?: (data: OkResponse<UserDTO>) => void;
};

export function useCreateUser(options?: UseCreateUserOptions) {
  return useMutation<OkResponse<UserDTO>, Error, CreateUserDTO>({
    mutationFn: async (payload) =>
      await apiClient
        .post("users", {
          json: payload,
        })
        .json<OkResponse<UserDTO>>(),

    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
  });
}
