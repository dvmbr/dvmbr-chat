import { HTTPError } from "ky";
import { ErrorResponse } from "../schema/response.schema";

export async function parseApiError(error: unknown): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const body = (await error.response.json()) as ErrorResponse;
      return body.error || "Request failed";
    } catch {
      return `Request failed: ${error.response.status}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}
