import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { sendError } from "./response";

import {
  ERROR_CONSTANTS as E,
  type ErrorConstantKey,
} from "@/lib/constants/error-constants";

function sendErrorByKey(key: ErrorConstantKey, meta?: Record<string, unknown>) {
  const { error, statusCode } = E[key];

  return sendError(error, statusCode, meta);
}

export function badRequest(meta?: Record<string, unknown>) {
  return sendErrorByKey("BAD_REQUEST", meta);
}

export function unauthorized(meta?: Record<string, unknown>) {
  return sendErrorByKey("UNAUTHORIZED", meta);
}

export function forbidden(meta?: Record<string, unknown>) {
  return sendErrorByKey("FORBIDDEN", meta);
}

export function notFound(meta?: Record<string, unknown>) {
  return sendErrorByKey("NOT_FOUND", meta);
}

export function conflict(meta?: Record<string, unknown>) {
  return sendErrorByKey("CONFLICT", meta);
}

export function internalServerError(error: unknown) {
  console.error(
    "================== Internal Server Error ==================\n",
    error,
  );
  return sendError(error, E.INTERNAL_SERVER_ERROR.statusCode);
}

export function toErrorResponse(
  error: unknown,
  statusCode = 500,
): { error: string; statusCode: number; meta?: Record<string, unknown> } {
  // by error helpers
  if (typeof error === "string") {
    return {
      error,
      statusCode,
    };
  }

  // by Prisma
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          ...E.CONFLICT,
          meta: {
            prismaCode: "P2002",
          },
        };

      case "P2003":
        return {
          ...E.BAD_REQUEST,
          meta: {
            prismaCode: "P2003",
          },
        };

      case "P2025":
        return {
          ...E.NOT_FOUND,
          meta: { prismaCode: "P2025" },
        };

      default:
        return {
          ...E.INTERNAL_SERVER_ERROR,
        };
    }
  }

  // for any other unknown errors. never expose the actual error message to the client for security reasons, instead return a generic error message with the status code.

  if (error instanceof Error)
    return {
      error: E.INTERNAL_SERVER_ERROR.error,
      statusCode: E.INTERNAL_SERVER_ERROR.statusCode,
    };

  return {
    error: E.INTERNAL_SERVER_ERROR.error,
    statusCode: E.INTERNAL_SERVER_ERROR.statusCode,
  };
}
