import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { EntrySchema } from "@/lib/schemas/entry/schema";
import { EntryBodySchema } from "@/lib/schemas/entry/request";
import {
  okResponseSchema,
  errorResponseSchema,
} from "@/lib/schemas/response/schema";

export function registerEntryOpenApi(registry: OpenAPIRegistry) {
  registry.register("Entry", EntrySchema);
  registry.register("EntryBody", EntryBodySchema);
  registry.register("ErrorResponse", errorResponseSchema());

  registry.registerPath({
    method: "post",
    path: "/api/entry",
    summary: "Create or retrieve user entry",
    description:
      "Creates a new user with a nickname or retrieves existing user by browser token",
    request: {
      body: {
        content: {
          "application/json": {
            schema: EntryBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User entry created/retrieved successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(EntrySchema),
          },
        },
      },
      400: {
        description: "Invalid request body - nickname is required",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
      409: {
        description: "Nickname already exists",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
    },
  });
}
