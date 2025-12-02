import type {ApiBase} from "@/types/api";

type ApiErrorOptions = {
  status: number;
  url?: string;
};

export class ApiError extends Error {
  status: number;
  url?: string;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.url = options.url;
  }
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  let json: ApiBase<T>;

  try {
    json = (await res.json()) as ApiBase<T>;
  } catch {
    throw new ApiError(
      "서버 응답을 처리할 수 없습니다. (client-side JSON parsing error)",
      {
        status: res.status,
        url: typeof input === "string" ? input : input.toString(),
      }
    );
  }

  if (!res.ok || !json.ok) {
    throw new ApiError(
      json.message ??
        "요청 처리 중 서버에서 오류가 발생했습니다. (server-side error)",
      {
        status: res.status,
        url: typeof input === "string" ? input : input.toString(),
      }
    );
  }

  return json.data as T;
}
