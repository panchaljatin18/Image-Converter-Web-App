import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Job } from "@/models/Job";

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

    return NextResponse.json({
      id: job._id,
      status: job.status,
      progress: job.progress,
      outputUrl: job.outputUrl,
      errorMessage: job.errorMessage,
    });
  } catch (error: any) {
    console.error("Job Status Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
