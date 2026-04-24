import ky from "ky";
import { ErrorResponse } from "./schema/response.schema";

export const apiClient = ky.create({
  prefixUrl: "/api",
  credentials: "same-origin",
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          const errorBody = await response.json<ErrorResponse>();
          throw errorBody;
        }
      },
    ],
  },
});
