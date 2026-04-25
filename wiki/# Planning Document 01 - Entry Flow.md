# Planning Document 01 - Entry Flow

## Entry Flow

### Purpose

- Automatically identify and handle both new and returning users
- Provide simple authentication and user identification based on cookies

---

### Flow Summary

1. **Initial Entry**

- Client sends a POST request to `/api/entry` without body
- Server checks for a `browserToken` cookie
- If the cookie exists, Move to the `Returning (Auto Login)` flow
- If the cookie is missing or does not match any user, proceed to the New Entry flow.
- If the request body is missing or invalid in the New Entry flow, respond with 400 Bad Request.

2. **Returning (Auto Login)**
   - Attempt to find user in DB with the `browserToken`
   - If the user exists, respond with `user data` and `isNew: false`
   - If the user does not exist, proceed to the `New Entry` flow

3. **New Entry**
   - Client sends a POST request to `/api/entry` with a `nickname` in the body
   - Server validates the nickname (using Zod)
   - If valid, generate a new `browserToken` and create a user in the DB
   - If the nickname is duplicated, return `409 Conflict` (client should prompt for a new nickname)
   - On success, set the `browserToken` cookie and respond with `user data` and `isNew: true`

4. **Error Handling**
   - All exceptions are caught and return a unified error response (no internal error details exposed)

---

### Backend Scenarios

- **First Visit:**  
  Enter nickname → Create new user → Issue `browserToken` cookie → Respond with `isNew: true`

- **Returning Visit:**  
  `browserToken` cookie sent automatically → Lookup user → Respond with `isNew: false`

- **Cookie exists but user not found in DB:**  
  Automatically switch to `New Entry` flow

---

### Frontend Scenarios

1. **First Visit (No Cookie)**

- User opens the site for the first time.
- Client sends a POST request to `/api/entry` with no body.
- Server responds with `400 Bad Request`.
- Client shows a nickname input form.
- User enters a nickname and submits.
- Client sends a POST request to `/api/entry` with `{ nickname }`.
- On success, client receives user data, `isNew: true`, and sets the `browserToken` cookie.

2. **Returning Visit (Valid Cookie)**

- User revisits the site with a valid `browserToken` cookie.
- Client sends a POST request to `/api/entry` with no body.
- Server finds the user and responds with user data and `isNew: false`.
- Client logs in the user automatically.

3. **Returning Visit (Cookie Exists, User Not Found)**

- User revisits with a `browserToken` cookie, but the user is not in the DB.
- Client sends a POST request to `/api/entry` with no body.
- Server cannot find the user, so client is prompted for a nickname (same as first visit).
- User enters a nickname, and the flow continues as in the first visit.

4. **Nickname Duplication**

- User enters a nickname that already exists.
- Server responds with `409 Conflict`.
- Client shows an error and prompts for a different nickname.

5. **General Error Handling**

- Any unexpected error returns a standardized error response.
- Client displays a generic error message to the user.

---

# Additional Notes

- Cookies are set with `httpOnly`, `sameSite`, and `secure` options
- Nickname duplication and validation are handled consistently on the server
- All errors are returned in a standardized error response format
