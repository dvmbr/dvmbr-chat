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
    summary: "Create user entry",
    description:
      "Creates a new user from a nickname and stores a browser token in an HTTP-only cookie",
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
        description: "User entry created successfully",
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
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: errorResponseSchema(),
          },
        },
      },
    },
  });
}
