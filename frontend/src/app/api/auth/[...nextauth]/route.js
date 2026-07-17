import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("[NEXTAUTH]: NextAuth route handler file evaluated.");

const handler = NextAuth(authOptions);

const wrappedHandler = async (req, ctx) => {
  console.log(`[NEXTAUTH]: Request received: ${req.method} ${req.nextUrl?.pathname || req.url}`);
  try {
    const res = await handler(req, ctx);
    console.log(`[NEXTAUTH]: Response status: ${res.status}`);
    return res;
  } catch (err) {
    console.error("[NEXTAUTH]: Error in handler:", err);
    throw err;
  }
};

export { wrappedHandler as GET, wrappedHandler as POST };
