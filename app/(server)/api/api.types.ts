import {NextResponse} from "next/server";

export type ApiResponseBody<T> = {
  ok: boolean;
  message: string;
  data: T;
};

export type ServerApiResponse<T> = NextResponse<ApiResponseBody<T>>;
