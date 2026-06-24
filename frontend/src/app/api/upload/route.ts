import { NextRequest, NextResponse } from "next/server";
import { appendFile, writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import dbConnect from "@/lib/db";
import { Job } from "@/models/Job";
import { conversionQueue } from "@/lib/queue";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const chunk = formData.get("chunk") as Blob;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string, 10);
    const totalChunks = parseInt(formData.get("totalChunks") as string, 10);
    const fileName = formData.get("fileName") as string;
    const targetFormat = formData.get("targetFormat") as string;
    const uploadId = formData.get("uploadId") as string;
    const optionsStr = formData.get("options") as string;

    let options = {};
    if (optionsStr) {
      try {
        options = JSON.parse(optionsStr);
      } catch (e) {}
    }

    if (!chunk || isNaN(chunkIndex) || isNaN(totalChunks) || !fileName || !targetFormat || !uploadId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const tempDir = path.join(process.cwd(), "public", "uploads", "temp");
    if (!fs.existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, `${uploadId}_${fileName}`);
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());

    if (chunkIndex === 0) {
      await writeFile(tempFilePath, chunkBuffer);
    } else {
      await appendFile(tempFilePath, chunkBuffer);
    }

    // If it's the last chunk, we move it and create the job
    if (chunkIndex === totalChunks - 1) {
      const sourceFormat = fileName.split(".").pop()?.toLowerCase() || "unknown";
      
      await dbConnect();

      // Get final file size
      const stats = fs.statSync(tempFilePath);

      const jobRecord = await Job.create({
        originalFileName: fileName,
        sourceFormat,
        targetFormat,
        options,
        status: "pending",
        progress: 0,
        fileSize: stats.size,
      });

      const finalPath = path.join(process.cwd(), "public", "uploads", `${jobRecord._id}.${sourceFormat}`);
      fs.renameSync(tempFilePath, finalPath);

      await conversionQueue.add("convert", {
        jobId: jobRecord._id.toString(),
        inputFilePath: finalPath,
        targetFormat,
        options,
      });

      return NextResponse.json({ 
        message: "Upload complete and job created", 
        jobId: jobRecord._id,
        complete: true
      });
    }

    return NextResponse.json({ message: `Chunk ${chunkIndex + 1}/${totalChunks} received`, complete: false });

  } catch (error: any) {
    console.error("Chunk Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
