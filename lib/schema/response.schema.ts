import { z } from "../openapi/zod";

export function errorOpenApi() {
  return z
    .object({
      data: z.null(),
      error: z.string(),
      statusCode: z.number(),
      timestamp: z.string(),
      meta: z.record(z.string(), z.unknown()).optional(),
    })
    .openapi("ErrorResponse");
}

export function okOpenApi<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    message: z.string().optional(),
    statusCode: z.number(),
    timestamp: z.string(),
  });
}

export function listOpenApi<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.object({
      items: z.array(itemSchema),
      total: z.number(),
    }),
    message: z.string().optional(),
    statusCode: z.number(),
    timestamp: z.string(),
  });
}

export type ErrorResponse = z.infer<ReturnType<typeof errorOpenApi>>;

export type OkResponse<T> = {
  data: T;
  message?: string;
  statusCode: number;
  timestamp: string;
};

export type ListData<T> = {
  items: T[];
  total: number;
};

export type ListResponse<T> = {
  data: ListData<T>;
  message?: string;
  statusCode: number;
  timestamp: string;
};
