import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Job } from "@/models/Job";
import { conversionQueue } from "@/lib/queue";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const targetFormat = formData.get("targetFormat") as string;

    if (!file || !targetFormat) {
      return NextResponse.json({ error: "Missing file or targetFormat" }, { status: 400 });
    }

    const sourceFormat = file.name.split(".").pop()?.toLowerCase() || "unknown";
    
    // Connect DB
    await dbConnect();

    // Create Job in DB
    const jobRecord = await Job.create({
      originalFileName: file.name,
      sourceFormat,
      targetFormat,
      status: "pending",
      progress: 0,
      fileSize: file.size,
    });

    // Save File locally for development (simulate cloud storage upload)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filePath = path.join(uploadsDir, `${jobRecord._id}.${sourceFormat}`);
    await writeFile(filePath, buffer);

    // Add Job to Queue
    await conversionQueue.add("convert", {
      jobId: jobRecord._id.toString(),
      inputFilePath: filePath,
      targetFormat,
    });

    return NextResponse.json({ jobId: jobRecord._id, message: "Job created" });
  } catch (error: any) {
    console.error("Job Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
