import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Job } from "@/models/Job";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;
    
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    await dbConnect();
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    let outputSize = 0;
    if (job.status === "completed" && job.outputUrl) {
      try {
        const filePath = path.join(process.cwd(), "public", job.outputUrl);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          outputSize = stats.size;
        }
      } catch (err) {
        console.error("Failed to get output file size:", err);
      }
    }

    return NextResponse.json({
      id: job._id,
      status: job.status,
      progress: job.progress,
      outputUrl: job.outputUrl,
      errorMessage: job.errorMessage,
      outputSize,
    });
  } catch (error: any) {
    console.error("Job Status Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

