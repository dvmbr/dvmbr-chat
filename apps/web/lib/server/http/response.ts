import "server-only";

import { NextResponse } from "next/server";
import type {
  ErrorResponse,
  ListResponse,
  OkResponse,
} from "@/lib/schemas/response/schema";
import { toErrorResponse } from "./error-response";

export function sendOk<T>(
  data: T,
  statusCode = 200,
  message?: string,
): NextResponse<OkResponse<T>> {
  if (statusCode === 204) {
    return new NextResponse(null, { status: statusCode });
  }
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

export function sendList<T>(
  items: T[],
  statusCode = 200,
  message?: string,
): NextResponse<ListResponse<T>> {
  if (statusCode === 204) {
    return new NextResponse(null, { status: statusCode });
  }
  return NextResponse.json(
    {
      data: {
        items,
        total: items.length,
      },
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode },
  );
}

export function sendError(
  error: unknown,
  statusCode = 500,
  meta?: Record<string, unknown>,
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      ...toErrorResponse(error, statusCode),
      timestamp: new Date().toISOString(),
      meta: meta,
    },
    { status: statusCode },
  );
}
