import { z } from "../../zod";

export function errorResponseSchema() {
  return z
    .object({
      error: z.string(),
      statusCode: z.number(),
      timestamp: z.string(),
      meta: z.record(z.string(), z.unknown()).optional(),
    })
    .openapi("ErrorResponse");
}

export function okResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z
    .object({
      data: dataSchema,
      message: z.string().optional(),
      statusCode: z.number(),
      timestamp: z.string(),
    })
    .openapi("OkResponse");
}

export function listResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z
    .object({
      data: z.object({
        items: z.array(itemSchema),
        total: z.number(),
      }),
      message: z.string().optional(),
      statusCode: z.number(),
      timestamp: z.string(),
    })
    .openapi("ListResponse");
}

export type ErrorResponse = z.infer<ReturnType<typeof errorResponseSchema>>;

export type OkResponse<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof okResponseSchema<T>>
>;

export type ListData<T> = {
  items: T[];
  total: number;
};

export type ListResponse<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof listResponseSchema<T>>
>;
