# dvmbr-chat

## Overview

A real-time chat monorepo built with a Next.js web app, a Fastify Socket.IO server, and shared TypeScript contracts.

## Tech Stack

- Web: Next.js, React, Prisma, PostgreSQL
- Socket Server: Fastify, Socket.IO
- Shared: socket event, contract, and payload schemas
- Workspace: pnpm

## Repository Structure

```text
apps/web
apps/socket-server
packages/shared
```

## Getting Started

Use Node.js 22 and pnpm.

```bash
pnpm install
```

Create the environment files for both apps.

```text
apps/web/.env.local
apps/socket-server/.env
```

For local development, the web app should point to the local socket server.

```text
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_SERVER_URL=http://localhost:4000
SOCKET_INTERNAL_SECRET=your-local-secret
DATABASE_URL=postgresql://...
```

```text
# apps/socket-server/.env
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
SOCKET_INTERNAL_SECRET=your-local-secret
```

Prepare the database from the web app workspace.

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

Start the socket server and the web app in separate terminals.

```bash
pnpm dev:socket
```

```bash
pnpm dev:web
```

The web app runs on `http://localhost:3000` and the socket server runs on `http://localhost:4000` by default.

## Scripts

```bash
pnpm dev:web
pnpm build:web
pnpm dev:socket
pnpm build:socket
pnpm start:socket
pnpm lint
```

## Shared Package

`@dvmbr/shared` provides socket events, payload schemas, and type contracts shared by the web app and socket server.

## API / Socket Notes

The web app exposes its HTTP API through Next.js route handlers under `apps/web/app/api`.

- `POST /api/entry`: creates a user from a nickname and stores the generated browser token in an HTTP-only cookie.
- `GET /api/rooms`: returns the rooms joined by the current user.
- `POST /api/rooms`: creates a new room owned by the current user.
- `PATCH /api/rooms/:roomId`: updates a room name. Only the room creator can update it.
- `DELETE /api/rooms/:roomId`: deletes a room. Only the room creator can delete it.
- `POST /api/rooms/entry`: enters the user's last room, or creates a default room when no valid last room exists.
- `POST /api/rooms/:roomId/entry`: joins a specific room and updates the user's last room.
- `GET /api/rooms/:roomId/messages`: returns messages for a room when the current user is a participant.
- `POST /api/rooms/:roomId/messages`: creates a message, updates the room timestamp, and sends unread-count updates to the socket server.
- `POST /api/rooms/:roomId/read`: marks the room as read for the current user and resets that user's unread count.

The socket server owns real-time delivery through Socket.IO. Clients connect with `userId` and an optional `roomId` query. The connection joins a user channel (`user:{userId}`) and, when provided, a room channel (`room:{roomId}`).

Socket events are defined in `packages/shared`.

- `message:created`: emitted by a client after creating a message through the HTTP API; the socket server validates the payload and broadcasts it to other clients in the same room.
- `room:unread-count-updated`: emitted by the socket server to a user's channel when unread counts change.

The web app also calls the socket server's internal HTTP endpoint:

- `POST /internal/unread-count`: accepts unread-count payloads and emits `room:unread-count-updated`. Requests must include the internal secret header.

## Data Model

The database schema is defined with Prisma in `apps/web/prisma/schema.prisma`.

- `User`: represents a browser-based chat user. Each user has a unique `nickname`, a unique `browserToken`, and an optional `lastRoomId` used for room re-entry.
- `Room`: represents a chat room. Each room has a unique `name`, a creator, participants, and messages.
- `Participant`: connects a user to a room. It stores `lastReadAt` for unread-count calculation and enforces one participant record per user-room pair.
- `Message`: stores room messages with a participant author, message content, message type, edit/delete flags, and timestamps.
- `MessageType`: classifies messages as `TEXT`, `IMAGE`, or `SYSTEM`.

Core relationships:

- A user can create many rooms.
- A user can participate in many rooms through `Participant`.
- A room can have many participants and many messages.
- A message belongs to both a room and the participant who sent it.
