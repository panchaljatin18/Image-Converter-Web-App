import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getDriveFiles } from "@/lib/google-drive";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const nextPageToken = searchParams.get("pageToken") || "";
  const query = searchParams.get("query") || "";
  const folderId = searchParams.get("folderId") || "root";

  try {
    const data = await getDriveFiles(session.accessToken, folderId, query, nextPageToken);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Server error listing drive files:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
