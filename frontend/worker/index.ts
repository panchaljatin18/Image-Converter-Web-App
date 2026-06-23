import { Worker } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import { Job as JobModel } from "../src/models/Job";
import path from "path";

// Connect DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/convertgalaxy";
mongoose.connect(MONGODB_URI).then(() => console.log("Worker connected to MongoDB"));

// Connect Redis
const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
});

console.log("Worker waiting for jobs on 'conversion-jobs' queue...");

const worker = new Worker("conversion-jobs", async (job) => {
  const { jobId, inputFilePath, targetFormat } = job.data;
  console.log(`Processing job ${jobId} to format ${targetFormat}`);

  try {
    // 1. Update status to processing
    await JobModel.findByIdAndUpdate(jobId, { status: "processing", progress: 10 });
    
    // TODO: Implement actual conversion logic using sharp/ffmpeg/pdf-lib based on format.
    // For now, simulate work
    await new Promise((res) => setTimeout(res, 1000));
    await JobModel.findByIdAndUpdate(jobId, { progress: 50 });
    
    await new Promise((res) => setTimeout(res, 1000));
    await JobModel.findByIdAndUpdate(jobId, { progress: 90 });

    // Simulate returning the same file or a mocked output path
    const outputUrl = `/uploads/${path.basename(inputFilePath)}`; // In real life, upload to S3 or rename file

    // 2. Mark complete
    await JobModel.findByIdAndUpdate(jobId, { 
      status: "completed", 
      progress: 100,
      outputUrl 
    });

    console.log(`Job ${jobId} completed!`);

  } catch (error: any) {
    console.error(`Job ${jobId} failed:`, error);
    await JobModel.findByIdAndUpdate(jobId, { 
      status: "failed", 
      errorMessage: error.message || "Unknown error" 
    });
  }
}, { connection });

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});
