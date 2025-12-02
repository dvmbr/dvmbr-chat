import {ApiBase} from "@/types/api";
import {NextResponse} from "next/server";

// 성공 응답
export function apiSuccess<T = unknown>(
  message: string,
  data?: T,
  status: number = 200
) {
  const body: ApiBase<T> = {
    ok: true,
    message,
    ...(data !== undefined ? {data} : {}),
  };

  return NextResponse.json(body, {status});
}

// 리소스 생성 시 (201)
export function apiCreated<T = unknown>(message: string, data?: T) {
  return apiSuccess<T>(message, data, 201);
}

// 에러 응답
export function apiError(message: string, status: number = 400) {
  const body: ApiBase<never> = {
    ok: false,
    message,
  };

  return NextResponse.json(body, {status});
}
