# Error Response Pattern

## Purpose

Unify API error response structure across the project.

---

## 1. Error Constants

**Location:** `/lib/constants/error-constants.ts`

- `ERROR_CONSTANTS.BAD_REQUEST`
- `ERROR_CONSTANTS.UNAUTHORIZED`
- `ERROR_CONSTANTS.FORBIDDEN`
- `ERROR_CONSTANTS.NOT_FOUND`
- `ERROR_CONSTANTS.CONFLICT`
- `ERROR_CONSTANTS.INTERNAL_SERVER_ERROR`
- and more...

All default error messages and HTTP status codes are managed in `ERROR_CONSTANTS`.

---

## 2. Error Response Shape

```json
{
  "error": "string",
  "statusCode": 400,
  "timestamp": "2026-04-24T03:00:00.000Z",
  "meta": { "key": "value" }
}
```

**Example:**

```json
{
  "error": "Invalid request",
  "statusCode": 400,
  "timestamp": "2026-04-24T03:00:00.000Z",
  "meta": {
    "expected": "{ nickname: string }",
    "details": "nickname must be at least 1 character"
  }
}
```

---

## 3. Basic Usage

In route handlers, use helpers instead of calling `sendError()` directly.

```ts
return badRequest();
return unauthorized();
return forbidden();
return notFound();
return conflict();
return internalServerError(error);
```

If you need to include meta information:

```ts
return badRequest({
  expected: "{ nickname: string }",
  details: "nickname must be at least 1 character",
});
```

---

## 4. Prisma Error Mapping

`toErrorResponse()` converts Prisma errors to unified error responses.

- `P2002` → 409 Conflict
- `P2003` → 400 Bad Request
- `P2025` → 404 Not Found
- Others → 500 Internal Server Error

**Example:**

```ts
case "P2002":
  return {
    ...E.CONFLICT,
    meta: {
      prismaCode: "P2002",
    },
  };
```

---

## 5. Route Pattern

```ts
export async function POST(req: NextRequest) {
  try {
    // business logic
  } catch (error) {
    return internalServerError(error);
  }
}
```

Even if you call `internalServerError(error)`, Prisma errors will be mapped to the appropriate status code by `toErrorResponse()`.
