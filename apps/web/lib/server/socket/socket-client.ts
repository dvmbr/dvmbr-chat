import "server-only";

import ky from "ky";
import { SOCKET_INTERNAL_SECRET_HEADER } from "@dvmbr/shared/socket";

export const socketClient = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_SOCKET_SERVER_URL,
  headers: {
    [SOCKET_INTERNAL_SECRET_HEADER]: process.env.SOCKET_INTERNAL_SECRET ?? "",
  },
});
