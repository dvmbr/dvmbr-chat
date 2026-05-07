export type OkResponseDTO = {
  ok: true;
};

export type ErrorResponseDTO = {
  ok: false;
};

export const OkResponseSchema = {
  type: "object",
  required: ["ok"],
  properties: {
    ok: { type: "boolean" },
  },
} as const;

export const ErrorResponseSchema = {
  type: "object",
  required: ["ok"],
  properties: {
    ok: { type: "boolean" },
  },
} as const;
