import CredentialsProvider from "next-auth/providers/credentials";
import { getApiUrl } from "./apiUrl";

// Dynamically configure NEXTAUTH_URL if not explicitly set
if (typeof window === "undefined") {
  if (!process.env.NEXTAUTH_URL) {
    if (process.env.VERCEL_URL) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    } else {
      process.env.NEXTAUTH_URL = "http://localhost:3000";
    }
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const API_URL = getApiUrl();
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          const data = await res.json();

          if (res.ok && data.success && data.token) {
            return {
              id: data.user.id || data.user._id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              token: data.token
            };
          }
          return null;
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        if (!session.user) session.user = {};
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  }
};
