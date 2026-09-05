import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Input sanitization
    if (!username || !password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid credentials provided." },
        { status: 400 }
      );
    }

    // Secure credentials verification
    const expectedUsername = "Jatin Panchal";
    const expectedPassword = process.env.ADMIN_PASSWORD || "Jatin@123@$$#$";

    const isUsernameValid = username === expectedUsername || username === "hello@convertgalaxy.com" || username === "jmpanchal394@gmail.com";
    const isPasswordValid = password === expectedPassword;

    if (isUsernameValid && isPasswordValid) {
      const response = NextResponse.json({
        success: true,
        message: "Authentication successful.",
      });

      // Save authorization cookie for current browser session
      response.cookies.set("cg_admin_session", "authorized", {
        path: "/",
        httpOnly: false, // readable by client components
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return response;
    }

    // Anti brute-force delay on invalid attempts
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json(
      { success: false, error: "Incorrect admin password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in auth API:", error);
    return NextResponse.json(
      { success: false, error: "Authentication processing error." },
      { status: 500 }
    );
  }
}
