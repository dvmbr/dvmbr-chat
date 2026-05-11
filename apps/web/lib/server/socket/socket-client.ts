import "server-only";

import ky from "ky";

export const socketClient = ky.create({
  prefixUrl: process.env.SOCKET_SERVER_URL,
});
