import {SerializedError} from "@reduxjs/toolkit";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";

export function getRtkErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined
): string {
  if (!error) return "Unknown error";

  // 서버 에러 (status code 있음)
  if ("status" in error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = error.data;

    if (typeof error.status === "number") {
      // 서버에서 준 응답 body가 있을 때
      if (data?.message) return data.message;
      if (typeof data === "string") return data;
      return `Request failed with status ${error.status}`;
    }

    return "Unknown server error";
  }

  // JS 에러
  if ("message" in error) {
    return error.message || "Unknown client error";
  }

  return "Unknown error";
}
