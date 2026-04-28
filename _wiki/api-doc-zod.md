# API Documentation with Zod (Project Study Notes)

## Why I Switched from Swagger Comments to Zod

When I started documenting my API, I used Swagger JSDoc comments. It worked for a while, but as the project grew, maintaining documentation became a hassle. I switched to a Zod-based approach, and the difference was significant.

---

### Before: Swagger Comment-Based Docs

I used to write Swagger comments above each endpoint, like this:

```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users or a specific user by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(req: NextRequest) {
  // ...
}
```

This was easy to start, but as endpoints and response structures changed, I had to update validation, types, and comments separately. Duplication and drift were inevitable.

---

### Problems I Faced

1. **Duplication**: Validation logic, type definitions, Swagger comments, and response format were all separate. Any change meant updating multiple places.
2. **No Type Safety**: Swagger comments are just strings. No autocomplete, no type checking, and easy to get out of sync with real code.
3. **Messy Response Structures**: Standardized API responses (with `data`, `message`, `statusCode`, `timestamp`) meant repeating the same structure in every Swagger response.

---

### After: Zod-Based Documentation

I moved to Zod schemas as the single source of truth for validation, types, and documentation.

#### Step 1: Define Schemas with Zod

```typescript
import { z } from "@/lib/openapi/zod";

export const UserSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateUserSchema = z.object({
  nickname: z.string(),
});
```

Now, this schema is used for validation, type inference, and OpenAPI docs.

#### Step 2: Use for Runtime Validation

```typescript
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateUserSchema.parse(body);
  const user = await prisma.user.create({
    data: { nickname: parsed.nickname },
  });
  return sendOk(toUserDto(user), 201);
}
```

No duplication. Validation and docs are always in sync.

#### Step 3: Reusable Response Schemas

```typescript
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
```

#### Step 4: Use in OpenAPI Registration

```typescript
registry.registerPath({
  method: "get",
  path: "/api/users",
  summary: "Get users",
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: listOpenApi(UserSchema),
        },
      },
    },
  },
});
```

Docs are now generated from the same schemas used for validation and types.

#### Step 5: Runtime Response Matches Docs

```typescript
export function sendList<T>(items: T[]) {
  return NextResponse.json({
    data: {
      items,
      total: items.length,
    },
    statusCode: 200,
    timestamp: new Date().toISOString(),
  });
}
```

The runtime response, Zod schema, and OpenAPI docs all share the same structure.

---

### Example Comparison

**Before (Swagger Comment):**

```typescript
/**
 * @swagger
 * /api/users:
 *   get:
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 */
```

**After (Zod):**

```typescript
schema: listOpenApi(UserSchema);
```

---

### What Actually Improved

1. **Single Source of Truth**: Validation, types, and docs all come from Zod schemas.
2. **Less Duplication**: No more rewriting the same structure in comments.
3. **Safer Refactoring**: Change a field in the schema, and everything else updates automatically.
4. **Cleaner Docs Code**: OpenAPI setup is now composable and less verbose.

---

### Final Thoughts

Swagger comments are fine for small projects or quick prototyping, but they don't scale well. Zod-based schemas require a bit more setup, but they:

- Reduce duplication
- Keep docs in sync with code
- Make refactoring safer
- Provide better type safety and developer experience
