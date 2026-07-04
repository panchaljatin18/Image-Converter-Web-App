import { Worker, Job } from "bullmq"
try {
  process.loadEnvFile(".env.local")
} catch (e) {
  console.warn("Failed to load .env.local", e)
}

import mongoose from "mongoose"
import { Job as JobModel } from "../src/models/Job"
import path from "path"
import fs from "fs"
import { processImage } from "./processors/imageProcessor"
import { processVideoAudio } from "./processors/videoAudioProcessor"
import { processDocument } from "./processors/documentProcessor"
import { processArchive } from "./processors/archiveProcessor"
import { processSpreadsheet } from "./processors/spreadsheetProcessor"
import { processPresentation } from "./processors/presentationProcessor"
import { processEbook } from "./processors/ebookProcessor"
import { validateOutput } from "./validators/outputValidator"

// Connect DB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/convertgalaxy"
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Worker connected to MongoDB"))

// Connect Redis
const redisUrl = new URL(process.env.REDIS_URL || "redis://127.0.0.1:6379")
const connection: any = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port || "6379"),
  maxRetriesPerRequest: null,
}

if (redisUrl.password) {
  connection.password = redisUrl.password
}
if (redisUrl.protocol === "rediss:") {
  connection.tls = {}
}

console.log("Worker waiting for jobs on 'conversion-jobs' queue...")

const imageFormats = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "bmp",
  "tiff",
  "svg",
  "ico",
  "heic",
  "3fr",
  "arw",
  "cr2",
  "cr3",
  "crw",
  "dcr",
  "dng",
  "erf",
  "kdc",
  "mdc",
  "mef",
  "mos",
  "mrw",
  "nef",
  "nrw",
  "orf",
  "pef",
  "raf",
  "raw",
  "rw2",
  "srf",
  "x3f",
]
const documentFormats = ["pdf", "docx", "doc", "txt", "rtf", "odt", "html"]
const spreadsheetFormats = ["xlsx", "xls", "csv", "ods"]
const presentationFormats = ["pptx", "ppt", "odp"]
const audioFormats = ["mp3", "wav", "aac", "flac", "ogg", "m4a"]
const videoFormats = ["mp4", "mov", "avi", "mkv", "webm", "wmv"]
const archiveFormats = ["zip", "7z", "tar", "gz"]
const ebookFormats = ["epub", "mobi", "azw3"] // pdf is in documentFormats

const worker = new Worker(
  "conversion-jobs",
  async (job: Job) => {
    const { jobId, inputFilePath, targetFormat, options } = job.data
    console.log(`Processing job ${jobId} to format ${targetFormat}`)

    const cleanFormat = targetFormat.startsWith(".")
      ? targetFormat.slice(1).toLowerCase()
      : targetFormat.toLowerCase()

    // Define output path
    const parsedInput = path.parse(inputFilePath)
    const outputFileName = `${parsedInput.name}_converted_${Date.now()}.${cleanFormat}`
    const outputPath = path.join(parsedInput.dir, outputFileName)

    try {
      // 1. Update status to processing
      await JobModel.findByIdAndUpdate(jobId, {
        status: "processing",
        progress: 10,
      })

      // 2. Route to specific processor
      if (imageFormats.includes(cleanFormat)) {
        await processImage(
          inputFilePath,
          outputPath,
          cleanFormat,
          options || {},
        )
      } else if (
        videoFormats.includes(cleanFormat) ||
        audioFormats.includes(cleanFormat)
      ) {
        await processVideoAudio(inputFilePath, outputPath, cleanFormat, job)
      } else if (documentFormats.includes(cleanFormat)) {
        await processDocument(inputFilePath, outputPath, cleanFormat)
      } else if (spreadsheetFormats.includes(cleanFormat)) {
        await processSpreadsheet(inputFilePath, outputPath, cleanFormat)
      } else if (presentationFormats.includes(cleanFormat)) {
        await processPresentation(inputFilePath, outputPath, cleanFormat)
      } else if (ebookFormats.includes(cleanFormat)) {
        await processEbook(inputFilePath, outputPath, cleanFormat)
      } else if (archiveFormats.includes(cleanFormat)) {
        await processArchive(inputFilePath, outputPath, cleanFormat)
      } else {
        throw new Error(
          `Target format '${cleanFormat}' is not natively supported yet. Please verify your dependencies.`,
        )
      }

      await JobModel.findByIdAndUpdate(jobId, { progress: 95 })

      // 3. Strict Validation
      console.log(`[Job ${jobId}] Conversion finished. Running validation...`)
      await validateOutput(outputPath, cleanFormat)

      // 4. Mark complete
      const outputUrl = `/uploads/${outputFileName}`
      await JobModel.findByIdAndUpdate(jobId, {
        status: "completed",
        progress: 100,
        outputUrl,
      })

      console.log(`Job ${jobId} completed successfully!`)
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error))
      console.error(`Job ${jobId} failed:`, err)

      // Cleanup broken output if exists
      if (fs.existsSync(outputPath)) {
        try {
          fs.unlinkSync(outputPath)
          console.log(`[Job ${jobId}] Cleaned up failed output file.`)
        } catch (cleanupErr) {
          console.error(
            `[Job ${jobId}] Failed to cleanup output file:`,
            cleanupErr,
          )
        }
      }

      await JobModel.findByIdAndUpdate(jobId, {
        status: "failed",
        errorMessage: err.message || "Unknown error",
      })
      throw err // Let BullMQ know it failed
    }
  },
  { connection },
)

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`)
})
