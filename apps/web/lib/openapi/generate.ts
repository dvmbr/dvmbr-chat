import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { registerEntryOpenApi } from "./entry.openapi";

const registry = new OpenAPIRegistry();

registerEntryOpenApi(registry);

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
