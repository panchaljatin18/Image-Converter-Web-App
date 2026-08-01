import { NextResponse } from "next/server";

/**
 * Server-side security guard for admin API routes.
 * Verifies that the incoming request contains a valid authorized admin session cookie.
 */
export function verifyAdminAuth(req) {
  try {
    const adminCookie = req.cookies.get("cg_admin_session")?.value;

    if (adminCookie !== "authorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access: Admin security clearance required." },
        { status: 401 }
      );
    }
    return null; // Authorization passed
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Authentication verification failed." },
      { status: 401 }
    );
  }
}
