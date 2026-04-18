import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "@/lib/openapi/zod";
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  DeleteUserSchema,
  UserQuerySchema,
} from "@/lib/schema/user.schema";
import {
  okOpenApi,
  listOpenApi,
  errorOpenApi,
} from "@/lib/schema/response.schema";

export function registerUserOpenApi(registry: OpenAPIRegistry) {
  registry.register("User", UserSchema);
  registry.register("CreateUser", CreateUserSchema);
  registry.register("UpdateUser", UpdateUserSchema);
  registry.register("DeleteUser", DeleteUserSchema);
  registry.register("UserQuery", UserQuerySchema);
  registry.register("ErrorResponse", errorOpenApi());

  registry.registerPath({
    method: "get",
    path: "/api/users",
    summary: "Get all users or a specific user by ID",
    request: {
      query: UserQuerySchema,
    },
    responses: {
      200: {
        description: "Users fetched",
        content: {
          "application/json": {
            schema: listOpenApi(UserSchema),
          },
        },
      },
      400: {
        description: "Invalid query",
        content: {
          "application/json": {
            schema: errorOpenApi(),
          },
        },
      },
      404: {
        description: "User not found",
        content: {
          "application/json": {
            schema: errorOpenApi(),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "post",
    path: "/api/users",
    summary: "Create a new user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateUserSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "User created",
        content: {
          "application/json": {
            schema: okOpenApi(UserSchema),
          },
        },
      },
      400: {
        description: "Invalid request body",
        content: {
          "application/json": {
            schema: errorOpenApi(),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/api/users",
    summary: "Update an existing user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: UpdateUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User updated",
        content: {
          "application/json": {
            schema: okOpenApi(UserSchema),
          },
        },
      },
      400: {
        description: "Invalid request body",
        content: {
          "application/json": {
            schema: errorOpenApi(),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/api/users",
    summary: "Delete an existing user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: DeleteUserSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User deleted",
        content: {
          "application/json": {
            schema: okOpenApi(z.null()),
          },
        },
      },
      400: {
        description: "Invalid request body",
        content: {
          "application/json": {
            schema: errorOpenApi(),
          },
        },
      },
    },
  });
}
