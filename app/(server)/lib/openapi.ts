import { OpenAPIV3 } from "openapi-types";

export const openapiSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "dvmbr-chat API",
    version: "1.0.0",
    description: "Real-time chat API for dvmbr",
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    },
  ],
  paths: {
    "/api/auth": {
      post: {
        summary: "Create session by username",
        description:
          "Creates a new user with a unique username and creates a session.",
        tags: ["auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["userName"],
                properties: {
                  userName: {
                    type: "string",
                    minLength: 2,
                    maxLength: 20,
                    description:
                      "Allowed characters: Korean, English, numbers, '-', '_'",
                    example: "dvmbr_01",
                  },
                },
              },
              examples: {
                valid: {
                  summary: "Valid payload",
                  value: { userName: "dvmbr_01" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Authentication successful",
            headers: {
              "Set-Cookie": {
                description: "Session cookie",
                schema: { type: "string" },
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Authentication successful",
                    },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "clx123abc456" },
                        name: { type: "string", example: "dvmbr_01" },
                      },
                      required: ["id", "name"],
                    },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "400": {
            description: "Validation error (invalid name, empty, exists, etc.)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Invalid name" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
                examples: {
                  invalidJson: {
                    summary: "Invalid JSON body",
                    value: {
                      ok: false,
                      message: "Invalid JSON body",
                      data: {},
                    },
                  },
                  empty: {
                    summary: "Name cannot be empty",
                    value: {
                      ok: false,
                      message: "Name cannot be empty",
                      data: {},
                    },
                  },
                  length: {
                    summary: "Name must be between 2 and 20 characters",
                    value: {
                      ok: false,
                      message: "Name must be between 2 and 20 characters",
                      data: {},
                    },
                  },
                  regex: {
                    summary:
                      "Allowed characters: Korean, English, numbers, '-', '_'",
                    value: {
                      ok: false,
                      message:
                        "Allowed characters: Korean, English, numbers, '-', '_'",
                      data: {},
                    },
                  },
                  exists: {
                    summary: "Name already exists",
                    value: {
                      ok: false,
                      message: "Name already exists",
                      data: {},
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Server error (create user/session failed)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Failed to create session",
                    },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
                examples: {
                  createUser: {
                    summary: "Failed to create user",
                    value: {
                      ok: false,
                      message: "Failed to create user",
                      data: {},
                    },
                  },
                  createSession: {
                    summary: "Failed to create session",
                    value: {
                      ok: false,
                      message: "Failed to create session",
                      data: {},
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/logout": {
      post: {
        summary: "Logout",
        description: "Clears the current session cookie.",
        tags: ["auth"],
        responses: {
          "200": {
            description: "Logged out successfully",
            headers: {
              "Set-Cookie": {
                description: "Cleared session cookie",
                schema: { type: "string" },
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Logged out successfully",
                    },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "500": {
            description: "Failed to logout",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Failed to logout" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/api/me": {
      get: {
        summary: "Get current user",
        description:
          "Returns the currently authenticated user based on session.",
        tags: ["auth"],
        responses: {
          "200": {
            description: "Me fetched",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "Me fetched" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "clx123abc456" },
                        name: { type: "string", example: "dvmbr_01" },
                      },
                      required: ["id", "name"],
                    },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "401": {
            description: "Login required (no valid session)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Login required" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "User not found" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "500": {
            description: "Failed to load me",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Failed to load me" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/api/message": {
      post: {
        summary: "Create message",
        description: "Creates a new message in a chat room.",
        tags: ["message"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["cuid", "roomId", "text", "createdAt"],
                properties: {
                  cuid: {
                    type: "string",
                    description:
                      "Client-generated unique message id (for optimistic UI)",
                    example: "cmsg_123456",
                  },
                  roomId: {
                    type: "string",
                    description: "Target room id",
                    example: "room_abc123",
                  },
                  text: {
                    type: "string",
                    description: "Message content",
                    example: "Hello world",
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    description: "Client-side created time (ISO 8601)",
                    example: "2025-01-01T12:00:00.000Z",
                  },
                },
              },
              examples: {
                valid: {
                  summary: "Valid message payload",
                  value: {
                    cuid: "cmsg_123456",
                    roomId: "room_abc123",
                    text: "Hello world",
                    createdAt: "2025-01-01T12:00:00.000Z",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Message created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "Message created" },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", example: "msg_xyz789" },
                        cuid: { type: "string", example: "cmsg_123456" },
                        roomId: { type: "string", example: "room_abc123" },
                        userId: { type: "string", example: "user_001" },
                        text: { type: "string", example: "Hello world" },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-01-01T12:00:00.000Z",
                        },
                      },
                      required: ["id", "roomId", "userId", "text", "createdAt"],
                    },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "400": {
            description: "Invalid request (JSON / roomId / text)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Invalid text" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
                examples: {
                  invalidJson: {
                    summary: "Invalid JSON body",
                    value: {
                      ok: false,
                      message: "Invalid JSON body",
                      data: {},
                    },
                  },
                  invalidRoomId: {
                    summary: "Invalid roomId",
                    value: { ok: false, message: "Invalid roomId", data: {} },
                  },
                  invalidText: {
                    summary: "Invalid text",
                    value: { ok: false, message: "Invalid text", data: {} },
                  },
                },
              },
            },
          },
          "401": {
            description: "Login required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Login required" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "404": {
            description: "Room not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Room not found" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "500": {
            description: "Failed to create message",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Failed to create message",
                    },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/api/messages/{roomId}": {
      get: {
        summary: "Get messages by room",
        description: "Fetches all messages for a specific chat room.",
        tags: ["message"],
        parameters: [
          {
            name: "roomId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Target room id",
            example: "room_abc123",
          },
        ],
        responses: {
          "200": {
            description: "messages fetched",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "messages fetched" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", example: "msg_xyz789" },
                          cuid: { type: "string", example: "cmsg_123456" },
                          roomId: { type: "string", example: "room_abc123" },
                          userId: { type: "string", example: "user_001" },
                          text: { type: "string", example: "Hello world" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-01T12:00:00.000Z",
                          },
                        },
                        required: [
                          "id",
                          "roomId",
                          "userId",
                          "text",
                          "createdAt",
                        ],
                      },
                    },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "401": {
            description: "Login required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Login required" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "500": {
            description: "Failed to fetch messages",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Failed to fetch messages",
                    },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/api/room": {
      post: {
        summary: "Create room",
        description:
          "Creates a new chat room. The authenticated user becomes the host.",
        tags: ["room"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["roomName"],
                properties: {
                  roomName: {
                    type: "string",
                    description: "Room name (trimmed on the server)",
                    example: "General",
                  },
                },
              },
              examples: {
                valid: {
                  summary: "Valid payload",
                  value: { roomName: "General" },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Room created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "Room created" },
                    data: {
                      type: "object",
                      description: "RoomDTO",
                      properties: {
                        id: { type: "string", example: "room_abc123" },
                        name: { type: "string", example: "General" },
                        hostId: { type: "string", example: "user_001" },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-01-01T12:00:00.000Z",
                        },
                      },
                      required: ["id", "name", "hostId"],
                    },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "400": {
            description: "Invalid request (JSON / room name)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Invalid room name" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
                examples: {
                  invalidJson: {
                    summary: "Invalid JSON body",
                    value: {
                      ok: false,
                      message: "Invalid JSON body",
                      data: {},
                    },
                  },
                  missing: {
                    summary: "Invalid room name",
                    value: {
                      ok: false,
                      message: "Invalid room name",
                      data: {},
                    },
                  },
                  empty: {
                    summary: "Room name cannot be empty",
                    value: {
                      ok: false,
                      message: "Room name cannot be empty",
                      data: {},
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Login required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Login required" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "500": {
            description: "Failed to create room",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Failed to create room",
                    },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/api/rooms": {
      get: {
        summary: "Get rooms",
        description:
          "Fetches all chat rooms the authenticated user belongs to.",
        tags: ["room"],
        responses: {
          "200": {
            description: "Rooms fetched",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "Rooms fetched" },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        description: "RoomDTO",
                        properties: {
                          id: { type: "string", example: "room_abc123" },
                          name: { type: "string", example: "General" },
                          hostId: { type: "string", example: "user_001" },
                          createdAt: {
                            type: "string",
                            format: "date-time",
                            example: "2025-01-01T12:00:00.000Z",
                          },
                          /* 
                        필요하다면:
                        lastMessage, unreadCount, membersCount 등
                        RoomDTO에 실제로 포함된 필드 추가 가능
                      */
                        },
                        required: ["id", "name", "hostId"],
                      },
                    },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "401": {
            description: "Login required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Login required" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "500": {
            description: "Failed to fetch rooms",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Failed to fetch rooms",
                    },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/api/rooms/{roomId}/join": {
      post: {
        summary: "Join room",
        description:
          "Adds the authenticated user as a member of the specified room.",
        tags: ["room"],
        parameters: [
          {
            name: "roomId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Target room id",
            example: "room_abc123",
          },
        ],
        responses: {
          "200": {
            description: "RoomMember joined",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "RoomMember joined" },
                    data: {
                      type: "object",
                      description: "RoomMember",
                      properties: {
                        id: { type: "string", example: "rm_001" },
                        userId: { type: "string", example: "user_001" },
                        roomId: { type: "string", example: "room_abc123" },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2025-01-01T12:00:00.000Z",
                        },
                      },
                      required: ["userId", "roomId"],
                    },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "401": {
            description: "Login required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Login required" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "500": {
            description: "Failed to join room",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Failed to join room" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
        },
      },
    },
    "/api/rooms/{roomId}/read": {
      post: {
        summary: "Mark messages as read",
        description:
          "Marks all messages in the specified room as read for the authenticated user.",
        tags: ["room"],
        parameters: [
          {
            name: "roomId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Target room id",
            example: "room_abc123",
          },
        ],
        responses: {
          "200": {
            description: "mark messages read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: true },
                    message: { type: "string", example: "mark messages read" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "401": {
            description: "Login required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: { type: "string", example: "Login required" },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
          "500": {
            description: "Failed to mark messages read",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean", example: false },
                    message: {
                      type: "string",
                      example: "Failed to mark messages read",
                    },
                    data: { type: "object", example: {} },
                  },
                  required: ["ok", "message"],
                },
              },
            },
          },
        },
      },
    },
  },
};
