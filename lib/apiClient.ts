import ky from "ky";
import { ErrorResponse } from "./schema/response.schema";

export const apiClient = ky.create({
  prefixUrl: "/api",
  credentials: "same-origin",
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          let message = "Request failed";

          try {
            const body: ErrorResponse = await response.clone().json();
            message = body.error || message;
          } catch {
            // ignore json parse error
          }

          throw new Error(message);
        }
      },
    ],
  },
});
