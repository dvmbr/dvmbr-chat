import {NextResponse} from "next/server";
import {ApiResponseBody, ServerApiResponse} from "./api.types";

export default function serverApiResponse<T>(
  status: number,
  message: string,
  data: T
): ServerApiResponse<T> {
  const ok = status >= 200 && status < 300;

  const body: ApiResponseBody<T> = {ok, message, data};

  return NextResponse.json(body, {status});
}
