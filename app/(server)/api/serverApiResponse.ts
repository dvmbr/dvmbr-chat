import {ApiResponseBody} from "@/app/redux/types/api";
import {NextResponse} from "next/server";

export type ServerApiResponse<T> = NextResponse<ApiResponseBody<T>>;

export default function serverApiResponse<T>(
  status: number,
  message: string,
  data?: T
): ServerApiResponse<T> {
  const ok = status >= 200 && status < 300;

  const body: ApiResponseBody<T> = {ok, message, data};

  return NextResponse.json(body, {status});
}
