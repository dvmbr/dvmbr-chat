import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { registerEntryOpenApi } from "./entry.openapi";
import { registerMessageOpenApi } from "./message.openapi";
import { registerRoomEntryOpenApi } from "./room-entry.openapi";
import { registerRoomOpenApi } from "./room.openapi";
import { registerUserOpenApi } from "./user.openapi";

const registry = new OpenAPIRegistry();

registerEntryOpenApi(registry);
registerRoomOpenApi(registry);
registerRoomEntryOpenApi(registry);
registerMessageOpenApi(registry);
registerUserOpenApi(registry);

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "DVMBR Chat API",
      version: "1.0.0",
    },
    servers: [
      {
        url,
      },
    ],
  });
}
