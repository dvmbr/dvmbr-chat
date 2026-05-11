import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@dvmbr/shared/socket/socket-contract";
import type { SocketConnectionQuery } from "@dvmbr/shared/socket/socket-query";

export function useSocket(participantId: number, roomId: number) {
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("useSocket effect:", roomId);

    const query: SocketConnectionQuery = {
      userId: participantId,
      roomId,
    };

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      process.env.SOCKET_SERVER_URL!,
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
  }, [participantId, roomId]);

  return { socketRef, isConnected };
}
