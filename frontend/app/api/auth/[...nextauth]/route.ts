import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { io } from "socket.io-client";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        return new Promise(async(resolve) => {
          const request = await fetch("http://localhost:4000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const response = await request.json();

          if (response.success) {
            // login worked
            // user = response.body
            resolve({ id: response.body.userId, name: response.body.username, email: response.body.email });
          } else {
            // login failed - handle notifications client-side in the frontend
            resolve(null);
          }
        });
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
