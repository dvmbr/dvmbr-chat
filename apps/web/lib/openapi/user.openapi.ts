import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "@/lib/zod";
import { UserSchema, UserSummarySchema } from "@/lib/schemas/user/schema";
import {
  errorResponseSchema,
  okResponseSchema,
} from "@/lib/schemas/response/schema";

const UserUpdateBodySchema = z
  .object({ nickname: z.string().trim().min(1) })
  .openapi("UserUpdateBody");

const UserDeleteResultSchema = z
  .object({ success: z.literal(true) })
  .openapi("UserDeleteResult");

export function registerUserOpenApi(registry: OpenAPIRegistry) {
  registry.register("User", UserSchema);
  registry.register("UserSummary", UserSummarySchema);
  registry.register("UserUpdateBody", UserUpdateBodySchema);
  registry.register("UserDeleteResult", UserDeleteResultSchema);

  registry.registerPath({
    method: "patch",
    path: "/api/user",
    summary: "Update nickname",
    description: "Updates the authenticated user's nickname",
    request: {
      body: {
        content: {
          "application/json": {
            schema: UserUpdateBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Nickname updated successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(UserSummarySchema),
          },
        },
      },
      400: {
        description: "nickname is missing or empty",
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

  registry.registerPath({
    method: "delete",
    path: "/api/user",
    summary: "Delete account",
    description:
      "Deletes the authenticated user's account and clears the auth cookie. All participants and messages are removed via cascade.",
    responses: {
      200: {
        description: "Account deleted successfully",
        content: {
          "application/json": {
            schema: okResponseSchema(UserDeleteResultSchema),
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
