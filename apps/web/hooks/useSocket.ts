import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(roomId: number) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("useSocket effect:", roomId);

    const socket = io(process.env.SOCKET_SERVER_URL!, {
      query: { roomId },
    });

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
  }, [roomId]);

  return { socketRef, isConnected };
}
