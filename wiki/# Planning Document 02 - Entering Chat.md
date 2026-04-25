# Planning Document 02 - Chat Room Entry Flow

## Chat Room Entry Flow

### Purpose

- Automatically handle chat room entry from either the home page or the room list page
- Create a new room for new users or redirect returning users to their last visited room

---

### Flow Summary

1. **Home Page Entry**

- Client sends a POST request to `/api/rooms/entry` without a body
- Server checks for a `browserToken` cookie
- If the cookie is missing, return `401 Unauthorized`
- If the cookie does not match any user, return `404 Not Found`
- If the user exists:
  - If the user has a `lastRoomId`, enter that room
  - Otherwise, create a new chat room
- In both cases:
  - Upsert a participant for the user in the room
  - Update the user's `lastRoomId`
  - Respond with the room entry data
- If any step fails, return `500 Internal Server Error`

2. **Room List Entry**

TBD

3. **Room List Creation**

TBD

---

### Backend Scenarios

1. **Home Page Entry**
   - Client sends a POST request to `/api/rooms/entry` with no body (`browserToken` cookie included).
   - Server checks for the `browserToken` cookie:
     - If missing, returns `401 Unauthorized`.
     - If present, finds the user by `browserToken`.
       - If user not found, returns `404 Not Found`.
       - If user found:
         - If user has `lastRoomId`, finds the corresponding Room.
         - If not, creates a new Room (name: `${user.nickname}'s room`, creatorId: user.id).
         - Upserts a participant for the user in the room (userId, roomId).
         - Updates the user's `lastRoomId` to the room id.
         - Returns `{ roomId, participantId }`.
   - If any exception occurs, returns `500 Internal Server Error`.

2. **Room List Entry**

TBD

3. **Room List Creation**

TBD

---

### Frontend Scenarios

1. **Home Page Entry**
   - When the user enters the home page, send a POST request to `/api/rooms/entry` (cookie sent automatically).
   - Handle responses:
     - 401 Unauthorized: No login/entry info, show nickname input or initial entry flow.
     - 404 Not Found: User info lost, prompt for re-registration or show error message.
     - 200 OK + `{ roomId, participantId }`: Enter the chat room with the given roomId (redirect or update state).
     - 500 Internal Server Error: Show a generic error message.

2. **Room List Entry**

TBD

3. **Room List Creation**

TBD

---
