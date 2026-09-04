import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export async function GET(req, context) {
  return handler(req, context);
}

export async function POST(req, context) {
  return handler(req, context);
}

