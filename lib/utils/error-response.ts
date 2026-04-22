import { sendError } from "./response";

export function badRequest(
  message = "Invalid request",
  meta?: Record<string, unknown>,
) {
  return sendError(message, 400, meta);
}

export function unauthorized(meta?: Record<string, unknown>) {
  return sendError("Unauthorized", 401, meta);
}

export function forbidden(
  message = "Forbidden",
  meta?: Record<string, unknown>,
) {
  return sendError(message, 403, meta);
}

export function notFound(target = "Resource", meta?: Record<string, unknown>) {
  return sendError(`${target} not found`, 404, meta);
}

export function conflict(message = "Conflict", meta?: Record<string, unknown>) {
  return sendError(message, 409, meta);
}

export function serverError(
  message = "Internal server error",
  meta?: Record<string, unknown>,
) {
  return sendError(message, 500, meta);
}
