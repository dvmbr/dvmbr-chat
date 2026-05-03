export const ERROR_CONSTANTS = {
  BAD_REQUEST: {
    error: "Invalid request",
    statusCode: 400,
  },
  UNAUTHORIZED: {
    error: "Unauthorized",
    statusCode: 401,
  },
  PAYMENT_REQUIRED: {
    error: "Payment required",
    statusCode: 402,
  },
  FORBIDDEN: {
    error: "Forbidden",
    statusCode: 403,
  },
  NOT_FOUND: {
    error: "Not found",
    statusCode: 404,
  },
  METHOD_NOT_ALLOWED: {
    error: "Method not allowed",
    statusCode: 405,
  },
  NOT_ACCEPTABLE: {
    error: "Not acceptable",
    statusCode: 406,
  },
  REQUEST_TIMEOUT: {
    error: "Request timeout",
    statusCode: 408,
  },
  CONFLICT: {
    error: "Conflict",
    statusCode: 409,
  },
  GONE: {
    error: "Gone",
    statusCode: 410,
  },
  UNSUPPORTED_MEDIA_TYPE: {
    error: "Unsupported media type",
    statusCode: 415,
  },
  UNPROCESSABLE_ENTITY: {
    error: "Unprocessable entity",
    statusCode: 422,
  },
  TOO_MANY_REQUESTS: {
    error: "Too many requests",
    statusCode: 429,
  },
  INTERNAL_SERVER_ERROR: {
    error: "Internal server error",
    statusCode: 500,
  },
  NOT_IMPLEMENTED: {
    error: "Not implemented",
    statusCode: 501,
  },
  BAD_GATEWAY: {
    error: "Bad gateway",
    statusCode: 502,
  },
  SERVICE_UNAVAILABLE: {
    error: "Service unavailable",
    statusCode: 503,
  },
  GATEWAY_TIMEOUT: {
    error: "Gateway timeout",
    statusCode: 504,
  },
};

export type ErrorConstantKey = keyof typeof ERROR_CONSTANTS;
