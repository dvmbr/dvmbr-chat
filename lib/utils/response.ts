import { NextResponse } from "next/server";
import { getErrorMessage } from "./error";

export type BaseResponse<T> = {
  data: T;
  message?: string;
  error?: string;
  statusCode?: number; // HTTP 상태 코드
  timestamp?: string; // 응답 시간(ISO8601)
};

export type ListResponse<T> = {
  data: T[];
  message?: string;
  error?: string;
  total?: number;
  statusCode?: number;
  timestamp?: string;
};

export function successResponse<T>(
  data: T,
  message?: string,
  statusCode = 200,
): NextResponse<BaseResponse<T>> {
  return NextResponse.json(
    {
      data,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode },
  );
}

export function errorResponse(
  error: unknown,
  statusCode = 500,
): NextResponse<BaseResponse<null>> {
  return NextResponse.json(
    {
      data: null,
      error: getErrorMessage(error),
      statusCode,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode },
  );
}
