import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserSchema, UserSummarySchema } from "@/lib/schemas/user/schema";

export function registerUserOpenApi(registry: OpenAPIRegistry) {
  registry.register("User", UserSchema);
  registry.register("UserSummary", UserSummarySchema);
}
