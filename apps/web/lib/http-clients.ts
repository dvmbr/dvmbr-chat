import ky, { Hooks } from "ky";
import { ErrorResponse } from "./schemas/response.schema";

const hooks: Hooks = {
  afterResponse: [
    async (_request: Request, _options: unknown, response: Response) => {
      if (!response.ok) {
        const errorBody = (await response.json()) as ErrorResponse;
        throw errorBody;
      }
    },
  ],
};

export const apiClient = ky.create({
  prefixUrl: "/api",
  credentials: "same-origin",
  hooks,
});

export const socketClient = ky.create({
  prefixUrl: process.env.SOCKET_SERVER_URL,
  hooks,
});
