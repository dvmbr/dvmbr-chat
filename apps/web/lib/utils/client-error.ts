import { HTTPError } from "ky";
import { ErrorResponse } from "../schemas_old/response.schema";

export async function parseApiError(error: unknown): Promise<{
  message: string;
  meta?: Record<string, unknown>;
  raw?: unknown;
}> {
  if (error instanceof HTTPError) {
    try {
      const body = (await error.response.json()) as ErrorResponse;

      return {
        message: body.error || "Request failed",
        meta: body.meta,
        raw: body,
      };
    } catch {
      return {
        message: `Request failed: ${error.response.status}`,
      };
    }
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Unknown error" };
}
