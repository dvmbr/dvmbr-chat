# User Scenario

## Project Specification: User Persistence & Room Structure

### 1. Core Concept

- **Home (`/`)** serves as the primary chat interface for all users.
- UI rendering is driven by the **`activeRoomId`**.
- **`User.lastRoomId`** is used to persist and restore the user's last session.
- The first room created by a user is a **formal public room**, not a temporary session.

### 2. Data Models

- **User**: Tracks identity and the last active room.
  - `id`, `nickname`, `lastRoomId` (nullable), `createdAt`, `updatedAt`
- **Room**: Standard public chat room.
  - `id`, `name`, `creatorId`, `createdAt`, `updatedAt`
- **Participant**: Junction table connecting Users and Rooms.
  - `id`, `userId`, `roomId`, `createdAt`, `updatedAt`

### 3. User Scenarios

#### Scenario A: First-Time Visitor

1.  **Entry:** Enters `/` without an existing identity.
2.  **Restriction:** Chat UI is visible, but message input is disabled.
3.  **Registration:** Upon nickname submission, the server executes a transaction:
    - Creates **User**.
    - Creates **Public Room**.
    - Creates **Participant** (Linking user to room).
    - Updates **`User.lastRoomId`** with the new `roomId`.
4.  **Activation:** Client sets the new `roomId` as `activeRoomId` and enables chat.

#### Scenario B: Returning User

1.  **Identification:** Enters `/` with a stored identifier.
2.  **Recovery:** Server fetches user data and identifies **`lastRoomId`**.
3.  **Restoration:** Server validates room/participant status and sets the `activeRoomId`.
4.  **Continuity:** Previous messages are loaded immediately; user resumes chatting.

### 4. State Management Logic

- **`activeRoomId` as Source of Truth:** All navigation events (sidebar clicks, invite links, initial login) simply update the `activeRoomId`.
- **`lastRoomId` Update Trigger:** Updated whenever a user successfully enters or switches to a room.
  - _Note: Updated on "Entry," not "Message Sent," to ensure the last viewed state is preserved._

### 5. UI/UX Flow at Home (`/`)

1.  **Initializing:** Loading state during user identification.
2.  **First-time User:** Displays nickname entry overlay; input locked.
3.  **Restored State:** Full access to message history, input field, and room list.

### 6. Benefits of This Approach

- **Reliability:** `lastRoomId` removes ambiguity about which room to restore.
- **UX Consistency:** Returning users experience an immediate, seamless resume of their last session.
- **Architectural Simplicity:** Eliminates "temporary room" edge cases by treating the first room as a standard entity.
