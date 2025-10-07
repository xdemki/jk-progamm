import { io, Socket } from "socket.io-client";
import { getSession } from "next-auth/react";
import config from '../../config.json'

let socket: Socket | null = null;

export async function initSocket() {
  const session = await getSession();

  if (!session) {
    console.warn("No session found, user not authenticated.");
    return null;
  }

  // Verbindung mit Backend herstellen (Token mitsenden)
  socket = io('localhost:3001'!, {
    auth: {
      token: session.user.id, // oder ein echtes JWT, falls du willst
    },
  });

  socket.on("connect", () => console.log("✅ Connected to backend socket"));
  socket.on("disconnect", () => console.log("❌ Disconnected"));

  return socket;
}

export function getSocket() {
  return socket;
}
