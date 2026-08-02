import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const reqHandler = NextAuth(authOptions);

async function handler(req, context) {
  const params = await context?.params;
  return reqHandler(req, { ...context, params });
}

export { handler as GET, handler as POST };
