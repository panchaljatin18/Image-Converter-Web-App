import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { downloadDriveFile } from "@/lib/google-drive";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 });
  }

  try {
    const { name, mimeType, body } = await downloadDriveFile(session.accessToken, fileId);

    const headers = new Headers();
    headers.set("Content-Type", mimeType || "application/octet-stream");
    headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}"`);

    return new NextResponse(body, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("Server error downloading drive file:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
