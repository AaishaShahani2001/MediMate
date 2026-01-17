import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.CLIENT_ORIGIN;

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
