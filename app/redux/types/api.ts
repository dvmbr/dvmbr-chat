export type ApiResponseBody<T> = {
  ok: boolean;
  message: string;
  data?: T;
};
