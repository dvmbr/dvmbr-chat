# Creating Messages with React Query (Optimistic UI)

## One-line Definition

Show the message in the UI immediately after sending, then synchronize with the server response.

---

### 1. Basic Message Creation (No Optimistic UI)

The simplest form:

```ts
export function useCreateMessage(roomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: MessageCreateBodyDTO) => {
      const res = await apiClient
        .post(`rooms/${roomId}/messages`, { json: body })
        .json<OkResponse<MessageDTO>>();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", roomId],
      });
    },
  });
}
```

**Flow:**

1. Send message
2. Make server request
3. On success, refetch message list
4. UI updates

**Problem:**

- There is a short delay after sending before the message appears
- Users may feel like their message was not sent

---

### 2. With Optimistic UI

Now, show the message in the UI before the server responds.

```ts
export function useCreateMessage(roomId: number, participantId: number) {
  const queryClient = useQueryClient();
  return useMutation<
    MessageDTO,
    ErrorResponse,
    MessageCreateBodyDTO,
    { previousMessages?: ListResponse<MessageDTO>["data"] }
  >({
    mutationFn: async (body) => {
      const res = await apiClient
        .post(`rooms/${roomId}/messages`, { json: body })
        .json<OkResponse<MessageDTO>>();
      return res.data;
    },
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: ["messages", roomId] });
      const previousMessages = queryClient.getQueryData<
        ListResponse<MessageDTO>["data"]
      >(["messages", roomId]);
      const optimisticMessage: MessageDTO = {
        id: Date.now() * -1, // Temporary ID to avoid collision
        roomId,
        participantId,
        content: body.content,
        type: body.type,
        isDeleted: false,
        isEdited: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData(["messages", roomId], (old) => ({
        items: [...(old?.items ?? []), optimisticMessage],
        total: (old?.total ?? 0) + 1,
      }));
      return { previousMessages };
    },
    onError: (_error, _body, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", roomId],
          context.previousMessages,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", roomId],
      });
    },
  });
}
```

---

### 3. Flow Comparison

**Basic:**  
Input → Server request → Response → UI update

**Optimistic:**  
Input → UI updates immediately → Server request → Rollback on failure → Sync on success

---

### 4. Key Points

#### 1️⃣ onMutate

- Runs before the server request
- Creates an optimistic message
- Updates the cache immediately

#### 2️⃣ Temporary Message

- `id: Date.now() * -1`
- Prevents collision with server IDs
- Easy to distinguish in the UI

#### 3️⃣ cancelQueries

- Cancels ongoing GET requests
- Prevents overwriting optimistic data

#### 4️⃣ Rollback (onError)

- Restores previous state if the request fails

#### 5️⃣ Final Sync (onSettled)

- `invalidateQueries` ensures the UI matches the server

---

### 5. Usage Difference

**Basic:**

```ts
const { mutate } = useCreateMessage(roomId);
mutate({
  content: input,
  type: "TEXT",
});
```

**Optimistic:**

```ts
const { mutate } = useCreateMessage(roomId, participantId);
mutate({
  content: input,
  type: "TEXT",
});
```

**Difference:**

- `participantId` is added
- Needed to show the optimistic message as if it was sent by "me"

---

### 6. Result

**Before:**  
Send message → Short blank → Message appears

**After:**  
Send message → Appears instantly → Feels natural

---
