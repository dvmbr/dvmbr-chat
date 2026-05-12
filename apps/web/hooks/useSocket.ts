import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dvmbr/shared/socket/contract";
import type { SocketConnectionQuery } from "@dvmbr/shared/socket/query";

export function useSocket(userId: number, roomId?: number) {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

    if (!socketServerUrl) {
      console.error("NEXT_PUBLIC_SOCKET_SERVER_URL is not defined");
      return;
    }

    console.log("useSocket effect:", roomId);
    console.log(socketServerUrl);

    const query: SocketConnectionQuery = {
      userId,
      roomId,
    };

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      socketServerUrl,
      {
        query,
      },
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected:", socket.id, "room:", roomId);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("socket disconnected:", socket.id, "room:", roomId, reason);
      setIsConnected(false);
    });

    return () => {
      console.log("useSocket cleanup:", roomId, socket.id);

      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, roomId]);

  return { socketRef, isConnected };
}
