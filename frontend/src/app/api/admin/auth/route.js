import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { username, password } = await req.json()

    // Secure credentials verification
    const expectedUsername = "Jatin Panchal"
    const expectedPassword = process.env.ADMIN_PASSWORD || "Jatin@123@$$#$"

    if ((username === expectedUsername || username === "jmpanchal394@gmail.com") && password === expectedPassword) {
      const response = NextResponse.json({
        success: true,
        message: "Authentication successful.",
      })

      // Save authorization cookie for current browser session
      response.cookies.set("cg_admin_session", "authorized", {
        path: "/",
        httpOnly: false, // readable by client components
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: "Incorrect admin password." },
      { status: 401 },
    )
  } catch (error) {
    console.error("Error in auth API:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
