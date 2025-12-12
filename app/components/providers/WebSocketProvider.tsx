"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {User} from "@prisma/client";
import {MessageVM} from "@/app/(routes)/chat/[roomId]/_server/MessageVM";
import {RoomVM} from "@/app/(routes)/chat/_server/roomVM";
import {useDispatch} from "react-redux";
import {roomApi} from "@/app/redux/features/roomApi";
import {messageApi} from "@/app/redux/features/messageApi";

type WebSocketValue = {
  wsRef: React.RefObject<WebSocket | null>;
  setWebSocketUser: (user: User | null) => void;
  sendMessageCreated: (message: MessageVM) => void;
  sendRoomCreated: (room: RoomVM) => void;
};

const WebSocketContext = createContext<WebSocketValue | null>(null);

type ProviderProps = {
  children: ReactNode;
};

export function WebSocketProvider({children}: ProviderProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // No user -> do not open WebSocket
    if (!user) {
      // If there is an existing connection -> close it
      const existing = wsRef.current;
      if (
        existing &&
        (existing.readyState === WebSocket.OPEN ||
          existing.readyState === WebSocket.CONNECTING)
      ) {
        existing.close(1000, "User cleared");
        wsRef.current = null;
      }
      return;
    }

    const url = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] open -> join", user.id);
      ws.send(JSON.stringify({type: "join", userId: user.id}));
    };

    ws.onmessage = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let msg: any;
      try {
        msg = JSON.parse(event.data);
      } catch {
        console.warn("[WS] Invalid WS message:", event.data);
        return;
      }

      switch (msg.type) {
        case "messageCreated": {
          console.log(msg);
          dispatch(
            messageApi.util.invalidateTags([{type: "Messages", id: msg.roomId}])
          );
          dispatch(roomApi.util.invalidateTags([{type: "Rooms"}]));
          break;
        }
        case "roomCreated": {
          dispatch(roomApi.util.invalidateTags([{type: "Rooms"}]));
          break;
        }
        default:
          return;
      }
    };

    ws.onerror = (e) => {
      console.warn("[WS] error:", e);
    };

    ws.onclose = (e) => {
      console.log("[WS] closed:", e.code, e.reason || "(no reason)");
    };

    // Cleanup when user changes or provider unmounts
    return () => {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;

      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, "Provider cleanup");
      }
      if (wsRef.current === ws) {
        wsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function sendMessageCreated(message: MessageVM) {
    if (!user) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({type: "messageCreated", ...message}));
  }

  function sendRoomCreated(room: RoomVM) {
    if (!user) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({type: "roomCreated", ...room}));
  }

  const value: WebSocketValue = {
    wsRef,
    setWebSocketUser: setUser,
    sendMessageCreated,
    sendRoomCreated,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketClient() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error(
      "[WS] useWebSocketClient는 WebSocketProvider 안에서만 사용할 수 있습니다."
    );
  }
  return ctx;
}
