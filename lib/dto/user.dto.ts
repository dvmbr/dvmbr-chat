import { BaseResponse, ListResponse } from "@/lib/utils/response";

// 내부 모델/공통 타입
export type User = {
  id: number;
  nickname: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUser = {
  nickname: string;
};

export type UpdateUser = {
  nickname?: string;
};

export type DeleteUser = {
  id: number;
};

export type getUser = BaseResponse<User>;
export type getUsers = ListResponse<User>;
