import { NextResponse } from "next/server";
import { getErrorMessage } from "./error";
import type {
  ErrorResponse,
  OkResponse,
  ListData,
} from "@/lib/schema/response.schema";

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
): NextResponse<OkResponse<ListData<T>>> {
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
      data: null,
      error: getErrorMessage(error),
      statusCode,
      timestamp: new Date().toISOString(),
      meta: meta,
    },
    { status: statusCode },
  );
}
