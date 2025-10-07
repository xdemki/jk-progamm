import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { io } from "socket.io-client";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return new Promise((resolve, reject) => {
          const socket = io("http://localhost:4000"!, {
            transports: ["websocket"],
          });

          socket.on("connect", () => {
            socket.emit("login", {
              username: credentials?.username,
              password: credentials?.password,
            });
          });

          socket.on("loginResponse", (data) => {
            socket.disconnect();

            if (data.success) {
              // Erfolg → gib Userdaten zurück
              resolve(data.user);
            } else {
              // Fehler → Login abgelehnt
              reject(new Error(data.error || "Invalid credentials"));
            }
          });

          socket.on("connect_error", (err) => {
            reject(new Error("Socket connection failed: " + err.message));
          });
        });
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: 'Secret',
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
