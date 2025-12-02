// 공용 응답 타입
export type ApiBase<T> = {
  ok: boolean;
  message: string;
  data?: T;
};
