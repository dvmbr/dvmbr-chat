"use client";

import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { UserDto, CreateUserDto } from "@/lib/schema/user.schema";
import type { OkResponse } from "@/lib/schema/response.schema";

type UseCreateUserOptions = {
  onSuccess?: (data: OkResponse<UserDto>) => void;
};

export function useCreateUser(options?: UseCreateUserOptions) {
  return useMutation<OkResponse<UserDto>, Error, CreateUserDto>({
    mutationFn: async (payload) =>
      await apiClient
        .post("users", {
          json: payload,
        })
        .json<OkResponse<UserDto>>(),

    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
  });
}
