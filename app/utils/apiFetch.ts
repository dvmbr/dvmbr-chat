"use client";

import {ApiResponseBody} from "@/types/api";
import {FetchError} from "../errors/FetchError";

function normalizeError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (typeof e === "number" || typeof e === "boolean") return String(e);

  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}

export function apiBody<T>(payload: T): string {
  return JSON.stringify(payload);
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const url = typeof input === "string" ? input : input.toString();
  const isJsonRequest = !(init?.body instanceof FormData);

  let res: Response;

  // 1) fetch 자체 실패 처리
  try {
    res = await fetch(input, {
      ...init,
      headers: {
        ...(isJsonRequest ? {"Content-Type": "application/json"} : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch (e) {
    throw new FetchError(
      `요청을 전송하지 못했습니다.\nNetworkError: ${normalizeError(e)}`,
      {
        status: 0,
        url,
      }
    );
  }

  // 2) JSON 파싱 실패 처리
  let json: ApiResponseBody<T>;
  try {
    json = (await res.json()) as ApiResponseBody<T>;
  } catch (e) {
    throw new FetchError(
      `서버 응답을 해석할 수 없습니다.\nResponseParseError: 서버에서 유효한 JSON을 반환하지 않았습니다.\n${normalizeError(
        e
      )}`,
      {
        status: res.status,
        url,
      }
    );
  }

  // 3) 서버에서 보낸 에러 처리
  const {ok, message, data} = json;

  if (!res.ok || !ok) {
    throw new FetchError(
      `요청 처리 중 서버에서 오류가 발생했습니다.\nServerError: ${
        message ?? "Unknown server error"
      }`,
      {
        status: res.status,
        url,
      }
    );
  }

  return data as T;
}
